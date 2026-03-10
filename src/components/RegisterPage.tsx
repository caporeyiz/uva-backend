/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { authService, User as AuthUser } from '../services/authService';
import {
    Sparkles,
    Mail,
    Lock,
    User,
    ArrowRight,
    Chrome,
    ChevronLeft,
    CheckCircle2,
    GraduationCap,
    Target,
    BookOpen,
    Clock,
    School,
    Brain,
    Activity
} from 'lucide-react';

interface RegisterPageProps {
    onRegister: (user: AuthUser) => void;
    onLogin: () => void;
    onBack: () => void;
}

export default function RegisterPage({ onRegister, onLogin, onBack }: RegisterPageProps) {
    // Step state
    const [step, setStep] = useState(1);

    // Step 1: Account Info
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Step 2: Educational Profile
    const [major, setMajor] = useState('');
    const [targetRank, setTargetRank] = useState('');
    const [targetGoal, setTargetGoal] = useState('');
    const [educationStatus, setEducationStatus] = useState('');

    // Step 3: Performance & Preferences
    const [baseLevel, setBaseLevel] = useState({ math: 'Orta', turkish: 'Orta', science: 'Orta' });
    const [currentNets, setCurrentNets] = useState({ tyt: '', ayt: '' });
    const [dailyStudyHours, setDailyStudyHours] = useState('');
    const [schoolStatus, setSchoolStatus] = useState('');
    const [hardestSubject, setHardestSubject] = useState('');

    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleNext = () => setStep(s => s + 1);
    const handlePrev = () => setStep(s => s - 1);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const user = await authService.register(name, email, password, {
                major,
                targetRank,
                targetGoal,
                educationStatus,
                baseLevel,
                currentNets,
                dailyStudyHours,
                schoolStatus,
                hardestSubject
            });
            onRegister(user);
        } catch (err) {
            setError('Hesap oluşturulamadı. Lütfen tekrar deneyin.');
        } finally {
            setIsLoading(false);
        }
    };

    const isStep1Valid = name && email && password.length >= 6;
    const isStep2Valid = major && targetRank && educationStatus;

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark font-display p-4 md:p-6 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden min-h-[600px]"
            >
                {/* Left Side - Benefits (Visible on large screens) */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="relative z-10 flex items-center gap-2">
                        <Sparkles size={28} className="text-primary font-bold" />
                        <h2 className="text-xl font-bold tracking-tight">UVA Mentor</h2>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <h1 className="text-4xl font-extrabold leading-tight">
                            Geleceğin İçin <br /> En Akıllı <span className="text-primary">Yatırım.</span>
                        </h1>
                        <ul className="space-y-4">
                            {[
                                "Kişiselleştirilmiş Çalışma Programı",
                                "7/24 UVA Mentor Desteği",
                                "Detaylı Deneme Analizleri",
                                "Eksik Konu Tespiti ve Giderme"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-slate-300">
                                    <CheckCircle2 size={20} className="text-primary" />
                                    <span className="font-medium">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="relative z-10 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <p className="text-slate-400 text-sm italic">
                            "Bu bilgileri sana en uygun çalışma programını hazırlamak için kullanacağız. Adım adım ilerleyelim!"
                        </p>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-6 md:p-10 flex flex-col justify-center">
                    {/* Top Navigation */}
                    <div className="flex items-center justify-between mb-8">
                        {step > 1 ? (
                            <button
                                onClick={handlePrev}
                                className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold"
                            >
                                <ChevronLeft size={16} />
                                Geri Dön
                            </button>
                        ) : (
                            <button
                                onClick={onBack}
                                className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-bold"
                            >
                                <ChevronLeft size={16} />
                                Anasayfa
                            </button>
                        )}

                        {/* Progress Indicator */}
                        <div className="flex gap-2">
                            {[1, 2, 3].map((s) => (
                                <div
                                    key={s}
                                    className={`h-1.5 w-8 rounded-full transition-all duration-500 ${s <= step ? 'bg-primary' : 'bg-slate-200 dark:bg-slate-800'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Hesap Oluştur</h2>
                                    <p className="text-slate-500 dark:text-slate-400">Temel bilgilerini girerek başlayalım.</p>
                                    {error && <p className="mt-2 text-sm text-red-500 font-medium">{error}</p>}
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Ad Soyad</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <User size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Ahmet Yılmaz"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 dark:text-slate-100"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">E-posta</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <Mail size={18} />
                                            </div>
                                            <input
                                                type="email"
                                                placeholder="ahmet@ornek.com"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 dark:text-slate-100"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Şifre</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <Lock size={18} />
                                            </div>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 dark:text-slate-100"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!isStep1Valid}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Devam Et
                                    <ArrowRight size={20} />
                                </button>

                                <button className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm">
                                    <Chrome size={18} />
                                    Google ile Kaydol
                                </button>

                                <p className="text-center mt-6 text-slate-500 dark:text-slate-400 text-sm">
                                    Zaten hesabın var mı? {' '}
                                    <button onClick={onLogin} className="text-primary font-bold hover:underline">Giriş Yap</button>
                                </p>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">Kariyer Profilin</h2>
                                    <p className="text-slate-500 dark:text-slate-400">Hedeflerini anlamamıza yardımcı ol.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Alan Seçimi */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Alan Seçimi</label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {['Sayısal', 'Eşit Ağırlık', 'Sözel', 'Dil'].map((m) => (
                                                <button
                                                    key={m}
                                                    onClick={() => setMajor(m)}
                                                    className={`py-2.5 rounded-xl text-sm font-bold border transition-all ${major === m ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mezuniyet Durumu */}
                                    <div className="space-y-3">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Mezuniyet Durumu</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {['11. Sınıf', '12. Sınıf', 'Mezun'].map((s) => (
                                                <button
                                                    key={s}
                                                    onClick={() => setEducationStatus(s)}
                                                    className={`py-2.5 rounded-xl text-xs font-bold border transition-all ${educationStatus === s ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-primary/50'}`}
                                                >
                                                    {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Hedef Sıralama */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Sıralama</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <Target size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Örn: İlk 10.000"
                                                value={targetRank}
                                                onChange={(e) => setTargetRank(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>

                                    {/* Hedef Üni/Bölüm */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Üniversite / Bölüm <span className="text-[10px] lowercase text-slate-400 font-normal">(Opsiyonel)</span></label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <GraduationCap size={18} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Örn: Boğaziçi Bilgisayar"
                                                value={targetGoal}
                                                onChange={(e) => setTargetGoal(e.target.value)}
                                                className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm text-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleNext}
                                    disabled={!isStep2Valid}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Son Adıma Geç
                                    <ArrowRight size={20} />
                                </button>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-5 overflow-y-auto pr-1 max-h-[500px] no-scrollbar"
                            >
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">Akademik Durum</h2>
                                    <p className="text-slate-500 dark:text-slate-400 text-sm">Programını özelleştirmemiz için son detaylar.</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Temel Seviye Algısı */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Temel Seviye Algısı</label>
                                        <div className="space-y-2">
                                            {['math', 'turkish', 'science'].map((subject) => (
                                                <div key={subject} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                                                    <span className="text-xs font-bold capitalize px-2 text-slate-700 dark:text-slate-300">{subject === 'math' ? 'Matematik' : subject === 'turkish' ? 'Türkçe' : 'Fen'}</span>
                                                    <div className="flex gap-1">
                                                        {['Başlangıç', 'Orta', 'İleri'].map((level) => (
                                                            <button
                                                                key={level}
                                                                onClick={() => setBaseLevel({ ...baseLevel, [subject]: level })}
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all ${baseLevel[subject as keyof typeof baseLevel] === level ? 'bg-primary text-white' : 'bg-white dark:bg-slate-700 text-slate-500'}`}
                                                            >
                                                                {level}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Net Bilgisi */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Son TYT Neti</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                    <Activity size={16} />
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="Örn: 75"
                                                    value={currentNets.tyt}
                                                    onChange={(e) => setCurrentNets({ ...currentNets, tyt: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Son AYT Neti</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                    <Activity size={16} />
                                                </div>
                                                <input
                                                    type="number"
                                                    placeholder="Örn: 40"
                                                    value={currentNets.ayt}
                                                    onChange={(e) => setCurrentNets({ ...currentNets, ayt: e.target.value })}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-slate-100"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {/* Çalışma Saati */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Günlük Çalışma Saati</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                    <Clock size={16} />
                                                </div>
                                                <select
                                                    value={dailyStudyHours}
                                                    onChange={(e) => setDailyStudyHours(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm appearance-none text-slate-900 dark:text-slate-100"
                                                >
                                                    <option value="">Seçiniz...</option>
                                                    <option value="1-3">1-3 Saat</option>
                                                    <option value="4-6">4-6 Saat</option>
                                                    <option value="7-9">7-9 Saat</option>
                                                    <option value="10+">10+ Saat</option>
                                                </select>
                                            </div>
                                        </div>
                                        {/* Okul/Kurs Durumu */}
                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Gündüz Durumu</label>
                                            <div className="relative group">
                                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                    <School size={16} />
                                                </div>
                                                <select
                                                    value={schoolStatus}
                                                    onChange={(e) => setSchoolStatus(e.target.value)}
                                                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm appearance-none text-slate-900 dark:text-slate-100"
                                                >
                                                    <option value="">Seçiniz...</option>
                                                    <option value="school">Okul/Kurs (Gündüz Dolu)</option>
                                                    <option value="home">Tam Gün Evde</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>

                                    {/* En Zorlanan Ders */}
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">En Çok Zorlanılan Ders</label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                                <Brain size={16} />
                                            </div>
                                            <input
                                                type="text"
                                                placeholder="Örn: Fizik veya Matematik"
                                                value={hardestSubject}
                                                onChange={(e) => setHardestSubject(e.target.value)}
                                                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none text-sm text-slate-900 dark:text-slate-100"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading || !dailyStudyHours || !schoolStatus}
                                    className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? 'Hesap Oluşturuluyor...' : 'Kaydı Tamamla'}
                                    {!isLoading && <ArrowRight size={20} />}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>

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
            </motion.div>
        </div>
    );
}
