/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Settings,
  Info,
  Bot,
  Lightbulb,
  FileText,
  Calendar,
  AlertTriangle,
  FileEdit,
  History,
  Paperclip,
  Send,
  ChevronLeft,
  Loader2
} from 'lucide-react';
import { chatService, ChatMessage, ChatHistoryItem } from '../services/chat.service';

interface Message {
  id: string;
  role: 'ai' | 'user';
  content: string;
  timestamp: string;
}

export default function ChatPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: "Merhaba! Bugün fizik dünyasına dalmaya hazır mısın? Newton'un hareket yasalarını mı inceleyelim yoksa sınav öncesi biraz motivasyona mı ihtiyacın var?",
      timestamp: '10:42'
    }
  ]);
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadChatHistory = async () => {
      try {
        const history = await chatService.getChatHistory();
        setChatHistory(history);
      } catch (error) {
        console.error('Failed to load chat history:', error);
      }
    };
    loadChatHistory();
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue;
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Convert all messages to backend format
      const chatMessages: ChatMessage[] = [
        ...messages.map(m => ({
          role: m.role === 'ai' ? 'assistant' : 'user',
          content: m.content
        })),
        {
          role: 'user',
          content: messageText
        }
      ];

      const aiMessageContent = await chatService.sendMessage(chatMessages);

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiMessageContent || "Üzgünüm, şu an yanıt veremiyorum. Lütfen tekrar dene.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat API Error:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "Bir hata oluştu. Lütfen backend bağlantısını kontrol et ve tekrar dene.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100">
      {/* Header Section */}
      <header className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 z-10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/dashboard')}
            className="lg:hidden flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mr-1"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-lg font-bold leading-tight tracking-tight">UVA-AI Mentor</h2>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Çevrimiçi</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${showHistory ? 'bg-primary text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary'}`}
          >
            <History size={20} />
          </button>
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
            <Settings size={20} />
          </button>
          <button className="hidden sm:flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary/10 hover:text-primary transition-colors">
            <Info size={20} />
          </button>
          <div
            className="h-10 w-10 rounded-full border-2 border-primary/20 bg-slate-200 dark:bg-slate-700 bg-cover bg-center"
            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDL5ARRJm7hmOnAbp6c8SoVdCnQEGpDTt3iq4nzREZP8E-CEh_T7jFHDphQcACfPIW9UXsap86K1UH6_0wr-dmM9G6_sJhYJOIj2W0lmaLvHZiSa_GY7UAU9O5txgYJ7LtpoU8hNzmdTEnX3aQmPBqSqGif0QiRng568AF_2HAWdHbSQ2PcHLKFGpLfq1V3-cMvRZdqqKBqRjYUn8daLAENtXXC9tc1o5d6rIdrA67ASFUkVRBx8z4Ic6KXzPsODMwCySysLEk3N73X')" }}
          ></div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Chat History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.aside
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-y-auto"
            >
              <div className="p-4 border-b border-slate-200 dark:border-slate-800">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <History size={20} className="text-primary" />
                  Sohbet Geçmişi
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Önceki konuşmalarınız
                </p>
              </div>
              <div className="p-4 space-y-2">
                {chatHistory.length === 0 ? (
                  <p className="text-sm text-slate-400 text-center py-8">
                    Henüz sohbet geçmişi yok
                  </p>
                ) : (
                  chatHistory.map((item, index) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-start gap-2">
                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${item.role === 'assistant' ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-slate-700'}`}>
                          {item.role === 'assistant' ? <Bot size={14} /> : <span className="text-xs">👤</span>}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                            {item.role === 'assistant' ? 'UVA-AI Mentor' : 'Sen'}
                          </p>
                          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                            {item.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-1">
                            {new Date(item.created_at).toLocaleString('tr-TR', { 
                              day: 'numeric', 
                              month: 'short', 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Chat Area */}
        <main ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-8 lg:px-20 xl:px-40 space-y-8 scroll-smooth">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex items-start gap-4 ${msg.role === 'user' ? 'flex-row-reverse ml-auto' : ''} max-w-3xl`}
            >
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${msg.role === 'ai' ? 'bg-primary/10 text-primary' : 'bg-slate-200 dark:bg-slate-700 overflow-hidden bg-cover bg-center'}`}
                style={msg.role === 'user' ? { backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDxM9GKsoRmCA9eDRZN8Ab0CdsUJ4Z6_Xh4kB-KRjVpeKZI1AFFghC_aqa4GQHsAcERyCCg0bVvu8TujkmuuKL3tZFtpMDT5sqxVXfRZhQmmLun355ouHfAQ5tXlAbyZqgpfVJoP-FsWAiY2K798SG9pgzxuXDLH_hK_VBVCQ3ovuY5VchQN3-Trf2JU17p0GgKDWzUXMOojCE7QyOxdc0GVqbLAzdUK_0fpASw_DSk8SipSkaKMvY7R5xELvZ0lmoFdzojo5YiEK0v')" } : {}}
              >
                {msg.role === 'ai' && <Bot size={20} />}
              </div>
              <div className={`flex flex-col gap-2 ${msg.role === 'user' ? 'items-end' : ''}`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold uppercase tracking-wide ${msg.role === 'ai' ? 'text-primary' : 'text-slate-500'}`}>
                    {msg.role === 'ai' ? 'UVA-AI Mentor' : 'Öğrenci'}
                  </span>
                  <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                </div>
                <div className={`rounded-2xl p-5 shadow-sm border ${msg.role === 'ai'
                    ? 'rounded-tl-none bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800'
                    : 'rounded-tr-none bg-primary text-white border-primary shadow-lg shadow-primary/20'
                  }`}>
                  <div className="text-[15px] leading-relaxed whitespace-pre-wrap">
                    {msg.content}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-4 max-w-3xl"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Bot size={20} />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">UVA-AI Mentor</span>
                  <Loader2 size={14} className="animate-spin text-primary" />
                </div>
                <div className="rounded-2xl rounded-tl-none bg-white dark:bg-slate-800 p-5 shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      </div>

      {/* Bottom Controls */}
      <footer className="p-4 lg:px-20 xl:px-40 bg-white dark:bg-background-dark/95 border-t border-slate-200 dark:border-slate-800">
        {/* Quick Suggestion Pills */}
        <div className="flex gap-3 pb-4 overflow-x-auto no-scrollbar scroll-smooth">
          <button
            onClick={() => handleSendMessage("Günün programını göster")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-primary/10 text-primary px-4 text-sm font-semibold hover:bg-primary/20 transition-colors"
          >
            <Calendar size={16} />
            Günün Programı
          </button>
          <button
            onClick={() => handleSendMessage("En çok zorlandığım konular hangileri?")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <AlertTriangle size={16} />
            Zorlandığım Konular
          </button>
          <button
            onClick={() => handleSendMessage("Bugünkü çalışmalarımın özetini çıkar")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <FileEdit size={16} />
            Özet Çıkar
          </button>
          <button
            onClick={() => handleSendMessage("Fizik formüllerini hatırlat")}
            className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-4 text-sm font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            <History size={16} />
            Formül Hatırlat
          </button>
        </div>

        {/* Input Bar */}
        <div className="relative flex items-center gap-3">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
              <Paperclip size={20} />
            </div>
            <input
              className="w-full h-14 rounded-2xl border-none bg-slate-100 dark:bg-slate-800 pl-12 pr-4 text-[15px] focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-slate-700 transition-all text-slate-900 dark:text-white"
              placeholder="Fizik hakkında bir soru sor veya konu belirle..."
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isLoading}
            />
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading}
            className="flex h-14 items-center gap-2 rounded-2xl bg-primary px-6 text-white font-bold hover:bg-primary/90 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="hidden sm:inline">AI'ya Sor</span>
            {isLoading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
        <p className="text-center text-[11px] text-slate-400 mt-3 uppercase tracking-widest font-medium">
          UVA-AI Mentor hata yapabilir. Önemli bilgileri kontrol edin.
        </p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
