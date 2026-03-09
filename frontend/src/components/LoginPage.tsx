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
  ArrowRight, 
  Github, 
  Chrome,
  ChevronLeft,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { authService } from '../services/auth.service';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await authService.login({ email, password });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[1100px] grid lg:grid-cols-2 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden text-white">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -ml-24 -mb-24"></div>
          
          <div className="relative z-10 flex items-center gap-2">
            <img src="/uva-logo.png" alt="UVA Logo" className="h-8 w-auto" />
            <h2 className="text-lg font-bold tracking-tight">UVA-AI Mentor</h2>
          </div>

          <div className="relative z-10 space-y-6">
            <h1 className="text-5xl font-extrabold leading-tight">
              Hayallerine <br /> <span className="text-blue-200">Bir Adım</span> Kaldı.
            </h1>
            <p className="text-blue-100 text-lg max-w-sm">
              UVA-AI Mentor ile kişiselleştirilmiş çalışma programın seni bekliyor. Hemen giriş yap ve tempoyu artır.
            </p>
          </div>

          <div className="relative z-10 flex items-center gap-4 text-sm text-blue-100/80">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <img 
                  key={i}
                  className="w-8 h-8 rounded-full border-2 border-primary" 
                  src={`https://picsum.photos/seed/student_login${i}/100/100`} 
                  alt="Student"
                />
              ))}
            </div>
            <span>+10.000 öğrenci bugün çalışıyor</span>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <button 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-sm font-medium mb-8 w-fit"
          >
            <ChevronLeft size={16} />
            Geri Dön
          </button>

          <div className="mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Tekrar Hoş Geldin</h2>
            <p className="text-slate-500 dark:text-slate-400">Hesabına erişmek için bilgilerinle giriş yap.</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-center gap-3 text-red-700 dark:text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm font-medium">{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">E-posta</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  placeholder="isim@ornek.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Şifre</label>
                <a href="#" className="text-xs font-bold text-primary hover:underline">Şifremi Unuttum</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input 
                type="checkbox" 
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-600 rounded focus:ring-2 focus:ring-primary/20"
              />
              <label htmlFor="rememberMe" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
                Beni Hatırla (1 hafta)
              </label>
            </div>

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-primary/20 hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                <>
                  Giriş Yap
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-800"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-4 text-slate-500 font-bold">Veya şununla devam et</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm">
              <Chrome size={18} className="text-slate-700 dark:text-white" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-medium text-sm">
              <Github size={18} className="text-slate-700 dark:text-white" />
              Github
            </button>
          </div>

          <p className="text-center mt-10 text-slate-500 dark:text-slate-400 text-sm">
            Hesabın yok mu? {' '}
            <button 
              onClick={() => navigate('/register')}
              className="text-primary font-bold hover:underline"
            >
              Ücretsiz Kayıt Ol
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
