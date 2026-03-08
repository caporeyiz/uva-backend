from typing import Dict, List, Any, Optional
import pytesseract
from PIL import Image
import cv2
import numpy as np
from pdf2image import convert_from_path
import re


class OCRService:
    
    @staticmethod
    def preprocess_image(image_path: str) -> np.ndarray:
        """
        OCR için görüntüyü ön işleme tabi tutar.
        """
        img = cv2.imread(image_path)
        
        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        
        denoised = cv2.fastNlMeansDenoising(gray)
        
        _, binary = cv2.threshold(denoised, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        return binary
    
    @staticmethod
    def extract_text_from_image(image_path: str, lang: str = 'tur') -> str:
        """
        Görüntüden metin çıkarır.
        """
        try:
            processed_img = OCRService.preprocess_image(image_path)
            
            text = pytesseract.image_to_string(
                processed_img,
                lang=lang,
                config='--psm 6'
            )
            
            return text.strip()
            
        except Exception as e:
            raise Exception(f"OCR hatası: {str(e)}")
    
    @staticmethod
    def extract_text_from_pdf(pdf_path: str, lang: str = 'tur') -> str:
        """
        PDF'den metin çıkarır.
        """
        try:
            images = convert_from_path(pdf_path)
            
            full_text = ""
            for i, image in enumerate(images):
                text = pytesseract.image_to_string(image, lang=lang)
                full_text += f"\n--- Sayfa {i+1} ---\n{text}"
            
            return full_text.strip()
            
        except Exception as e:
            raise Exception(f"PDF OCR hatası: {str(e)}")
    
    @staticmethod
    def parse_exam_answers(text: str) -> Dict[str, Any]:
        """
        OCR metninden sınav cevaplarını parse eder.
        
        Örnek format:
        1. A
        2. C
        3. B
        ...
        """
        answers = {}
        
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            
            match = re.match(r'(\d+)[\.\)]\s*([A-E])', line, re.IGNORECASE)
            if match:
                question_num = int(match.group(1))
                answer = match.group(2).upper()
                answers[question_num] = answer
        
        return answers
    
    @staticmethod
    def parse_exam_sheet(image_path: str) -> Dict[str, Any]:
        """
        Optik form görüntüsünden cevapları çıkarır.
        """
        try:
            text = OCRService.extract_text_from_image(image_path)
            
            answers = OCRService.parse_exam_answers(text)
            
            subject_sections = OCRService.detect_subject_sections(text)
            
            return {
                "answers": answers,
                "subject_sections": subject_sections,
                "total_questions": len(answers),
                "raw_text": text
            }
            
        except Exception as e:
            raise Exception(f"Sınav formu parse hatası: {str(e)}")
    
    @staticmethod
    def detect_subject_sections(text: str) -> Dict[str, Dict[str, int]]:
        """
        Metinden ders bölümlerini tespit eder.
        """
        sections = {}
        
        subject_patterns = {
            "matematik": r"matematik|mat\.",
            "fizik": r"fizik|fiz\.",
            "kimya": r"kimya|kim\.",
            "biyoloji": r"biyoloji|biyo|bio",
            "turkce": r"türkçe|türk dili|tdk",
            "tarih": r"tarih|tar\.",
            "cografya": r"coğrafya|coğ\.",
            "felsefe": r"felsefe|fel\.",
            "din": r"din kültürü|din",
            "ingilizce": r"ingilizce|ing\."
        }
        
        for subject, pattern in subject_patterns.items():
            matches = re.finditer(pattern, text, re.IGNORECASE)
            for match in matches:
                if subject not in sections:
                    sections[subject] = {
                        "start_position": match.start(),
                        "detected": True
                    }
        
        return sections
    
    @staticmethod
    def calculate_net_scores(
        student_answers: Dict[int, str],
        correct_answers: Dict[int, str],
        subject_ranges: Dict[str, Dict[str, int]]
    ) -> Dict[str, float]:
        """
        Ders bazlı net skorları hesaplar.
        """
        net_scores = {}
        
        for subject, range_info in subject_ranges.items():
            start = range_info.get("start_question", 1)
            end = range_info.get("end_question", 40)
            
            correct = 0
            wrong = 0
            
            for q_num in range(start, end + 1):
                if q_num in student_answers and q_num in correct_answers:
                    if student_answers[q_num] == correct_answers[q_num]:
                        correct += 1
                    else:
                        wrong += 1
            
            net = correct - (wrong / 4)
            net_scores[subject] = round(max(0, net), 2)
        
        return net_scores
