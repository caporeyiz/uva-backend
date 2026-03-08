/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  BarChart3,
  Bell,
  User,
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Settings,
  Plus,
  TrendingUp,
  AlertCircle,
  Sparkles,
  Clock,
  ChevronRight,
  Bookmark,
  Zap,
  LogOut,
  Loader2
} from 'lucide-react';

interface AnalysisPageProps {
  onNavigate: (view: 'landing' | 'dashboard' | 'analysis' | 'chat' | 'login' | 'register') => void;
  onLogout: () => void;
}

interface Prescription {
  subject: string;
  status: string;
  statusColor: string;
  title: string;
  desc: string;
}

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${active
        ? 'bg-primary text-white shadow-md shadow-primary/20'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
      }`}
  >
    <Icon size={20} />
    <span className="text-sm font-medium">{label}</span>
  </button>
);

export default function AnalysisPage({ onNavigate, onLogout }: AnalysisPageProps) {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([
    { subject: "Matematik", status: "Acil", statusColor: "bg-orange-500", title: "Türev - Max/Min", desc: "Son 3 denemede bu konudan 4 soru kaçırdın. Konu özetini incele." },
    { subject: "Biyoloji", status: "Orta", statusColor: "bg-blue-400", title: "Protein Sentezi", desc: "Enzimlerle ilgili teknik bir bilgi hatası saptandı. 20dk tekrar." },
    { subject: "Fizik", status: "Kolay", statusColor: "bg-green-500", title: "Optik - Mercekler", desc: "Sadece 1 formül hatırlatma testi çözmen yeterli görünüyor." }
  ]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [netScores, setNetScores] = useState([68, 72, 75, 74, 82, 88, 94]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    // TODO: Replace with backend API call to /api/v1/analysis/prescriptions
    const fetchPrescription = async () => {
      setIsAiLoading(true);
      // Simulated delay for loading effect
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Static prescriptions - will be replaced with backend API
      setIsAiLoading(false);
    };
    fetchPrescription();
  }, []);

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      const newScore = Math.floor(Math.random() * 10) + 90;
      setNetScores([...netScores.slice(1), newScore]);
      setIsUploading(false);
      alert("Yeni deneme sonucu başarıyla yüklendi ve analiz edildi!");
    }, 2000);
  };

  return (
    <div className="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 md:px-10 py-3 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white">
            <BarChart3 size={20} />
          </div>
          <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">AI Deneme Analizi</h2>
        </div>
        <div className="flex gap-3">
          <button className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 transition-colors">
            <Bell size={20} />
          </button>
          <div className="flex items-center gap-3 pl-2 border-l border-slate-200 dark:border-slate-800">
            <div className="hidden md:block text-right">
              <p className="text-sm font-bold leading-none">Deniz Yılmaz</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Hedef: Tıp Fakültesi</p>
            </div>
            <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
              <User size={20} className="text-primary" />
            </div>
            <button
              onClick={onLogout}
              className="flex size-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-colors"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar Navigation */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 gap-2">
          <nav className="flex flex-col gap-1">
            <SidebarItem icon={LayoutDashboard} label="Genel Bakış" onClick={() => onNavigate('dashboard')} />
            <SidebarItem icon={BarChart3} label="Deneme Analizi" active />
            <SidebarItem icon={Sparkles} label="AI Sohbet" onClick={() => onNavigate('chat')} />
            <SidebarItem icon={BookOpen} label="Hata Havuzu" />
            <SidebarItem icon={GraduationCap} label="Çalışma Planı" />
            <SidebarItem icon={Settings} label="Ayarlar" />
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Welcome & Upload Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">Performans Raporu</h1>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Son deneme sonuçların ve yapay zeka önerilerin hazır.</p>
              </motion.div>
              <div className="w-full md:w-auto flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="relative group cursor-pointer flex items-center justify-center border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-xl p-4 transition-all w-full md:min-w-[320px] disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    {isUploading ? <Loader2 size={32} className="text-primary animate-spin" /> : <Plus size={32} className="text-primary" />}
                    <div className="text-left">
                      <p className="text-sm font-bold text-primary">{isUploading ? 'Analiz Ediliyor...' : 'Yeni Sonuç Yükle'}</p>
                      <p className="text-xs text-slate-500">Fotoğraf veya PDF formatında</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Analysis Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Net Takip Grafiği */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold flex items-center gap-2">
                    <TrendingUp className="text-primary" size={20} />
                    Net Takip Grafiği
                  </h3>
                  <div className="flex gap-2">
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">TYT</span>
                    <span className="px-3 py-1 text-xs font-semibold rounded-full bg-primary/10 text-primary">AYT</span>
                  </div>
                </div>
                <div className="h-64 flex flex-col justify-between">
                  <div className="flex-1 flex items-end gap-2 px-2">
                    {netScores.map((h, i) => (
                      <div
                        key={i}
                        className={`w-full rounded-t relative group transition-all duration-500 ${i === netScores.length - 1 ? 'bg-primary' : 'bg-primary/20'}`}
                        style={{ height: `${(h / 120) * 100}%` }}
                      >
                        <div className={`absolute -top-8 left-1/2 -translate-x-1/2 ${i === netScores.length - 1 ? 'block' : 'hidden group-hover:block'} bg-slate-800 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-10`}>
                          {h.toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-4 px-2 uppercase tracking-wider">
                    <span>Oca</span><span>Şub</span><span>Mar</span><span>Nis</span><span>May</span><span>Haz</span><span>Tem</span>
                  </div>
                </div>
              </motion.div>

              {/* Hata Analizi */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6"
              >
                <h3 className="font-bold mb-6 flex items-center gap-2">
                  <AlertCircle className="text-orange-500" size={20} />
                  Hata Analizi
                </h3>
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="relative size-40">
                    <svg className="size-full -rotate-90" viewBox="0 0 36 36">
                      <circle className="stroke-slate-100 dark:stroke-slate-800" cx="18" cy="18" fill="none" r="16" strokeWidth="3"></circle>
                      <motion.circle
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 40 }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                        className="stroke-primary" cx="18" cy="18" fill="none" r="16" strokeDasharray="100" strokeWidth="3"
                      ></motion.circle>
                      <motion.circle
                        initial={{ strokeDashoffset: 100 }}
                        animate={{ strokeDashoffset: 85 }}
                        transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
                        className="stroke-orange-500" cx="18" cy="18" fill="none" r="16" strokeDasharray="100" strokeWidth="3"
                      ></motion.circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-2xl font-bold">42</span>
                      <span className="text-[10px] text-slate-500 uppercase">Toplam Hata</span>
                    </div>
                  </div>
                  <div className="w-full mt-6 space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-primary"></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">Bilgi Eksikliği</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">%60</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-orange-500"></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">Dikkat Hatası</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">%25</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-slate-300 dark:bg-slate-700"></div>
                        <span className="text-xs text-slate-600 dark:text-slate-400">Hız/Zaman</span>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100">%15</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* AI Reçete Section */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Zap size={120} />
              </div>
              <div className="relative z-10">
                <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                  <Sparkles size={24} />
                  Günün AI Reçetesi
                </h3>
                <p className="text-blue-100 mb-6 max-w-2xl text-sm">Son denemendeki verilere göre bugün özellikle bu üç konuyu tekrar etmen netlerini +4.5 artırabilir.</p>

                {isAiLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 size={40} className="animate-spin text-white/50" />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {prescriptions.map((item, i) => (
                      <div key={i} className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                        <div className="flex justify-between items-start mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200">{item.subject}</span>
                          <span className={`text-xs ${item.statusColor} px-2 py-0.5 rounded text-white font-bold`}>{item.status}</span>
                        </div>
                        <h4 className="font-bold text-lg">{item.title}</h4>
                        <p className="text-xs text-blue-100 mt-2">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Otomatik Tekrar Havuzu */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <Clock className="text-primary" size={20} />
                  Otomatik Tekrar Havuzu
                  <span className="ml-2 px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs rounded-full">8 Soru Hazır</span>
                </h3>
                <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                  Hepsini Gör
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { subject: "Kimya", date: "12 May", title: "Gazlar ve Basınç İlişkisi", desc: "İdeal gaz yasası uygulanırken dikkat hatası yapılmış.", repeat: "3. Tekrar", img: "https://picsum.photos/seed/chemistry/400/225" },
                  { subject: "Geometri", date: "Dün", title: "Üçgende Benzerlik", desc: "Kenar-Açı-Kenar teoremi eksik uygulanmış.", repeat: "1. Tekrar", img: "https://picsum.photos/seed/geometry/400/225" },
                  { subject: "Biyoloji", date: "10 May", title: "Kalıtım ve Çaprazlama", desc: "Bağlı genler konusunda kavram karmaşası mevcut.", repeat: "5. Tekrar", img: "https://picsum.photos/seed/biology/400/225" }
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden group hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div className="aspect-video bg-slate-100 dark:bg-slate-800 overflow-hidden relative">
                      <img
                        className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform"
                        src={item.img}
                        referrerPolicy="no-referrer"
                        alt={item.title}
                      />
                      <div className="absolute top-2 right-2">
                        <span className="bg-white/90 dark:bg-slate-900/90 text-primary text-[10px] font-bold px-2 py-1 rounded shadow-sm">{item.repeat}</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[10px] text-primary font-bold uppercase">{item.subject}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{item.date}</span>
                      </div>
                      <h5 className="font-bold text-sm line-clamp-1">{item.title}</h5>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                      <div className="mt-4 flex gap-2">
                        <button className="flex-1 py-2 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 transition-colors">Çöz</button>
                        <button className="px-2 py-2 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                          <Bookmark size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {/* Add Manual Error Card */}
                <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex flex-col items-center justify-center p-6 text-center group hover:border-primary/50 transition-colors cursor-pointer min-h-[220px]">
                  <div className="size-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-all mb-3">
                    <Plus size={24} />
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">Soru Ekle</p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">Hatalı gördüğün soruyu manuel ekleyebilirsin.</p>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Mobile Navigation Bottom */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 px-6 py-3 flex justify-around items-center z-50">
        <button
          onClick={() => onNavigate('dashboard')}
          className="text-slate-400 flex flex-col items-center gap-1"
        >
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">Ana Sayfa</span>
        </button>
        <button
          onClick={() => onNavigate('analysis')}
          className="text-primary flex flex-col items-center gap-1"
        >
          <BarChart3 size={24} />
          <span className="text-[10px] font-bold">Analiz</span>
        </button>
        <div className="relative -top-6">
          <button
            onClick={() => onNavigate('chat')}
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
