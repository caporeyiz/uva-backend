/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
    ChevronLeft,
    Zap,
    Check,
    X,
    Sparkles,
    Star,
    Target,
    Brain,
    Library,
    TrendingUp,
    ShieldCheck,
    Flame
} from 'lucide-react';

interface PricingPageProps {
    onNavigate: (view: any) => void;
}

const PlanFeature = ({ included, text }: { included: boolean, text: string }) => (
    <div className="flex items-center gap-3 py-2">
        {included ? (
            <div className="size-6 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center shrink-0">
                <Check size={14} strokeWidth={3} />
            </div>
        ) : (
            <div className="size-6 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center shrink-0">
                <X size={14} strokeWidth={3} />
            </div>
        )}
        <span className={`text-sm ${included ? 'text-slate-700 dark:text-slate-200 font-medium' : 'text-slate-400'}`}>
            {text}
        </span>
    </div>
);

export default function PricingPage({ onNavigate }: PricingPageProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display selection:bg-primary/20">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-500/5 rounded-full blur-[120px]"></div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4">
                <div className="max-max-w-7xl mx-auto flex items-center justify-between">
                    <button
                        onClick={() => onNavigate('landing')}
                        className="flex items-center gap-2 font-bold text-slate-600 dark:text-slate-300 hover:text-primary transition-colors group"
                    >
                        <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-primary/10 transition-colors">
                            <ChevronLeft size={20} />
                        </div>
                        <span>Geri Dön</span>
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="text-primary">
                            <Zap size={28} fill="currentColor" />
                        </div>
                        <span className="text-xl font-black tracking-tighter uppercase">UVA Mentor</span>
                    </div>

                    <button
                        onClick={() => onNavigate('register')}
                        className="hidden md:flex px-6 py-2.5 bg-primary text-white rounded-xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/25"
                    >
                        Hemen Başla
                    </button>
                </div>
            </nav>

            <main className="relative z-10 max-w-7xl mx-auto px-6 py-20">
                {/* Header */}
                <div className="text-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-6"
                    >
                        <Star size={14} fill="currentColor" />
                        Fiyatlandırma Planları
                    </motion.div>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight"
                    >
                        Hedefine Giden <span className="text-primary italic">Yolu Seç</span>
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto"
                    >
                        İster temel özelliklerle başla, ister AI gücüyle sınırları zorla. Başarı senin seçiminde başlar.
                    </motion.p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-32">
                    {/* Basic Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="p-10 rounded-[3rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden group"
                    >
                        <div className="relative z-10">
                            <div className="mb-8">
                                <h3 className="text-2xl font-black mb-2">UVA Basic</h3>
                                <p className="text-slate-500 text-sm">Sınav yolculuğuna yeni başlayanlar için.</p>
                            </div>

                            <div className="mb-8">
                                <span className="text-5xl font-black">Ücretsiz</span>
                                <p className="text-slate-400 text-xs mt-2 font-bold uppercase tracking-widest">Süresiz Kullanım</p>
                            </div>

                            <div className="space-y-1 mb-10">
                                <PlanFeature included={true} text="Sınırlı Seviye Tespit Analizi" />
                                <PlanFeature included={true} text="Standart Günlük Program" />
                                <PlanFeature included={true} text="Temel Konu Tamamlanma Grafiği" />
                                <PlanFeature included={false} text="AI Reçete™ Sistemi" />
                                <PlanFeature included={false} text="Anlık Hedef Simülasyonu" />
                                <PlanFeature included={false} text="Eldeki Kaynaklara Göre Ödevlendirme" />
                                <PlanFeature included={false} text="Gelişmiş Branş Analizi" />
                                <PlanFeature included={false} text="Reklamsız Deneyim" />
                            </div>

                            <button
                                onClick={() => onNavigate('register')}
                                className="w-full py-5 rounded-[2rem] bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-black hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            >
                                Hemen Başla
                            </button>
                        </div>
                    </motion.div>

                    {/* Premium Plan */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="p-10 rounded-[3rem] bg-slate-900 text-white border-4 border-primary shadow-2xl shadow-primary/20 relative overflow-hidden group scale-105"
                    >
                        <div className="absolute top-0 right-0 p-8">
                            <Sparkles size={32} className="text-primary animate-pulse" />
                        </div>

                        <div className="relative z-10">
                            <div className="mb-8">
                                <div className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-4">En Popüler</div>
                                <h3 className="text-2xl font-black mb-2">UVA Pro (Premium)</h3>
                                <p className="text-slate-400 text-sm">Gerçek bir yapay zeka mentörü ile hedefe kilitlen.</p>
                            </div>

                            <div className="mb-8">
                                <div className="flex items-baseline gap-1">
                                    <span className="text-5xl font-black">₺199</span>
                                    <span className="text-slate-400 font-bold uppercase tracking-wider text-xs">/ Ay</span>
                                </div>
                                <p className="text-primary text-xs mt-2 font-bold uppercase tracking-widest">Yapay Zeka Gücü</p>
                            </div>

                            <div className="space-y-1 mb-10">
                                <PlanFeature included={true} text="Detaylı Nokta Atışı Analizi" />
                                <PlanFeature included={true} text="Dinamik & Kişiye Özel Plan" />
                                <PlanFeature included={true} text="AI Reçete™ (Otomatik İyileştirme)" />
                                <PlanFeature included={true} text="Anlık Hedef Simülasyonu" />
                                <PlanFeature included={true} text="Kitaplarım Entegrasyonu" />
                                <PlanFeature included={true} text="Detaylı Branş Analizi" />
                                <PlanFeature included={true} text="Haftalık Performans Raporu" />
                                <PlanFeature included={true} text="%100 Odaklanma (Reklamsız)" />
                            </div>

                            <button
                                onClick={() => onNavigate('register')}
                                className="w-full py-5 rounded-[2rem] bg-primary text-white font-black hover:bg-primary/90 transition-all shadow-xl shadow-primary/30"
                            >
                                UVA Pro'ya Geç
                            </button>
                        </div>

                        <div className="absolute -bottom-20 -right-20 size-64 bg-primary/20 rounded-full blur-3xl group-hover:bg-primary/30 transition-all"></div>
                    </motion.div>
                </div>

                {/* Comparison Table Section */}
                <section className="mb-40">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black">Derinlemesine Karşılaştırma</h2>
                    </div>

                    <div className="overflow-x-auto rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 dark:border-slate-800">
                                    <th className="p-8 text-sm font-black text-slate-400 uppercase tracking-widest">Özellikler</th>
                                    <th className="p-8 text-xl font-bold bg-slate-50/50 dark:bg-white/5">Ücretsiz</th>
                                    <th className="p-8 text-xl font-bold bg-primary/5 text-primary">UVA Premium</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                {[
                                    { f: "Seviye Tespit Sınavı", b: "Sınırlı Analiz", p: "Detaylı Nokta Atışı" },
                                    { f: "Günlük Çalışma Programı", b: "Standart Plan", p: "Dinamik & Kişiye Özel" },
                                    { f: "AI Reçete™ Sistemi", b: "❌", p: "Eksiğe Göre Otomatik Reçete" },
                                    { f: "\"Yetişiyor mu?\" Takibi", b: "❌", p: "Anlık Hedef Simülasyonu" },
                                    { f: "Kitaplarım Entegrasyonu", b: "❌", p: "Mevcut Kaynaklara Göre" },
                                    { f: "Konu Tamamlanma Grafiği", b: "Temel Takip", p: "Detaylı Branş Analizi" },
                                    { f: "Gelişmiş İstatistikler", b: "❌", p: "Haftalık/Aylık Raporlar" },
                                    { f: "Reklamsız Deneyim", b: "Reklam İçerir", p: "%100 Odaklanma" }
                                ].map((row, i) => (
                                    <tr key={i} className="group hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                                        <td className="p-8 font-bold text-slate-800 dark:text-slate-200">{row.f}</td>
                                        <td className="p-8 text-slate-500 bg-slate-50/50 dark:bg-white/5">{row.b}</td>
                                        <td className="p-8 text-primary font-bold bg-primary/5">{row.p}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Why Premium Section */}
                <section className="py-24">
                    <div className="text-center mb-16">
                        <div className="size-16 rounded-3xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-6">
                            <Flame size={32} />
                        </div>
                        <h2 className="text-4xl font-black">Neden Premium'a Geçmelisin?</h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none hover:border-primary/30 transition-all group">
                            <div className="size-14 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Brain size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-4">1. Sadece "Ne" Değil, "Nasıl" Çalışacağını Bil</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                Ücretsiz üyelikte sadece konuları görürsün; Premium'da ise yapay zekamız hangi konunun hangi kısmında hata yaptığını anlar ve sana o yarayı kapatacak "Özel Reçete" yazar.
                            </p>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none hover:border-primary/30 transition-all group">
                            <div className="size-14 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Target size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-4">2. Belirsizliği Ortadan Kaldır</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                "Bu tempoyla hedeflediğim üniversiteye girebilir miyim?" sorusunun cevabı Premium'da. "Yetişiyor mu?" algoritması her gün performansını ölçer ve seni uyarır.
                            </p>
                        </div>

                        <div className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none hover:border-primary/30 transition-all group">
                            <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                                <Library size={28} />
                            </div>
                            <h3 className="text-xl font-black mb-4">3. Elindeki Kaynakları Akıllıca Kullan</h3>
                            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
                                Yeni kitap almana gerek kalmadan, elindeki mevcut soru bankalarını sisteme tanıt. AI senin için o kitaplardaki en verimli sayfaları seçip ödev olarak versin.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <div className="mt-32 p-12 md:p-20 rounded-[4rem] bg-slate-900 text-white text-center relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">YKS Maratonunu <span className="text-primary italic">Zafere</span> Dönüştür.</h2>
                        <button
                            onClick={() => onNavigate('register')}
                            className="px-12 py-5 bg-primary text-white rounded-[2rem] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-primary/40"
                        >
                            UVA Premium'u Keşfet
                        </button>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center">
                <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                    © 2026 UVA MENTOR • HER HAKKI SAKLIDIR.
                </p>
            </footer>
        </div>
    );
}
