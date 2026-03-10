/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    User,
    Lock,
    CreditCard,
    ShieldCheck,
    Target,
    Brain,
    Library,
    Bell,
    ChevronLeft,
    Camera,
    Save,
    Check,
    AlertCircle,
    Zap,
    BookOpen,
    GraduationCap,
    Clock,
    School,
    Activity,
    Smartphone,
    Mail,
    Download,
    Trash2,
    LogOut,
    Plus,
    X
} from 'lucide-react';
import { authService, User as AuthUser } from '../services/authService';
import NotificationDropdown from './NotificationDropdown';
import { useToast } from './ToastProvider';

interface SettingsPageProps {
    user: AuthUser | null;
    onUpdateUser: (user: AuthUser) => void;
    onNavigate: (view: any) => void;
    onLogout: () => void;
}

type SettingsTab = 'profile' | 'security' | 'subscription' | 'goals' | 'ai' | 'library' | 'notifications';

export default function SettingsPage({ user, onUpdateUser, onNavigate, onLogout }: SettingsPageProps) {
    const [activeTab, setActiveTab] = useState<SettingsTab>('profile');
    const [isLoading, setIsLoading] = useState(false);
    const { showToast } = useToast();

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [phone, setPhone] = useState(user?.phone || '');
    const [schoolName, setSchoolName] = useState(user?.schoolName || '');
    const [photoURL, setPhotoURL] = useState(user?.photoURL || 'https://lh3.googleusercontent.com/a/ALm5wu0pS_Z-X_5_P_S_P_S_P_S_P_S_P_S_P_S_P=s96-c');

    // Goals State
    const [major, setMajor] = useState(user?.major || '');
    const [targetRank, setTargetRank] = useState(user?.targetRank || '');
    const [targetGoal, setTargetGoal] = useState(user?.targetGoal || '');
    const [educationStatus, setEducationStatus] = useState(user?.educationStatus || '');

    // AI Reçete State
    const [aiDifficulty, setAiDifficulty] = useState(user?.aiDifficulty || 'Orta');
    const [maxStudyHours, setMaxStudyHours] = useState(user?.maxStudyHours || '6');
    const [offDays, setOffDays] = useState<string[]>(user?.offDays || []);

    // Library State
    const [newBook, setNewBook] = useState('');
    const [library, setLibrary] = useState<string[]>(user?.library || ['345 TYT Matematik', 'Bilgi Sarmal Fizik', 'Palme Biyoloji']);

    const handleUpdate = async (updates: Partial<AuthUser>) => {
        if (!user) return;
        setIsLoading(true);
        try {
            const updatedUser = await authService.updateProfile(user.id, updates);
            onUpdateUser(updatedUser);
            showToast('Ayarlar başarıyla kaydedildi!', 'success');
        } catch (err) {
            showToast('Ayarlar kaydedilirken bir hata oluştu.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    const addLibraryItem = () => {
        if (newBook && !library.includes(newBook)) {
            const newList = [...library, newBook];
            setLibrary(newList);
            setNewBook('');
            handleUpdate({ library: newList });
        }
    };

    const removeLibraryItem = (item: string) => {
        const newList = library.filter(i => i !== item);
        setLibrary(newList);
        handleUpdate({ library: newList });
    };

    const toggleOffDay = (day: string) => {
        const newList = offDays.includes(day)
            ? offDays.filter(d => d !== day)
            : [...offDays, day];
        setOffDays(newList);
        handleUpdate({ offDays: newList });
    };

    const SidebarItem = ({ id, icon: Icon, label }: { id: SettingsTab, icon: any, label: string }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm ${activeTab === id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
            <Icon size={18} />
            {label}
        </button>
    );

    return (
        <div className="flex min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Main Content Area */}
            <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-4 md:p-10 gap-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => onNavigate('dashboard')}
                            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:text-primary transition-colors"
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <div>
                            <h1 className="text-3xl font-black tracking-tight">Ayarlar</h1>
                            <p className="text-slate-500 text-sm">Hesap ve sistem tercihlerini yönet.</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <NotificationDropdown user={user} />
                    </div>
                </div>

                <div className="flex flex-col lg:grid lg:grid-cols-[280px_1fr] gap-8">
                    {/* Sidebar */}
                    <aside className="space-y-2">
                        <p className="px-4 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 mb-4">Kategori</p>
                        <SidebarItem id="profile" icon={User} label="Profil" />
                        <SidebarItem id="goals" icon={Target} label="Hedefler" />
                        <SidebarItem id="ai" icon={Brain} label="AI Reçete" />
                        <SidebarItem id="library" icon={Library} label="Kütüphanem" />
                        <SidebarItem id="security" icon={Lock} label="Güvenlik" />
                        <SidebarItem id="subscription" icon={CreditCard} label="Abonelik" />
                        <SidebarItem id="notifications" icon={Bell} label="Bildirimler" />

                        <div className="pt-8 opacity-50">
                            <button
                                onClick={onLogout}
                                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm text-red-500 hover:bg-red-500/10"
                            >
                                <LogOut size={18} />
                                Çıkış Yap
                            </button>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[600px]">
                        <div className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                {activeTab === 'profile' && (
                                    <motion.div
                                        key="profile"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="space-y-8"
                                    >
                                        <div className="flex flex-col md:flex-row items-center gap-8 pb-8 border-b border-slate-100 dark:border-slate-800">
                                            <div className="relative group">
                                                <div
                                                    className="size-32 rounded-[2.5rem] bg-slate-100 dark:bg-slate-800 bg-cover bg-center border-4 border-white dark:border-slate-700 shadow-lg"
                                                    style={{ backgroundImage: `url(${photoURL})` }}
                                                />
                                                <button className="absolute bottom-0 right-0 p-3 bg-primary text-white rounded-2xl shadow-lg hover:scale-110 transition-transform">
                                                    <Camera size={20} />
                                                </button>
                                            </div>
                                            <div className="text-center md:text-left">
                                                <h3 className="text-xl font-black text-slate-900 dark:text-white">Profil Fotoğrafı</h3>
                                                <p className="text-sm text-slate-500 mt-1">Görselin Dashboard ve AI Sohbet'te görünecektir.</p>
                                                <div className="flex gap-2 mt-4">
                                                    <button className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-bold">Görseli Kaldır</button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Tam İsim</label>
                                                <input
                                                    type="text"
                                                    value={name}
                                                    onChange={(e) => setName(e.target.value)}
                                                    className="w-full px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Okul / Kurum Bilgisi</label>
                                                <div className="relative">
                                                    <School className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="text"
                                                        placeholder="Örn: Kabataş Erkek Lisesi"
                                                        value={schoolName}
                                                        onChange={(e) => setSchoolName(e.target.value)}
                                                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                onClick={() => handleUpdate({ name, schoolName })}
                                                disabled={isLoading}
                                                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                            >
                                                <Save size={20} />
                                                Değişiklikleri Kaydet
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'goals' && (
                                    <motion.div
                                        key="goals"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Hedef ve Alan Ayarları</h3>
                                            <p className="text-slate-500 text-sm">Buradaki değişiklikler AI programını anında yeniden optimize eder.</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hazırlık Alanı</label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {['Sayısal', 'Eşit Ağırlık', 'Sözel', 'Dil'].map(m => (
                                                        <button
                                                            key={m}
                                                            onClick={() => setMajor(m)}
                                                            className={`py-3 rounded-2xl border font-bold text-sm transition-all ${major === m ? 'bg-primary border-primary text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                                        >
                                                            {m}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Güncel Sınıf</label>
                                                <div className="grid grid-cols-3 gap-2">
                                                    {['11. Sınıf', '12. Sınıf', 'Mezun'].map(s => (
                                                        <button
                                                            key={s}
                                                            onClick={() => setEducationStatus(s)}
                                                            className={`py-3 rounded-2xl border font-bold text-xs transition-all ${educationStatus === s ? 'bg-primary border-primary text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                                        >
                                                            {s}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Sıralama</label>
                                                <div className="relative">
                                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="text"
                                                        value={targetRank}
                                                        onChange={(e) => setTargetRank(e.target.value)}
                                                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Hedef Üniversite / Bölüm</label>
                                                <div className="relative">
                                                    <GraduationCap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                    <input
                                                        type="text"
                                                        value={targetGoal}
                                                        onChange={(e) => setTargetGoal(e.target.value)}
                                                        className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                onClick={() => handleUpdate({ major, targetRank, targetGoal, educationStatus })}
                                                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                            >
                                                <Save size={20} />
                                                Hedefleri Güncelle
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'ai' && (
                                    <motion.div
                                        key="ai"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2 italic">AI Reçete™ Algoritma Ayarları</h3>
                                            <p className="text-slate-500 text-sm">Mentörünün sana görev verme mantığını buradan özelleştirebilirsin.</p>
                                        </div>

                                        <div className="bg-primary/5 border border-primary/20 p-6 rounded-[2rem] flex items-start gap-4">
                                            <div className="p-3 bg-primary text-white rounded-2xl">
                                                <Zap size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-primary">Nokta Atışı Planlama</h4>
                                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">Buradaki yoğunluk ayarları, günlük soru sayılarını ve mola aralıklarını doğrudan etkiler.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="space-y-4">
                                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Görev Zorluk Seviyesi</label>
                                                <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl">
                                                    {['Temel', 'Orta', 'İleri (Zor)'].map(lvl => (
                                                        <button
                                                            key={lvl}
                                                            onClick={() => setAiDifficulty(lvl)}
                                                            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${aiDifficulty === lvl ? 'bg-white dark:bg-slate-700 shadow-md text-primary' : 'text-slate-500'}`}
                                                        >
                                                            {lvl}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Günlük Maksimum Saat</label>
                                                    <div className="relative">
                                                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                                        <select
                                                            value={maxStudyHours}
                                                            onChange={(e) => setMaxStudyHours(e.target.value)}
                                                            className="w-full pl-12 pr-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 appearance-none font-bold"
                                                        >
                                                            {[4, 5, 6, 7, 8, 9, 10, 11, 12].map(h => (
                                                                <option key={h} value={h}>Günde Maks. {h} Saat</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Haftalık Of Günleri</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                                                            <button
                                                                key={day}
                                                                onClick={() => toggleOffDay(day)}
                                                                className={`size-10 rounded-xl font-bold text-[10px] border transition-all ${offDays.includes(day) ? 'bg-primary border-primary text-white' : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                                                            >
                                                                {day}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-4 flex justify-end">
                                            <button
                                                onClick={() => handleUpdate({ aiDifficulty, maxStudyHours, offDays })}
                                                className="px-8 py-4 bg-primary text-white rounded-2xl font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-xl shadow-primary/20"
                                            >
                                                <Save size={20} />
                                                Parametreleri Kaydet
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'library' && (
                                    <motion.div
                                        key="library"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Soru Bankası ve Kaynak Yönetimi</h3>
                                            <p className="text-slate-500 text-sm">Dashboard'daki "Kitaplarım" sekmesini buradan besleyebilirsin.</p>
                                        </div>

                                        <div className="flex gap-4">
                                            <input
                                                type="text"
                                                placeholder="Yeni kitap adı veya barkodu..."
                                                value={newBook}
                                                onChange={(e) => setNewBook(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && addLibraryItem()}
                                                className="flex-1 px-5 py-3.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                                            />
                                            <button
                                                onClick={addLibraryItem}
                                                className="px-6 py-3.5 bg-primary text-white rounded-2xl font-bold flex items-center gap-2"
                                            >
                                                <Plus size={20} />
                                                Ekle
                                            </button>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            {library.map((item, index) => (
                                                <div key={index} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-[1.5rem] group">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-10 rounded-xl bg-white dark:bg-slate-700 flex items-center justify-center text-primary shadow-sm border border-slate-100 dark:border-slate-600">
                                                            <BookOpen size={20} />
                                                        </div>
                                                        <span className="font-bold text-sm">{item}</span>
                                                    </div>
                                                    <button
                                                        onClick={() => removeLibraryItem(item)}
                                                        className="size-8 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'security' && (
                                    <motion.div
                                        key="security"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-primary shadow-sm">
                                                        <Mail size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold">E-posta Adresi</h4>
                                                        <p className="text-sm text-slate-500">{email}</p>
                                                    </div>
                                                </div>
                                                <button className="text-primary font-bold text-sm hover:underline">Değiştir</button>
                                            </div>

                                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-blue-500 shadow-sm">
                                                        <Smartphone size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold">Telefon Numarası</h4>
                                                        <p className="text-sm text-slate-500">{phone || 'Tanımlanmamış'}</p>
                                                    </div>
                                                </div>
                                                <button className="text-primary font-bold text-sm hover:underline">Güncelle</button>
                                            </div>

                                            <div className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-2xl bg-white dark:bg-slate-700 flex items-center justify-center text-orange-500 shadow-sm">
                                                        <ShieldCheck size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-bold">İki Faktörlü Doğrulama (2FA)</h4>
                                                        <p className="text-sm text-slate-500">Giriş güvenliğini artır.</p>
                                                    </div>
                                                </div>
                                                <div className="relative inline-flex items-center cursor-pointer">
                                                    <input type="checkbox" className="sr-only peer" />
                                                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'subscription' && (
                                    <motion.div
                                        key="subscription"
                                        initial={{ opacity: 0, x: 10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="space-y-8"
                                    >
                                        <div className="p-8 bg-slate-900 rounded-[32px] text-white relative overflow-hidden">
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
                                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                                <div className="space-y-2">
                                                    <span className="px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full">Aktif Plan</span>
                                                    <h3 className="text-3xl font-black">UVA Mentor Ücretsiz</h3>
                                                    <p className="text-slate-400 text-sm">Hayallerindeki üniversite için Mentörün hazır.</p>
                                                </div>
                                                <button className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:bg-slate-100 transition-all whitespace-nowrap">
                                                    Premium'a Geç
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                                                <h4 className="font-bold flex items-center gap-2">
                                                    <Download size={18} className="text-primary" />
                                                    Veri ve Gizlilik
                                                </h4>
                                                <div className="space-y-2">
                                                    <button className="w-full text-left p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-sm font-medium">Verilerimi İndir (JSON)</button>
                                                    <button className="w-full text-left p-3 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all text-sm font-medium">İlerleme Raporu (PDF)</button>
                                                </div>
                                            </div>
                                            <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2rem] border border-slate-100 dark:border-slate-800 space-y-4">
                                                <h4 className="font-bold flex items-center gap-2 text-red-500">
                                                    <Trash2 size={18} />
                                                    Tehlikeli Bölge
                                                </h4>
                                                <div className="space-y-2">
                                                    <button className="w-full text-left p-3 hover:bg-red-500/5 text-red-500/80 hover:text-red-500 rounded-xl transition-all text-sm font-medium">Hesabı Dondur</button>
                                                    <button className="w-full text-left p-3 hover:bg-red-500/5 text-red-500/80 hover:text-red-500 rounded-xl transition-all text-sm font-medium">Tüm Verilerimi Sil</button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
