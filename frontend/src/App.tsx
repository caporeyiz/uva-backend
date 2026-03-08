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

type View = 'landing' | 'dashboard' | 'analysis' | 'chat' | 'login' | 'register';

export default function App() {
  const [view, setView] = useState<View>('landing');

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
          onLogout={() => setView('landing')}
        />
      )}
      {view === 'analysis' && (
        <AnalysisPage
          onNavigate={setView}
          onLogout={() => setView('landing')}
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
