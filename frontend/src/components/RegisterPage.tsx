/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
    Sparkles,
    Mail,
    Lock,
    User,
    ArrowRight,
    Chrome,
    ChevronLeft,
    CheckCircle2,
    Loader2,
    AlertCircle
} from 'lucide-react';
import { authService } from '../services/auth.service';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password.length < 8) {
            setError('Şifre en az 8 karakter olmalıdır.');
            return;
        }

        setIsLoading(true);

        try {
            await authService.register({ 
                email, 
                password, 
                full_name: fullName 
            });
            navigate('/dashboard');
        } catch (err: any) {
            const errorDetail = err.response?.data?.detail;
            if (errorDetail === 'Email already registered') {
                setError('Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.');
            } else if (typeof errorDetail === 'string') {
                setError(errorDetail);
            } else {
                setError('Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center bg-background-light dark:bg-background-dark font-display p-6 overflow-hidden">
            {/* Background Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-blue-400/20 rounded-full blur-[100px] -z-10"></div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
            >
                {/* Left Side - Benefits */}
                <div className="hidden lg:flex flex-col justify-between p-12 bg-slate-900 relative overflow-hidden text-white">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>

                    <div className="relative z-10 flex items-center gap-2">
                        <Sparkles size={28} className="text-primary font-bold" />
                        <h2 className="text-xl font-bold tracking-tight">UVA-AI Mentor</h2>
                    </div>

                    <div className="relative z-10 space-y-8">
                        <h1 className="text-4xl font-extrabold leading-tight">
                            Geleceğin İçin <br /> En Akıllı <span className="text-primary">Yatırım.</span>
                        </h1>
                        <ul className="space-y-4">
                            {[
                                "Kişiselleştirilmiş Çalışma Programı",
                                "7/24 UVA-AI Mentor Desteği",
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
                        <p className="text-slate-400 text-sm italic italic">
                            "Bu sistem sayesinde netlerimi 2 ayda 15 net artırdım. Kesinlikle her YKS öğrencisinin ihtiyacı var."
                        </p>
                        <div className="mt-4 flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/20" />
                            <div>
                                <p className="text-xs font-bold">Zeynep K.</p>
                                <p className="text-[10px] text-slate-500">Tıp Fakültesi Öğrencisi</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="p-8 md:p-12 flex flex-col justify-center">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium mb-8 w-fit"
                    >
                        <ChevronLeft size={16} />
                        Anasayfaya Dön
                    </button>

                    <div className="mb-8">
                        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Ücretsiz Hesap Oluştur</h2>
                        <p className="text-slate-500 dark:text-slate-400">Başarıya giden yolda ilk adımını bugün at.</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
                            <AlertCircle size={20} />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Ad Soyad</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <User size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Ahmet Yılmaz"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">E-posta</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    placeholder="ahmet@ornek.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    disabled={isLoading}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Şifre</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                                    disabled={isLoading}
                                    minLength={8}
                                    required
                                />
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">En az 8 karakter olmalıdır</p>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Kayıt Yapılıyor...
                                </>
                            ) : (
                                <>
                                    Hemen Başla
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-transparent px-4 text-slate-500 font-bold">Veya şuna katıl</span>
                        </div>
                    </div>

                    <button className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm">
                        <Chrome size={18} />
                        Google ile Kaydol
                    </button>

                    <p className="text-center mt-6 text-slate-500 dark:text-slate-400 text-sm">
                        Zaten hesabın var mı? {' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-primary font-bold hover:underline"
                        >
                            Giriş Yap
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
