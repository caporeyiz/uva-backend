/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Settings,
  Bot,
  Calendar,
  AlertTriangle,
  FileEdit,
  History,
  Paperclip,
  Send,
  ChevronLeft,
  Loader2,
  Bell,
  LogOut,
  Zap
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { User as AuthUser } from '../services/authService';
import NotificationDropdown from './NotificationDropdown';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

interface ChatPageProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'analysis' | 'chat' | 'login' | 'register' | 'settings' | 'support' | 'admin') => void;
  onLogout: () => void;
  user: AuthUser | null;
}

export default function ChatPage({ onNavigate, onLogout, user }: ChatPageProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: `Merhaba ${user?.name.split(' ')[0] || 'Öğrenci'}! Bugün fizik dünyasına dalmaya hazır mısın? Newton'un hareket yasalarını mı inceleyelim yoksa sınav öncesi biraz motivasyona mı ihtiyacın var?`,
      timestamp: '10:42'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: `Sen YKS sınavına hazırlanan öğrencilere yardımcı olan uzman bir fizik öğretmenisin. Adın UVA Mentor. Öğrencinin sorusu: ${messageText}` }]
          }
        ],
        config: {
          systemInstruction: "Sen YKS (TYT/AYT) sınavına hazırlanan öğrencilere yardımcı olan, cana yakın, motive edici ve uzman bir fizik öğretmenisin. Yanıtların kısa, öz ve öğrenciyi cesaretlendirici olmalı. Eğer öğrenci motivasyon isterse ona ilham verici sözler söyle. Eğer fizik sorusu sorarsa adım adım açıkla.",
        }
      });

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: response.text || "Üzgünüm, şu an yanıt veremiyorum. Lütfen tekrar dene.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Gemini API Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Bir hata oluştu. Lütfen internet bağlantını kontrol et ve tekrar dene.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header Section - Synced with Dashboard */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          <div className="text-primary">
            <Zap size={32} fill="currentColor" />
          </div>
          <h2 className="text-lg font-bold leading-tight tracking-tight hidden sm:block">UVA Sohbet Mentor</h2>
          <div className="flex items-center gap-1.5 sm:ml-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Çevrimiçi</span>
          </div>
        </div>

        <div className="flex flex-1 justify-end gap-4 items-center">
          <div className="hidden md:flex gap-2">
            <NotificationDropdown user={user} />
            <button
              onClick={() => onNavigate('settings')}
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors"
            >
              <Settings size={20} />
            </button>
            <button
              onClick={onLogout}
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.name || 'Misafir Kullanıcı'}</p>
              <p className="text-xs text-slate-500">YKS Öğrencisi</p>
            </div>
            <div
              className="size-10 rounded-full bg-primary/20 bg-cover bg-center border-2 border-primary"
              style={{ backgroundImage: `url(${user?.photoURL || 'https://lh3.googleusercontent.com/a/ALm5wu0pS_Z-X_5_P_S_P_S_P_S_P_S_P_S_P_S_P=s96-c'})` }}
            ></div>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 lg:px-20 xl:px-40 space-y-8 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse ml-auto' : ''} max-w-3xl`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-primary/20 bg-cover bg-center border-2 border-primary'}`}
                style={msg.role === 'user' ? { backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEly7bHzLEVytfArK0oCGh8vDg8jb_Wmb1u-TWulmvTipXJqaC5pq3joXjeINHLYH9-qw5RYPL-IJg-2_TU-3cowM7gSJxErxXaAgFiyTZ34abrfwLbDoDTL7NfD6NW_VntKxM8Y6QmQbDQDKyMT2txXLQnFzoTZdfXOqqGWGru5PihIUcbE69UWM4VE6Ib89Nlos8SydqaOSN8njmjFwwEKDZ2-CMUt10EeuJTrrHaLMF3FVgtcg0HliyyEyHc6FDDi6V6yPwwq0t')" } : {}}
              >
                {msg.role === 'ai' && <Bot size={20} />}
              </div>
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wide ${msg.role === 'ai' ? 'text-primary' : 'text-slate-500'}`}>
                    {msg.role === 'ai' ? 'UVA Mentor' : (user?.name.split(' ')[0] || 'Öğrenci')}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
                <div className={`rounded-2xl p-5 shadow-sm border ${msg.role === 'ai'
                  ? 'rounded-tl-none bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'
                  : 'rounded-tr-none bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  }`}>
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 max-w-3xl"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot size={20} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">UVA Mentor</span>
                  <Loader2 size={14} className="animate-spin text-primary" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Bottom Controls */}
      <footer className="p-4 lg:px-20 xl:px-40 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 sticky bottom-0">
        {/* Quick Suggestion Pills */}
        <div className="flex gap-3 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => handleSendMessage("Günün programını göster")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary/10 text-primary px-4 text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            <Calendar size={16} />
            Günün Programı
          </button>
          <button
            onClick={() => handleSendMessage("En çok zorlandığım konular hangileri?")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <AlertTriangle size={16} />
            Zorlandığım Konular
          </button>
          <button
            onClick={() => handleSendMessage("Bugünkü çalışmalarımın özetini çıkar")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileEdit size={16} />
            Özet Çıkar
          </button>
          <button
            onClick={() => handleSendMessage("Fizik formüllerini hatırlat")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <History size={16} />
            Formül Hatırlat
          </button>
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Paperclip size={20} />
            </div>
            <input
              className="w-full h-14 rounded-2xl border-none bg-slate-100 dark:bg-slate-800 pl-12 pr-4 text-[15px] focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-700 transition-all text-slate-900 dark:text-white"
              placeholder="Fizik hakkında bir soru sor veya konu belirle..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading}
            className="flex h-14 items-center gap-2 rounded-2xl bg-primary px-6 text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">AI'ya Sor</span>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-3 uppercase tracking-widest font-medium">
          UVA Mentor hata yapabilir. Önemli bilgileri kontrol edin.
        </p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
