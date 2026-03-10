/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AnalysisPage from './components/AnalysisPage';
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import SettingsPage from './components/SettingsPage';
import AboutPage from './components/AboutPage';
import PricingPage from './components/PricingPage';
import SupportPage from './components/SupportPage';
import AdminPanel from './components/AdminPanel';
import { authService, User } from './services/authService';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LogOut, X, AlertTriangle } from 'lucide-react';
import { ToastProvider } from './components/ToastProvider';

type View = 'landing' | 'dashboard' | 'analysis' | 'chat' | 'login' | 'register' | 'settings' | 'about' | 'pricing' | 'support' | 'admin';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const performLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('user');
    setUser(null);
    setView('landing');
    setIsLogoutModalOpen(false);
  };

  return (
    <ToastProvider>
      {view === 'landing' && (
        <LandingPage
          onNavigate={setView}
          onLogin={() => setView('login')}
          onRegister={() => setView('register')}
        />
      )}
      {view === 'about' && (
        <AboutPage onNavigate={setView} />
      )}
      {view === 'pricing' && (
        <PricingPage onNavigate={setView} />
      )}
      {view === 'support' && (
        <SupportPage user={user} onNavigate={setView} />
      )}
      {view === 'admin' && (
        <AdminPanel user={user} onNavigate={setView} />
      )}
      {view === 'login' && (
        <LoginPage
          onLogin={(user, rememberMe) => {
            setUser(user);
            if (rememberMe) {
              localStorage.setItem('user', JSON.stringify(user));
            } else {
              sessionStorage.setItem('user', JSON.stringify(user));
            }
            setView('dashboard');
          }}
          onRegister={() => setView('register')}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'register' && (
        <RegisterPage
          onRegister={(user) => {
            setUser(user);
            localStorage.setItem('user', JSON.stringify(user));
            setView('dashboard');
          }}
          onLogin={() => setView('login')}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard
          user={user}
          onLogout={() => setIsLogoutModalOpen(true)}
          onNavigate={setView}
        />
      )}
      {view === 'analysis' && (
        <AnalysisPage
          user={user}
          onNavigate={setView}
          onLogout={() => setIsLogoutModalOpen(true)}
        />
      )}
      {view === 'chat' && (
        <ChatPage
          user={user}
          onNavigate={setView}
          onLogout={() => setIsLogoutModalOpen(true)}
        />
      )}
      {view === 'settings' && user && (
        <SettingsPage
          user={user}
          onNavigate={setView}
          onUpdateUser={handleUpdateUser}
          onLogout={() => setIsLogoutModalOpen(true)}
        />
      )}

      {/* Custom Logout Modal */}
      <AnimatePresence>
        {isLogoutModalOpen && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsLogoutModalOpen(false)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
            >
              <div className="p-10 text-center">
                <div className="size-20 rounded-3xl bg-red-50 dark:bg-red-500/10 flex items-center justify-center text-red-500 mx-auto mb-6">
                  <LogOut size={40} />
                </div>

                <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Oturumu Kapat</h3>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10">
                  Çıkış yapmak istediğinize emin misiniz? <br />
                  Çalışmalarına kaldığın yerden devam etmek için tekrar giriş yapman gerekecek.
                </p>

                <div className="flex flex-col gap-3">
                  <button
                    onClick={performLogout}
                    className="w-full py-5 rounded-2xl bg-red-500 text-white font-black shadow-xl shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                  >
                    <LogOut size={20} />
                    Evet, Çıkış Yap
                  </button>
                  <button
                    onClick={() => setIsLogoutModalOpen(false)}
                    className="w-full py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    Vazgeç
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </ToastProvider>
  );
}
