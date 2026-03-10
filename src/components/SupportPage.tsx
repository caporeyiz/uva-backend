/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    ChevronLeft,
    MessageSquare,
    Plus,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    Send,
    Zap,
    Ticket,
    ShieldCheck
} from 'lucide-react';
import { User } from '../services/authService';
import { useToast } from './ToastProvider';

interface SupportTicket {
    id: string;
    user_id: string;
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

interface SupportPageProps {
    user: User | null;
    onNavigate: (view: any) => void;
}

export default function SupportPage({ user, onNavigate }: SupportPageProps) {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [loading, setLoading] = useState(true);
    const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [newTicket, setNewTicket] = useState({ subject: '', category: 'Teknik', message: '' });
    const [submitting, setSubmitting] = useState(false);
    const [replyMessage, setReplyMessage] = useState('');
    const [replying, setReplying] = useState(false);
    const { showToast } = useToast();

    useEffect(() => {
        if (user?.id) {
            fetchTickets();
        }
    }, [user]);

    const fetchTickets = async () => {
        try {
            const resp = await fetch(`http://localhost:3001/api/support/tickets/${user?.id}`);
            const data = await resp.json();
            if (Array.isArray(data)) {
                setTickets(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            showToast('Lütfen önce giriş yapın.', 'error');
            return;
        }
        if (!newTicket.subject.trim() || !newTicket.message.trim()) {
            showToast('Lütfen tüm alanları doldurun.', 'error');
            return;
        }

        setSubmitting(true);
        try {
            const resp = await fetch('http://localhost:3001/api/support/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user?.id,
                    ...newTicket
                })
            });
            const data = await resp.json();
            if (data.success) {
                setIsNewTicketModalOpen(false);
                setNewTicket({ subject: '', category: 'Teknik', message: '' });
                fetchTickets();
                showToast('Destek talebiniz başarıyla oluşturuldu.', 'success');
            } else {
                showToast('Hata: ' + (data.error || 'Talep oluşturulamadı.'), 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Sunucuyla bağlantı kurulamadı.', 'error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSendReply = async () => {
        if (!selectedTicket || !replyMessage.trim() || !user?.id) return;

        setReplying(true);
        try {
            const resp = await fetch('http://localhost:3001/api/support/reply', {
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
                // Optimistically update or just re-fetch
                await fetchTickets();
                // Find and select the updated ticket
                const updatedTickets = await fetch(`http://localhost:3001/api/support/tickets/${user.id}`).then(r => r.json());
                const updated = updatedTickets.find((t: any) => t.id === selectedTicket.id);
                if (updated) setSelectedTicket(updated);
                showToast('Yanıtınız başarıyla gönderildi.', 'success');
            } else {
                showToast('Yanıt gönderilemedi: ' + data.error, 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Bağlantı hatası.', 'error');
        } finally {
            setReplying(false);
        }
    };

    const categories = ['Teknik', 'Fatura', 'Ders Programı', 'AI Sohbet', 'Diğer'];

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'Açık': return <AlertCircle size={14} className="text-orange-500" />;
            case 'Cevaplandı': return <MessageSquare size={14} className="text-blue-500" />;
            case 'Kapandı': return <CheckCircle2 size={14} className="text-green-500" />;
            default: return null;
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Header */}
            <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('dashboard')}
                        className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors group"
                    >
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span>Dashboard'a Dön</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <Ticket className="text-primary" />
                        <span className="text-xl font-black tracking-tighter uppercase">Destek Merkezi</span>
                    </div>

                    <div className="w-24"></div> {/* Placeholder for balance */}
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar / List */}
                    <div className="w-full md:w-1/3 space-y-4">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-2xl font-black">Destek Taleplerim</h2>
                            <button
                                onClick={() => setIsNewTicketModalOpen(true)}
                                className="p-2 rounded-xl bg-primary text-white hover:scale-110 transition-transform shadow-lg shadow-primary/20"
                            >
                                <Plus size={20} />
                            </button>
                        </div>

                        <div className="relative mb-6">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Taleplerde ara..."
                                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-primary outline-none transition-all"
                            />
                        </div>

                        <div className="space-y-3">
                            {loading ? (
                                <div className="text-center py-10 text-slate-400">Yükleniyor...</div>
                            ) : tickets.length === 0 ? (
                                <div className="text-center py-10 text-slate-400 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                                    Henüz bir destek talebiniz bulunmuyor.
                                </div>
                            ) : (
                                tickets.map(ticket => (
                                    <button
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedTicket?.id === ticket.id
                                            ? 'bg-primary/5 border-primary shadow-sm'
                                            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                                                {ticket.category}
                                            </span>
                                            <span className="text-[10px] text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <h4 className="font-bold truncate mb-2">{ticket.subject}</h4>
                                        <div className="flex items-center gap-2">
                                            {statusIcon(ticket.status)}
                                            <span className="text-xs text-slate-500">{ticket.status}</span>
                                        </div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1">
                        {selectedTicket ? (
                            <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xl shadow-slate-200/50 dark:shadow-none min-h-[600px] flex flex-col">
                                {/* Ticket Header */}
                                <div className="p-8 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                                    <div className="flex justify-between items-center mb-4">
                                        <h3 className="text-2xl font-black">{selectedTicket.subject}</h3>
                                        <div className="flex items-center gap-2 px-3 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-bold">
                                            {getStatusIcon(selectedTicket.status)}
                                            {selectedTicket.status}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm text-slate-500">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} />
                                            {new Date(selectedTicket.created_at).toLocaleString()}
                                        </div>
                                        <div className="font-bold text-primary">ID: #{selectedTicket.id}</div>
                                    </div>
                                </div>

                                {/* Messages Area */}
                                <div className="flex-1 p-8 space-y-6 overflow-y-auto max-h-[500px]">
                                    {/* Original Message */}
                                    <div className="flex gap-4">
                                        <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                                            <Zap size={20} className="text-primary" />
                                        </div>
                                        <div className="flex-1 bg-slate-50 dark:bg-slate-800 p-6 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm">
                                            <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedTicket.message}</p>
                                        </div>
                                    </div>

                                    {/* Replies */}
                                    {selectedTicket.replies.map(reply => (
                                        <div key={reply.id} className={`flex gap-4 ${reply.sender === 'user' ? '' : 'flex-row-reverse'}`}>
                                            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${reply.sender === 'user' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-primary text-white'
                                                }`}>
                                                {reply.sender === 'user' ? <Zap size={20} className="text-primary" /> : <ShieldCheck size={20} />}
                                            </div>
                                            <div className={`flex-1 p-6 rounded-3xl border shadow-sm ${reply.sender === 'user'
                                                ? 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 rounded-tl-none'
                                                : 'bg-primary/5 border-primary/20 rounded-tr-none'
                                                }`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                                        {reply.sender === 'user' ? user?.name : 'UVA Destek Ekibi'}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">{new Date(reply.created_at).toLocaleTimeString()}</span>
                                                </div>
                                                <p className="text-slate-700 dark:text-slate-300">{reply.message}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Reply Input */}
                                {selectedTicket.status !== 'Kapandı' && (
                                    <div className="p-8 border-t border-slate-100 dark:border-slate-800">
                                        <div className="relative">
                                            <textarea
                                                value={replyMessage}
                                                onChange={e => setReplyMessage(e.target.value)}
                                                placeholder="Yanıtınızı buraya yazın..."
                                                className="w-full p-4 pr-16 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition-all resize-none h-24"
                                            />
                                            <button
                                                onClick={handleSendReply}
                                                disabled={replying || !replyMessage.trim()}
                                                className="absolute bottom-4 right-4 p-3 rounded-xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-transform disabled:opacity-50"
                                            >
                                                <Send size={20} />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full bg-white dark:bg-slate-900 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center text-center p-12 min-h-[600px]">
                                <div className="size-20 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center mb-6 text-slate-400">
                                    <Ticket size={40} />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Detayları Görüntülemek İçin Bir Talep Seçin</h3>
                                <p className="text-slate-500 max-w-sm">Sol taraftaki listeden bir talep seçebilir veya yeni bir destek talebi oluşturabilirsiniz.</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* New Ticket Modal */}
            <AnimatePresence>
                {isNewTicketModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsNewTicketModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-[3rem] shadow-3xl overflow-hidden"
                        >
                            <div className="p-10">
                                <h3 className="text-3xl font-black mb-8 leading-tight">Yeni Destek Talebi</h3>
                                <form onSubmit={handleCreateTicket} className="space-y-6">
                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Konu</label>
                                        <input
                                            type="text"
                                            required
                                            value={newTicket.subject}
                                            onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })}
                                            placeholder="Örn: Uygulama Hatası, Fatura Sorunu"
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-medium"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Kategori</label>
                                            <select
                                                value={newTicket.category}
                                                onChange={e => setNewTicket({ ...newTicket, category: e.target.value })}
                                                className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-medium appearance-none"
                                            >
                                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex flex-col justify-end">
                                            <p className="text-[10px] text-slate-400 italic">Doğru kategori seçimi çözüm süresini hızlandırır.</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Mesajınız</label>
                                        <textarea
                                            required
                                            value={newTicket.message}
                                            onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
                                            placeholder="Sorununuzu detaylı bir şekilde açıklayın..."
                                            className="w-full px-5 py-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary outline-none transition-all font-medium min-h-[150px] resize-none"
                                        />
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setIsNewTicketModalOpen(false)}
                                            className="flex-1 py-5 rounded-2xl bg-slate-100 dark:bg-slate-800 font-black text-slate-500 hover:bg-slate-200 transition-all"
                                        >
                                            İptal
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={submitting}
                                            className="flex-1 py-5 rounded-2xl bg-primary text-white font-black shadow-xl shadow-primary/30 hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {submitting ? 'Gönderiliyor...' : 'Talebi Oluştur'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

function statusIcon(status: string) {
    switch (status) {
        case 'Açık': return <div className="size-2 rounded-full bg-orange-500 animate-pulse" />;
        case 'Cevaplandı': return <div className="size-2 rounded-full bg-blue-500" />;
        case 'Kapandı': return <div className="size-2 rounded-full bg-slate-300" />;
        default: return null;
    }
}
