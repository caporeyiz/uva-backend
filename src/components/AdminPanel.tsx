/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    MessageSquare,
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    Send,
    Zap,
    Ticket,
    ShieldCheck,
    User as UserIcon,
    Filter,
    CheckCircle,
    XCircle,
    Mail,
    Users,
    LayoutDashboard,
    TrendingUp,
    Award,
    Trash2,
    RefreshCw,
    MoreVertical,
    ShieldAlert,
    Crown,
    Eye,
    Key,
    FileText,
    ExternalLink,
    Bell
} from 'lucide-react';
import { User } from '../services/authService';
import NotificationDropdown from './NotificationDropdown';
import { useToast } from './ToastProvider';

interface SupportTicket {
    id: string;
    user_id: string;
    user_name: string;
    user_email: string;
    subject: string;
    category: string;
    message: string;
    status: 'Açık' | 'Cevaplandı' | 'Kapandı';
    created_at: string;
    replies: Array<{
        id: string;
        sender: 'user' | 'admin';
        message: string;
        created_at: string;
    }>;
}

interface AdminUser {
    id: string;
    name: string;
    email: string;
    major: string;
    target_rank: string;
    subscription_plan: string;
    role: string;
    created_at: string;
}

interface AdminStats {
    totalUsers: number;
    totalTickets: number;
    openTickets: number;
    premiumUsers: number;
}

interface AdminPanelProps {
    user: User | null;
    onNavigate: (view: any) => void;
}

type AdminTab = 'dashboard' | 'tickets' | 'users' | 'announcements';

