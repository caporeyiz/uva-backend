/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  BarChart3,
  BookOpen,
  GraduationCap,
  Bell,
  Settings,
  Calendar,
  CheckCircle2,
  Zap,
  Bot,
  ArrowRight,
  Plus,
  User,
  TrendingDown,
  Clock,
  LogOut,
  Sparkles,
  Loader2
} from 'lucide-react';
import { userService, User as UserType } from '../services/user.service';
import { authService } from '../services/auth.service';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${active
        ? 'bg-primary text-white font-medium'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
      }`}
  >
    <Icon size={20} />
    <span>{label}</span>
  </button>
);

const StatCard = ({ label, value, icon: Icon, trend, trendColor }: { label: string, value: string, icon: any, trend?: string, trendColor?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3 shadow-sm"
  >
    <div className="flex items-center justify-between">
      <span className="text-slate-500 font-medium">{label}</span>
      <div className="text-primary">
        <Icon size={20} />
      </div>
    </div>
    <p className="text-4xl font-black">{value}</p>
    {trend && (
      <div className={`flex items-center gap-1 ${trendColor} text-sm font-bold`}>
        <TrendingDown size={14} />
        <span>{trend}</span>
      </div>
    )}
  </motion.div>
);

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    navigate('/');
  };
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('yks_tasks');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: '40 Paragraf Sorusu', completed: true },
      { id: '2', title: 'Trigonometri - Yarım Açı Formülleri', completed: true },
      { id: '3', title: 'Modern Fizik Tekrar Videosu', completed: true },
      { id: '4', title: '20 Problem Sorusu', completed: true },
      { id: '5', title: 'Biyoloji - Fotosentez Testi (2 Test)', completed: false },
      { id: '6', title: 'Kimya - Modern Atom Teorisi (Tekrar)', completed: false },
    ];
  });

  const [aiInsight, setAiInsight] = useState<string>("Analiz ediliyor...");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [showAddTask, setShowAddTask] = useState(false);

  // Fetch user data on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await userService.getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error('Failed to fetch user:', error);
      } finally {
        setIsLoadingUser(false);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    localStorage.setItem('yks_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // TODO: Replace with backend API call to /api/v1/insights
    const fetchAiInsight = async () => {
      setIsAiLoading(true);
      // Simulated delay for loading effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiInsight("Bugün harika gidiyorsun! Paragraf ve trigonometri çalışmaların çok iyi, tempoyu koru! 🚀");
      setIsAiLoading(false);
    };
    fetchAiInsight();
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const addTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle,
      completed: false
    };
    setTasks([...tasks, newTask]);
    setNewTaskTitle('');
    setShowAddTask(false);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  const completedCount = tasks.filter(t => t.completed).length;

  // Calculate days until YKS (June 21, 2026)
  const yksDate = new Date('2026-06-21');
  const today = new Date();
  const diffTime = yksDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-3 z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <img src="/uva-logo.png" alt="UVA Logo" className="h-16 w-auto" />
          <h2 className="text-lg font-bold leading-tight tracking-tight">UVA-AI Mentor</h2>
        </div>
        <div className="flex flex-1 justify-end gap-4 items-center">
          <div className="hidden md:flex gap-2">
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
              <Bell size={20} />
            </button>
            <button className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
              <Settings size={20} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-lg h-10 w-10 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold">{user?.full_name || 'Yükleniyor...'}</p>
              <p className="text-xs text-slate-500">{user?.target_department || 'Öğrenci'}</p>
            </div>
            <div
              className="size-10 rounded-full bg-primary/20 bg-cover bg-center border-2 border-primary"
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCEly7bHzLEVytfArK0oCGh8vDg8jb_Wmb1u-TWulmvTipXJqaC5pq3joXjeINHLYH9-qw5RYPL-IJg-2_TU-3cowM7gSJxErxXaAgFiyTZ34abrfwLbDoDTL7NfD6NW_VntKxM8Y6QmQbDQDKyMT2txXLQnFzoTZdfXOqqGWGru5PihIUcbE69UWM4VE6Ib89Nlos8SydqaOSN8njmjFwwEKDZ2-CMUt10EeuJTrrHaLMF3FVgtcg0HliyyEyHc6FDDi6V6yPwwq0t')" }}
            ></div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-4 gap-6">
          <div className="flex flex-col gap-2">
            <p className="px-3 text-xs font-bold text-slate-400 uppercase tracking-widest">Menü</p>
            <nav className="flex flex-col gap-1">
              <SidebarItem icon={LayoutDashboard} label="Dashboard" active onClick={() => navigate('/dashboard')} />
              <SidebarItem icon={BarChart3} label="Deneme Analizi" onClick={() => navigate('/analysis')} />
              <SidebarItem icon={Sparkles} label="AI Sohbet" onClick={() => navigate('/chat')} />
              <SidebarItem icon={BookOpen} label="Kitaplarım" />
              <SidebarItem icon={GraduationCap} label="Hoca Önerileri" />
            </nav>
          </div>
          <div className="mt-auto p-4 rounded-xl bg-primary/5 border border-primary/10 flex flex-col gap-3">
            <p className="text-sm font-bold text-primary">UVA-AI Mentor Premium</p>
            <p className="text-xs text-slate-500">Kişiselleştirilmiş çalışma programı ve 7/24 soru çözümü için yükselt.</p>
            <button className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">Şimdi Yükselt</button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-3 md:p-4 lg:p-5 overflow-y-auto max-w-4xl mx-auto w-full pb-20 lg:pb-8">
          <div className="flex flex-col gap-4">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col gap-2"
            >
              <h1 className="text-2xl font-black tracking-tight">Merhaba, {user?.full_name?.split(' ')[0] || 'Öğrenci'}! 👋</h1>
              <p className="text-slate-500 text-base">Bugün hedeflerine bir adım daha yaklaşma vakti. İşte günlük planın:</p>
            </motion.div>

            {/* Progress Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <StatCard
                label="Sınava Kalan Gün"
                value={diffDays.toString()}
                icon={Calendar}
                trend="-1 Gün"
                trendColor="text-red-500"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-3 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Konu Tamamlanma</span>
                  <div className="text-green-500">
                    <CheckCircle2 size={20} />
                  </div>
                </div>
                <p className="text-4xl font-black">%{Math.round((completedCount / tasks.length) * 100) || 0}</p>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(completedCount / tasks.length) * 100}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-green-500 h-full"
                  ></motion.div>
                </div>
              </motion.div>
              <StatCard
                label="Yetişiyor mu?"
                value="Zamanında"
                icon={Clock}
              />
            </div>

            {/* AI Mentor Insight */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex gap-4 items-start">
                <div className="size-12 rounded-full bg-primary flex items-center justify-center shrink-0">
                  <Bot className="text-white" size={24} />
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="font-bold text-primary">UVA-AI Mentor Görüşü</h3>
                  {isAiLoading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <Loader2 size={14} className="animate-spin" />
                      <span>Analiz ediliyor...</span>
                    </div>
                  ) : (
                    <p className="text-slate-700 dark:text-slate-300">{aiInsight}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/chat')}
                className="bg-primary text-white px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all"
              >
                AI ile Konuş
                <ArrowRight size={16} />
              </button>
            </motion.div>

            {/* Bottom Sections: Task List & Weekly Goals */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Daily Schedule */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-bold flex items-center gap-2">
                    <Calendar className="text-primary" size={20} />
                    Günlük Görevler
                  </h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{completedCount}/{tasks.length} Tamamlandı</span>
                    <button
                      onClick={() => setShowAddTask(!showAddTask)}
                      className="size-6 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 transition-transform"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  {showAddTask && (
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Yeni görev..."
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-sm focus:ring-2 focus:ring-primary outline-none"
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                      />
                      <button
                        onClick={addTask}
                        className="px-4 py-2 bg-primary text-white text-sm font-bold rounded-lg"
                      >
                        Ekle
                      </button>
                    </div>
                  )}
                  <AnimatePresence>
                    {tasks.map((task) => (
                      <div key={task.id} className="flex items-center justify-between group">
                        <label className="flex items-center gap-3 cursor-pointer flex-1">
                          <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => toggleTask(task.id)}
                            className="rounded border-slate-300 text-primary focus:ring-primary size-5 cursor-pointer"
                          />
                          <span className={`transition-all ${task.completed ? 'text-slate-400 line-through' : 'font-medium group-hover:text-primary'}`}>
                            {task.title}
                          </span>
                        </label>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <LogOut size={14} className="rotate-90" />
                        </button>
                      </div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Weekly Tracking */}
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
                <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                  <h3 className="font-bold flex items-center gap-2">
                    <BarChart3 className="text-primary" size={20} />
                    Haftalık Soru Takibi
                  </h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full font-bold">Bu Hafta</span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-center items-center gap-6">
                  <div className="relative size-48">
                    <svg className="size-full" viewBox="0 0 36 36">
                      <path
                        className="stroke-slate-100 dark:stroke-slate-800"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeWidth="3"
                      ></path>
                      <motion.path
                        initial={{ strokeDasharray: "0, 100" }}
                        animate={{ strokeDasharray: "72, 100" }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="stroke-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        strokeLinecap="round"
                        strokeWidth="3"
                      ></motion.path>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-black">1084</span>
                      <span className="text-xs text-slate-500">/ 1500 Soru</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 w-full gap-4">
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                      <p className="text-xs text-slate-500 font-bold uppercase">Doğru Oranı</p>
                      <p className="text-xl font-bold text-green-600">%82</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                      <p className="text-xs text-slate-500 font-bold uppercase">Hız (Soru/dk)</p>
                      <p className="text-xl font-bold text-primary">1.4</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <button
                    onClick={() => navigate('/analysis')}
                    className="w-full py-3 border-2 border-slate-100 dark:border-slate-800 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    Detaylı Analiz Gör
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-around items-center z-50">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-primary flex flex-col items-center gap-1"
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">Ana Sayfa</span>
        </button>
        <button
          onClick={() => navigate('/analysis')}
          className="text-slate-400 flex flex-col items-center gap-1"
        >
          <BarChart3 size={24} />
          <span className="text-[10px] font-bold">Analiz</span>
        </button>
        <div className="relative -top-6">
          <button
            onClick={() => navigate('/chat')}
            className="bg-primary size-14 rounded-full shadow-lg shadow-primary/40 flex items-center justify-center text-white"
          >
            <Sparkles size={32} />
          </button>
        </div>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <BookOpen size={24} />
          <span className="text-[10px] font-bold">Kitaplarım</span>
        </button>
        <button className="text-slate-400 flex flex-col items-center gap-1">
          <User size={24} />
          <span className="text-[10px] font-bold">Profil</span>
        </button>
      </div>
    </div>
  );
}
