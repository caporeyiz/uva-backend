import React, { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) throw new Error('useToast must be used within a ToastProvider');
    return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 11);
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 pointer-events-none w-full max-w-md px-6">
                <AnimatePresence>
                    {toasts.map(toast => (
                        <ToastItem
                            key={toast.id}
                            toast={toast}
                            onClose={() => removeToast(toast.id)}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};

const ToastItem: React.FC<{ toast: Toast, onClose: () => void }> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const icons = {
        success: <CheckCircle2 size={20} className="text-emerald-500" />,
        error: <AlertCircle size={20} className="text-red-500" />,
        info: <Info size={20} className="text-blue-500" />
    };

    const bgColors = {
        success: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-500/20',
        error: 'bg-red-50 dark:bg-red-500/10 border-red-500/20',
        info: 'bg-blue-50 dark:bg-blue-500/10 border-blue-500/20'
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.1 } }}
            className={`pointer-events-auto flex items-center gap-4 p-5 rounded-[1.5rem] border shadow-2xl backdrop-blur-xl ${bgColors[toast.type]}`}
        >
            <div className="shrink-0">{icons[toast.type]}</div>
            <p className="flex-1 text-sm font-black text-slate-800 dark:text-slate-100">{toast.message}</p>
            <button
                onClick={onClose}
                className="shrink-0 p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
                <X size={16} className="text-slate-400" />
            </button>
        </motion.div>
    );
};