export default function AdminPanel({ user, onNavigate }: AdminPanelProps) {
    const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Ticket related state
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [ticketFilter, setTicketFilter] = useState<'Hepsi' | 'Açık' | 'Cevaplandı' | 'Kapandı'>('Hepsi');

    // User related state
    const [userSearch, setUserSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);
    const [activeActionMenu, setActiveActionMenu] = useState<string | null>(null);
    const [detailedUser, setDetailedUser] = useState<any | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('123456'); // Default suggested
    const [targetUserId, setTargetUserId] = useState<string | null>(null);

    // Announcement state
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementMessage, setAnnouncementMessage] = useState('');
    const { showToast } = useToast();

    useEffect(() => {
        if (user?.role !== 'admin') {
            onNavigate('dashboard');
            return;
        }
        fetchAllData();
    }, [user]);

    const fetchAllData = async () => {
        setLoading(true);
        await Promise.all([
            fetchTickets(),
            fetchUsers(),
            fetchStats()
        ]);
        setLoading(false);
    };

    const fetchStats = async () => {
        try {
            const resp = await fetch('http://localhost:3001/api/admin/stats');
            const data = await resp.json();
            setStats(data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTickets = async () => {
        try {
            const resp = await fetch('http://localhost:3001/api/admin/tickets');
            const data = await resp.json();
            if (Array.isArray(data)) {
                setTickets(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const fetchUsers = async () => {
        try {
            const resp = await fetch('http://localhost:3001/api/admin/users');
            const data = await resp.json();
            if (Array.isArray(data)) {
                setUsers(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !replyMessage.trim()) return;

        setSubmitting(true);
        try {
            const resp = await fetch('http://localhost:3001/api/admin/reply', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ticketId: selectedTicket.id,
                    message: replyMessage
                })
            });
            const data = await resp.json();
            if (data.success) {
                setReplyMessage('');
                fetchTickets();
                fetchStats();
                setSelectedTicket(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        status: 'Cevaplandı',
                        replies: [...prev.replies, {
                            id: Math.random().toString(),
                            sender: 'admin',
                            message: replyMessage,
                            created_at: new Date().toISOString()
                        }]
                    }
                });
            }
        } catch (err) {
            console.error(err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleCloseTicket = async () => {
        if (!selectedTicket) return;
        try {
            const resp = await fetch('http://localhost:3001/api/admin/close-ticket', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ticketId: selectedTicket.id })
            });
            const data = await resp.json();
            if (data.success) {
                fetchTickets();
                fetchStats();
                setSelectedTicket(prev => prev ? { ...prev, status: 'Kapandı' } : null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateUserRole = async (userId: string, newRole: string) => {
        try {
            const resp = await fetch('http://localhost:3001/api/admin/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, updates: { role: newRole } })
            });
            if (resp.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateUserPlan = async (userId: string, newPlan: string) => {
        try {
            const resp = await fetch('http://localhost:3001/api/admin/users/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, updates: { subscriptionPlan: newPlan } })
            });
            if (resp.ok) {
                fetchUsers();
                fetchStats();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm('Bu kullanıcıyı ve tüm verilerini silmek istediğinize emin misiniz?')) return;
        try {
            const resp = await fetch(`http://localhost:3001/api/admin/users/${userId}`, { method: 'DELETE' });
            if (resp.ok) {
                fetchUsers();
                fetchStats();
                fetchTickets();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleViewDetails = async (userId: string) => {
        try {
            const resp = await fetch(`http://localhost:3001/api/admin/users/${userId}`);
            const data = await resp.json();
            setDetailedUser(data);
            setIsDetailModalOpen(true);
            setActiveActionMenu(null);
        } catch (err) {
            console.error(err);
            showToast('Detaylar alınamadı.', 'error');
        }
    };

    const handleResetPassword = async () => {
        if (!targetUserId) return;
        try {
            const resp = await fetch('http://localhost:3001/api/admin/users/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: targetUserId, newPassword })
            });
            const data = await resp.json();
            if (data.success) {
                showToast('Şifre başarıyla ' + newPassword + ' olarak sıfırlandı.', 'success');
                setIsResetPasswordModalOpen(false);
                setTargetUserId(null);
            }
        } catch (err) {
            console.error(err);
            showToast('Şifre sıfırlanamadı.', 'error');
        }
    };

    const handleSendAnnouncement = async () => {
        if (!announcementTitle.trim() || !announcementMessage.trim()) {
            showToast('Lütfen başlık ve mesaj girin.', 'error');
            return;
        }
        setSubmitting(true);
        try {
            const resp = await fetch('http://localhost:3001/api/admin/announcement', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: announcementTitle, message: announcementMessage })
            });
            const data = await resp.json();
            if (data.success) {
                showToast('Duyuru başarıyla yayınlandı!', 'success');
                setAnnouncementTitle('');
                setAnnouncementMessage('');
                setActiveTab('dashboard');
            }
        } catch (err) {
            console.error(err);
            showToast('Duyuru gönderilemedi.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const filteredTickets = tickets.filter(t => ticketFilter === 'Hepsi' || t.status === ticketFilter);
    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.email.toLowerCase().includes(userSearch.toLowerCase())
    );

    return (
        <div className="flex h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Sidebar Control Panel */}
            <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col p-6 gap-8">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                        <ShieldCheck className="text-white" size={24} />
                    </div>
                    <h1 className="text-xl font-black tracking-tighter uppercase">Admin Panel</h1>
                </div>

                <nav className="flex flex-col gap-2">
                    <SidebarTab
                        icon={LayoutDashboard}
                        label="Genel Bakış"
                        active={activeTab === 'dashboard'}
                        onClick={() => setActiveTab('dashboard')}
                    />
                    <SidebarTab
                        icon={Ticket}
                        label="Destek Talepleri"
                        active={activeTab === 'tickets'}
                        onClick={() => setActiveTab('tickets')}
                        badge={stats?.openTickets}
                    />
                    <SidebarTab
                        icon={Users}
                        label="Kullanıcı Yönetimi"
                        active={activeTab === 'users'}
                        onClick={() => setActiveTab('users')}
                    />
                    <SidebarTab
                        icon={Bell}
                        label="Duyuru Yap"
                        active={activeTab === 'announcements'}
                        onClick={() => setActiveTab('announcements')}
                    />
                </nav>

                <div className="mt-auto">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="w-full flex items-center gap-3 p-4 rounded-2xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all font-bold group"
                    >
                        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Dashboard'a Dön
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navbar */}
                <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-8 flex items-center justify-between shrink-0">
                    <h2 className="text-2xl font-black capitalize">
                        {activeTab === 'dashboard' ? 'Genel Bakış' : activeTab === 'tickets' ? 'Destek Talepleri' : 'Kullanıcı Yönetimi'}
                    </h2>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={fetchAllData}
                            className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-all active:rotate-180 duration-500"
                        >
                            <RefreshCw size={20} />
                        </button>
                        <NotificationDropdown user={user} />
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-800">
                            <div className="text-right">
                                <p className="text-sm font-bold">{user?.name}</p>
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Baş Admin</p>
                            </div>
                            <div className="size-10 rounded-full bg-primary/20 flex items-center justify-center border-2 border-primary text-primary">
                                <ShieldCheck size={20} />
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                    <AnimatePresence mode="wait">
                        {activeTab === 'dashboard' && (
                            <motion.div
                                key="dashboard"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                                    <StatCard icon={Users} label="Toplam Kullanıcı" value={stats?.totalUsers || 0} color="blue" />
                                    <StatCard icon={Crown} label="Premium Üyeler" value={stats?.premiumUsers || 0} color="emerald" />
                                    <StatCard icon={Ticket} label="Toplam Talep" value={stats?.totalTickets || 0} color="indigo" />
                                    <StatCard icon={AlertCircle} label="Açık Talepler" value={stats?.openTickets || 0} color="orange" />
                                </div>

                                {/* Quick Reports / Activity */}
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8">
                                        <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                                            <TrendingUp className="text-primary" size={20} />
                                            Son Aktiviteler
                                        </h3>
                                        <div className="space-y-6">
                                            {tickets.slice(0, 5).map(t => (
                                                <div key={t.id} className="flex items-start gap-4">
                                                    <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800">
                                                        <Ticket size={16} className="text-slate-400" />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-bold">{t.user_name} yeni bir talep açtı.</p>
                                                        <p className="text-xs text-slate-500 leading-tight mt-1">{t.subject}</p>
                                                    </div>
                                                    <span className="text-[10px] text-slate-400">{new Date(t.created_at).toLocaleDateString()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col justify-center items-center text-center">
                                        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                                            <ShieldCheck size={40} />
                                        </div>
                                        <h3 className="text-2xl font-black mb-2">Tam Kontrol Sende</h3>
                                        <p className="text-slate-500 max-w-sm">UVA Mentor platformundaki tüm kullanıcı verileri, ödemeler ve destek süreçleri bu panelden yönetilmektedir.</p>
                                        <button
                                            onClick={() => setActiveTab('users')}
                                            className="mt-8 px-8 py-4 bg-primary text-white rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                        >
                                            Kullanıcıları Yönet
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'tickets' && (
                            <motion.div
                                key="tickets"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full flex gap-8"
                            >
                                {/* Ticket List */}
                                <div className="w-1/3 space-y-4">
                                    <div className="flex gap-2 p-1 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                                        {['Hepsi', 'Açık', 'Cevaplandı', 'Kapandı'].map((s: any) => (
                                            <button
                                                key={s}
                                                onClick={() => setTicketFilter(s)}
                                                className={`flex-1 py-3 text-[10px] font-black uppercase rounded-xl transition-all ${ticketFilter === s ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-50'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-280px)] pr-2 custom-scrollbar">
                                        {filteredTickets.map(t => (
                                            <button
                                                key={t.id}
                                                onClick={() => setSelectedTicket(t)}
                                                className={`w-full text-left p-5 rounded-2xl border transition-all ${selectedTicket?.id === t.id ? 'bg-primary/5 border-primary' : 'bg-white dark:bg-slate-900 border-slate-200 hover:border-slate-300'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start mb-2">
                                                    <StatusBadge status={t.status} />
                                                    <span className="text-[10px] text-slate-400">{new Date(t.created_at).toLocaleDateString()}</span>
                                                </div>
                                                <h4 className="font-bold truncate mb-1">{t.subject}</h4>
                                                <p className="text-xs text-slate-500 truncate">{t.user_name}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ticket Detail */}
                                <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden flex flex-col">
                                    {selectedTicket ? (
                                        <>
                                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
                                                <div>
                                                    <div className="flex items-center gap-3 mb-1">
                                                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{selectedTicket.subject}</h3>
                                                        <StatusBadge status={selectedTicket.status} />
                                                    </div>
                                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{selectedTicket.user_name} ({selectedTicket.user_email})</p>
                                                </div>
                                                <button
                                                    onClick={handleCloseTicket}
                                                    className="p-4 rounded-2xl bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all font-bold text-xs"
                                                >
                                                    Talebi Kapat
                                                </button>
                                            </div>
                                            <div className="flex-1 p-8 overflow-y-auto space-y-8 custom-scrollbar">
                                                {/* User Message */}
                                                <div className="flex gap-4">
                                                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0"><UserIcon size={20} className="text-slate-400" /></div>
                                                    <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-700">
                                                        <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedTicket.message}</p>
                                                    </div>
                                                </div>
                                                {/* Conversation */}
                                                {selectedTicket.replies.map(r => (
                                                    <div key={r.id} className={`flex gap-4 ${r.sender === 'admin' ? 'flex-row-reverse' : ''}`}>
                                                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${r.sender === 'admin' ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800'}`}>
                                                            {r.sender === 'admin' ? <ShieldCheck size={20} /> : <UserIcon size={20} className="text-slate-400" />}
                                                        </div>
                                                        <div className={`flex-1 p-6 rounded-3xl border shadow-sm ${r.sender === 'admin' ? 'bg-primary/5 border-primary/20 rounded-tr-none text-primary dark:text-primary-light' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-tl-none text-slate-700 dark:text-slate-300'}`}>
                                                            <p className={`${r.sender === 'admin' ? 'text-right' : ''}`}>{r.message}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                            {selectedTicket.status !== 'Kapandı' && (
                                                <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50/30 dark:bg-slate-800/30">
                                                    <div className="relative">
                                                        <textarea
                                                            value={replyMessage}
                                                            onChange={e => setReplyMessage(e.target.value)}
                                                            placeholder="Yanıtınızı yazın..."
                                                            className="w-full p-6 pr-24 rounded-3xl bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-700 text-slate-900 dark:text-white focus:border-primary outline-none transition-all resize-none h-32"
                                                        />
                                                        <button
                                                            onClick={handleSendReply}
                                                            disabled={submitting || !replyMessage.trim()}
                                                            className="absolute bottom-6 right-6 p-4 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 hover:scale-105 transition-all"
                                                        >
                                                            <Send size={24} />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center text-center p-12 text-slate-400">
                                            <MessageSquare size={64} className="mb-6 opacity-20" />
                                            <h3 className="text-xl font-bold">Bir Talep Seçin</h3>
                                            <p>Detayları görüntülemek ve yanıtlamak için sol listeden bir talep seçin.</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'users' && (
                            <motion.div
                                key="users"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="space-y-6"
                            >
                                {/* Search / Filter Row */}
                                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                                    <div className="relative w-full md:w-96">
                                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                                        <input
                                            type="text"
                                            value={userSearch}
                                            onChange={e => setUserSearch(e.target.value)}
                                            placeholder="Kullanıcı ara (İsim, E-posta...)"
                                            className="w-full pl-12 pr-6 py-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-3">
                                        <button className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-white border border-slate-200 font-bold text-sm text-slate-600">
                                            <Filter size={18} /> Filtrele
                                        </button>
                                    </div>
                                </div>

                                {/* Users Table */}
                                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 relative">
                                    <table className="w-full text-left border-collapse">
                                        <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                            <tr>
                                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 first:rounded-tl-[2.5rem]">Kullanıcı</th>
                                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Plan</th>
                                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Rol</th>
                                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400">Kayıt Tarihi</th>
                                                <th className="px-8 py-6 text-xs font-black uppercase tracking-widest text-slate-400 text-right last:rounded-tr-[2.5rem]">Eylemler</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredUsers.map(u => (
                                                <tr key={u.id} className="border-b border-slate-50 dark:border-slate-800 last:border-0 hover:bg-slate-50/50 transition-colors">
                                                    <td className="px-8 py-6 first:rounded-bl-[2.5rem]">
                                                        <div className="flex items-center gap-4">
                                                            <div className={`size-10 rounded-full flex items-center justify-center font-bold ${u.role === 'admin' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                                                                {u.name.charAt(0)}
                                                            </div>
                                                            <div>
                                                                <p className="font-bold">{u.name}</p>
                                                                <p className="text-xs text-slate-500">{u.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <select
                                                            value={u.subscription_plan}
                                                            onChange={(e) => handleUpdateUserPlan(u.id, e.target.value)}
                                                            className="bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-xs font-bold outline-none border-0"
                                                        >
                                                            <option value="Free">UVA Basic</option>
                                                            <option value="Premium">UVA Pro (Premium)</option>
                                                            <option value="VIP">VIP Mentorluk</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-8 py-6">
                                                        <select
                                                            value={u.role}
                                                            onChange={(e) => handleUpdateUserRole(u.id, e.target.value)}
                                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase border-0 outline-none ${u.role === 'admin' ? 'bg-indigo-500 text-white' : 'bg-slate-100 text-slate-600'
                                                                }`}
                                                        >
                                                            <option value="user">USER</option>
                                                            <option value="admin">ADMIN</option>
                                                        </select>
                                                    </td>
                                                    <td className="px-8 py-6 text-sm text-slate-500">
                                                        {new Date(u.created_at || Date.now()).toLocaleDateString()}
                                                    </td>
                                                    <td className="px-8 py-6 text-right last:rounded-br-[2.5rem]">
                                                        <div className="flex justify-end gap-2 relative">
                                                            <button
                                                                onClick={() => handleDeleteUser(u.id)}
                                                                className="p-3 rounded-xl hover:bg-red-50 text-slate-300 hover:text-red-500 transition-all"
                                                                title="Kullanıcıyı Sil"
                                                            >
                                                                <Trash2 size={18} />
                                                            </button>
                                                            <div className="relative">
                                                                <button
                                                                    onClick={() => setActiveActionMenu(activeActionMenu === u.id ? null : u.id)}
                                                                    className={`p-3 rounded-xl transition-all ${activeActionMenu === u.id ? 'bg-primary/10 text-primary' : 'hover:bg-slate-100 text-slate-300 hover:text-slate-600'}`}
                                                                >
                                                                    <MoreVertical size={18} />
                                                                </button>

                                                                <AnimatePresence>
                                                                    {activeActionMenu === u.id && (
                                                                        <>
                                                                            <motion.div
                                                                                initial={{ opacity: 0 }}
                                                                                animate={{ opacity: 1 }}
                                                                                exit={{ opacity: 0 }}
                                                                                onClick={() => setActiveActionMenu(null)}
                                                                                className="fixed inset-0 z-40"
                                                                            />
                                                                            <motion.div
                                                                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                                                                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                                                                className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl z-50 overflow-hidden"
                                                                            >
                                                                                <div className="p-2 space-y-1">
                                                                                    <button
                                                                                        onClick={() => handleViewDetails(u.id)}
                                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                                                                    >
                                                                                        <Eye size={16} /> Detayları Gör
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setTargetUserId(u.id);
                                                                                            setIsResetPasswordModalOpen(true);
                                                                                            setActiveActionMenu(null);
                                                                                        }}
                                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                                                                    >
                                                                                        <Key size={16} /> Şifreyi Sıfırla
                                                                                    </button>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            setTicketFilter('Hepsi');
                                                                                            setActiveTab('tickets');
                                                                                            setActiveActionMenu(null);
                                                                                        }}
                                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                                                                                    >
                                                                                        <FileText size={16} /> Taleplerini Gör
                                                                                    </button>
                                                                                    <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
                                                                                    <button
                                                                                        onClick={() => {
                                                                                            handleDeleteUser(u.id);
                                                                                            setActiveActionMenu(null);
                                                                                        }}
                                                                                        className="w-full flex items-center gap-3 px-4 py-2 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                                                                                    >
                                                                                        <Trash2 size={16} /> Kullanıcıyı Sil
                                                                                    </button>
                                                                                </div>
                                                                            </motion.div>
                                                                        </>
                                                                    )}
                                                                </AnimatePresence>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'announcements' && (
                            <motion.div
                                key="announcements"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="bg-white dark:bg-slate-900 rounded-[3rem] border border-slate-200 dark:border-slate-800 p-12 shadow-2xl">
                                    <div className="flex items-center gap-6 mb-10">
                                        <div className="size-16 rounded-3xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/20">
                                            <Bell size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-3xl font-black">Yeni Duyuru Oluştur</h3>
                                            <p className="text-slate-500 font-medium">Bu duyuru tüm kullanıcıların bildirim panelinde görünecek.</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Duyuru Başlığı</label>
                                            <input
                                                type="text"
                                                value={announcementTitle}
                                                onChange={(e) => setAnnouncementTitle(e.target.value)}
                                                placeholder="Örn: Yeni Özellik: Deneme Analizi Yayında!"
                                                className="w-full p-6 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold text-lg"
                                            />
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-sm font-black text-slate-400 uppercase tracking-widest ml-1">Mesaj İçeriği</label>
                                            <textarea
                                                rows={6}
                                                value={announcementMessage}
                                                onChange={(e) => setAnnouncementMessage(e.target.value)}
                                                placeholder="Duyuru detaylarını buraya yazın..."
                                                className="w-full p-6 rounded-[1.5rem] bg-slate-50 dark:bg-slate-800 border-2 border-transparent focus:border-primary/20 focus:bg-white dark:focus:bg-slate-900 transition-all outline-none font-bold resize-none"
                                            />
                                        </div>

                                        <button
                                            onClick={handleSendAnnouncement}
                                            disabled={submitting}
                                            className="w-full py-6 bg-primary text-white rounded-[1.5rem] font-black shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                        >
                                            {submitting ? (
                                                <RefreshCw className="animate-spin" size={24} />
                                            ) : (
                                                <>
                                                    <Send size={24} />
                                                    Duyuruyu Şimdi Yayınla
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* User Detail Modal */}
            <AnimatePresence>
                {isDetailModalOpen && detailedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsDetailModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
                        >
                            <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                                <div className="flex items-center gap-4">
                                    <div className="size-14 rounded-2xl bg-primary flex items-center justify-center text-white text-2xl font-black">
                                        {detailedUser.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black">{detailedUser.name}</h3>
                                        <p className="text-sm text-slate-500">{detailedUser.email}</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsDetailModalOpen(false)} className="p-3 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                                    <XCircle size={24} className="text-slate-400" />
                                </button>
                            </div>

                            <div className="p-8 overflow-y-auto max-h-[60vh] grid grid-cols-2 gap-8 custom-scrollbar">
                                <DetailItem label="Alan Seçimi" value={detailedUser.major} />
                                <DetailItem label="Hedef Sıralama" value={detailedUser.target_rank} />
                                <DetailItem label="Hedef Üniversite / Bölüm" value={detailedUser.target_goal} />
                                <DetailItem label="Mezuniyet Durumu" value={detailedUser.education_status} />
                                <DetailItem label="Okul / Kurum Bilgisi" value={detailedUser.school_name || 'Girilmedi'} />
                                <DetailItem label="Okul Durumu" value={detailedUser.school_status} />
                                <DetailItem label="Günlük Çalışma Saati" value={detailedUser.daily_study_hours} />
                                <DetailItem label="En Çok Zorlanılan Ders" value={detailedUser.hardest_subject} />
                                <DetailItem label="Hesap Rolü" value={detailedUser.role?.toUpperCase()} />
                                <DetailItem label="Abonelik Planı" value={detailedUser.subscription_plan} />

                                <div className="col-span-2 space-y-4">
                                    <p className="text-xs font-black uppercase text-slate-400 tracking-widest border-b border-slate-100 dark:border-slate-800 pb-2">Seviye Bilgileri</p>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Matematik</p>
                                            <p className="font-black text-primary">{detailedUser.base_level?.math || 'Bilgi Yok'}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Türkçe</p>
                                            <p className="font-black text-primary">{detailedUser.base_level?.turkish || 'Bilgi Yok'}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center">
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">Fen</p>
                                            <p className="font-black text-primary">{detailedUser.base_level?.science || 'Bilgi Yok'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Reset Password Modal */}
            <AnimatePresence>
                {isResetPasswordModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsResetPasswordModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8"
                        >
                            <div className="size-16 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-500 mb-6">
                                <Key size={32} />
                            </div>
                            <h3 className="text-2xl font-black mb-2">Şifreyi Sıfırla</h3>
                            <p className="text-slate-500 mb-8 font-medium italic">Kullanıcının hesabına giriş yapabileceği yeni bir şifre belirleyin.</p>

                            <div className="space-y-6">
                                <div>
                                    <label className="text-xs font-black uppercase text-slate-400 ml-1 mb-2 block">Yeni Şifre</label>
                                    <input
                                        type="text"
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        className="w-full px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-bold"
                                    />
                                </div>
                                <div className="flex gap-4">
                                    <button
                                        onClick={() => setIsResetPasswordModalOpen(false)}
                                        className="flex-1 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 font-bold transition-all text-slate-600"
                                    >
                                        İptal
                                    </button>
                                    <button
                                        onClick={handleResetPassword}
                                        className="flex-1 py-4 rounded-2xl bg-primary text-white font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                                    >
                                        Şifreyi Değiştir
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Sub-components
function DetailItem({ label, value }: { label: string, value: string }) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-black uppercase text-slate-400 tracking-widest">{label}</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{value || 'Belirtilmedi'}</p>
        </div>
    );
}

function SidebarTab({ icon: Icon, label, active, onClick, badge }: any) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-3 p-4 rounded-2xl font-bold transition-all relative ${active
                ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105'
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
        >
            <Icon size={20} />
            <span className="flex-1 text-left">{label}</span>
            {badge && badge > 0 && (
                <span className="bg-red-500 text-white text-[10px] size-5 rounded-full flex items-center justify-center animate-pulse">
                    {badge}
                </span>
            )}
        </button>
    );
}

function StatCard({ icon: Icon, label, value, color }: any) {
    const colors: any = {
        blue: 'text-blue-500 bg-blue-50',
        emerald: 'text-emerald-500 bg-emerald-50',
        indigo: 'text-indigo-500 bg-indigo-50',
        orange: 'text-orange-500 bg-orange-50'
    };

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 flex flex-col gap-4 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 transition-all">
            <div className={`size-12 rounded-2xl flex items-center justify-center ${colors[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-3xl font-black">{value}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{label}</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: any = {
        'Açık': { bg: 'bg-orange-500/10', text: 'text-orange-500', label: 'AÇIK' },
        'Cevaplandı': { bg: 'bg-blue-500/10', text: 'text-blue-500', label: 'CEVAPLANDI' },
        'Kapandı': { bg: 'bg-slate-500/10', text: 'text-slate-500', label: 'KAPANDI' }
    };
    const config = configs[status] || configs['Açık'];
    return (
        <span className={`${config.bg} ${config.text} px-2 py-1 rounded text-[10px] font-black uppercase tracking-tighter`}>
            {config.label}
        </span>
    );
}
