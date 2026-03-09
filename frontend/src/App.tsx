/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AnalysisPage from './components/AnalysisPage';
import ChatPage from './components/ChatPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import { authService } from './services/auth.service';

type View = 'landing' | 'dashboard' | 'analysis' | 'chat' | 'login' | 'register';

export default function App() {
  const [view, setView] = useState<View>('landing');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = () => {
      if (authService.isAuthenticated()) {
        setView('dashboard');
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const handleLogout = () => {
    authService.logout();
    setView('landing');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {view === 'landing' && (
        <LandingPage
          onLogin={() => setView('login')}
          onRegister={() => setView('register')}
        />
      )}
      {view === 'login' && (
        <LoginPage
          onLogin={() => setView('dashboard')}
          onRegister={() => setView('register')}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'register' && (
        <RegisterPage
          onRegister={() => setView('dashboard')}
          onLogin={() => setView('login')}
          onBack={() => setView('landing')}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard
          onNavigate={setView}
          onLogout={handleLogout}
        />
      )}
      {view === 'analysis' && (
        <AnalysisPage
          onNavigate={setView}
          onLogout={handleLogout}
        />
      )}
      {view === 'chat' && (
        <ChatPage
          onNavigate={setView}
        />
      )}
    </>
  );
}
