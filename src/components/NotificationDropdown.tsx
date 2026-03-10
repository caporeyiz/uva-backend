import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, Info, Ticket, AlertCircle, Clock } from 'lucide-react';
import { User } from '../services/authService';

interface Notification {
    id: string;
    title: string;
    message: string;
    type: 'system' | 'ticket' | 'announcement';
    is_read: number;
    created_at: string;
}

interface NotificationDropdownProps {
    user: User | null;
}

export default function NotificationDropdown({ user }: NotificationDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchNotifications = async () => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const resp = await fetch(`http://localhost:3001/api/notifications/${user.id}`);
            const data = await resp.json();
            if (Array.isArray(data)) {
                setNotifications(data);
            }
        } catch (err) {
            console.error('Bildirimler alınamadı:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchNotifications();
        }
    }, [isOpen, user]);

    // Initial fetch to get unread count
    useEffect(() => {
        fetchNotifications();
        // Poll every minute
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            await fetch('http://localhost:3001/api/notifications/mark-read', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ notificationId: id })
            });
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: 1 } : n));
        } catch (err) {
            console.error(err);
        }
    };

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'ticket': return <Ticket size={16} className="text-blue-500" />;
            case 'announcement': return <Info size={16} className="text-primary" />;
            default: return <AlertCircle size={16} className="text-slate-400" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative flex items-center justify-center rounded-lg h-10 w-10 transition-colors ${isOpen ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'
                    }`}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 size-5 bg-red-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-slate-900 animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-[60]"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 md:w-96 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 z-[70] overflow-hidden"
                        >
                            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                                <h3 className="font-black text-lg">Bildirimler</h3>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                                {loading && notifications.length === 0 ? (
                                    <div className="p-10 text-center text-slate-400">Yükleniyor...</div>
                                ) : notifications.length === 0 ? (
                                    <div className="p-12 text-center text-slate-400">
                                        <div className="size-16 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                                            <Bell size={32} />
                                        </div>
                                        <p className="font-bold">Henüz bildiriminiz yok.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                        {notifications.map(n => (
                                            <div
                                                key={n.id}
                                                onClick={() => markAsRead(n.id)}
                                                className={`p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer relative group ${!n.is_read ? 'bg-primary/5' : ''}`}
                                            >
                                                {!n.is_read && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                                                )}
                                                <div className="flex gap-4">
                                                    <div className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${n.type === 'ticket' ? 'bg-blue-50 dark:bg-blue-500/10' :
                                                            n.type === 'announcement' ? 'bg-primary/10' : 'bg-slate-100 dark:bg-slate-800'
                                                        }`}>
                                                        {getIcon(n.type)}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex justify-between items-start mb-1 gap-2">
                                                            <h4 className={`text-sm font-bold truncate ${!n.is_read ? 'text-slate-900 dark:text-white' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                {n.title}
                                                            </h4>
                                                            <span className="text-[10px] text-slate-400 whitespace-nowrap flex items-center gap-1">
                                                                <Clock size={10} />
                                                                {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                            </span>
                                                        </div>
                                                        <p className={`text-xs leading-relaxed line-clamp-2 ${!n.is_read ? 'text-slate-700 dark:text-slate-300' : 'text-slate-500'}`}>
                                                            {n.message}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 text-center">
                                <button className="text-xs font-black text-primary hover:underline uppercase tracking-widest">
                                    Tümünü Gör
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
