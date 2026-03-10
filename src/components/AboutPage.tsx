/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import {
    ChevronLeft,
    Zap,
    Target,
    Brain,
    Users,
    Globe,
    Sparkles,
    ShieldCheck,
    TrendingUp,
    Clock,
    CheckCircle2
} from 'lucide-react';

interface AboutPageProps {
    onNavigate: (view: any) => void;
}

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }: { icon: any, title: string, description: string, delay?: number }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay }}
        className="p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/30 transition-all group"
    >
        <div className="size-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <Icon size={28} />
        </div>
        <h3 className="text-xl font-black mb-3 text-slate-900 dark:text-white">{title}</h3>
        <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-sm">
            {description}
        </p>
    </motion.div>
);

export default function AboutPage({ onNavigate }: AboutPageProps) {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display selection:bg-primary/20">
            {/* Dynamic Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Navigation */}
            <nav className="sticky top-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
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

            <main className="relative z-10">
                {/* Hero Section */}
                <section className="pt-20 pb-32 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-8"
                        >
                            <Sparkles size={14} />
                            Geleceğin Eğitim Teknolojisi
                        </motion.div>
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black tracking-tight leading-[1.1] mb-8"
                        >
                            Eğitimde <span className="text-primary italic">Yapay Zeka</span> Devrimi
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl mx-auto"
                        >
                            Her öğrencinin öğrenme hızının ve eksiklerinin eşsiz olduğuna inanıyoruz. UVA Mentor ile belirsizliği bitiriyor, veriye dayalı bir başarı rotası çiziyoruz.
                        </motion.p>
                    </div>
                </section>

                {/* Biz Kimiz? */}
                <section className="py-24 px-6 bg-white dark:bg-slate-900/50">
                    <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-black mb-8 leading-tight">Biz Kimiz?</h2>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                UVA Mentor, geleneksel eğitim metodlarının "herkese tek tip program" dayatmasına karşı çıkan, her öğrencinin öğrenme hızının ve eksiklerinin eşsiz olduğuna inanan bir teknoloji girişimidir.
                            </p>
                            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                                YKS maratonunda kaybolan, "Bugün ne çalışmalıyım?" sorusuyla vakit kaybeden ve netleri yerinde sayan öğrenciler için kişiselleştirilmiş bir navigasyon sistemi inşa ettik.
                            </p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative aspect-square md:aspect-video rounded-[3rem] overflow-hidden shadow-2xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-blue-500/20 mix-blend-overlay"></div>
                            <img
                                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
                                alt="UVA Mentor Team Works"
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute bottom-8 left-8 right-8 p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                <p className="text-white font-bold italic">"Gelecek, veriyi doğru okuyanların olacak."</p>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Nereden Başlayacağınızı Bilmiyor Musunuz? */}
                <section className="py-32 px-6">
                    <div className="max-w-5xl mx-auto text-center">
                        <div className="size-20 rounded-3xl bg-orange-500/10 text-orange-500 flex items-center justify-center mx-auto mb-10">
                            <Target size={40} />
                        </div>
                        <h2 className="text-4xl font-black mb-8 leading-tight">Nereden Başlayacağınızı Bilmiyor Musunuz?</h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl mx-auto mb-12">
                            YKS maratonu devasa bir konu yığını gibi göründüğünde, çoğu öğrenci şu çıkmaza girer: "Nereden başlayacağımı bilmiyorum, o yüzden hiç başlamıyorum." Birçok çalışma planı, ilk hafta aksadığı için rafa kalkıyor ve hayaller yarıda kalıyor.
                        </p>
                        <div className="p-8 rounded-[2rem] bg-orange-500 text-white font-bold inline-block shadow-2xl shadow-orange-500/30">
                            UVA Mentor, belirsizliğin bittiği noktada devreye giriyor.
                        </div>
                    </div>
                </section>

                {/* Yapay Zeka Koçluk Sistemimiz */}
                <section className="py-32 px-6 bg-slate-900 text-white overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] -mr-48 -mt-48"></div>

                    <div className="max-w-7xl mx-auto relative z-10">
                        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-20">
                            <div className="max-w-2xl">
                                <h2 className="text-4xl md:text-5xl font-black mb-6 italic leading-tight">Yapay Zeka Koçluk Sistemimizle Tanışın</h2>
                                <p className="text-slate-400 text-lg">
                                    Biz sadece bir ders programı uygulaması değiliz; biz senin verilerini analiz eden, eksiklerini senden iyi bilen Dijital Koçunuzuz.
                                </p>
                            </div>
                            <div className="p-4 rounded-3xl bg-primary/20 border border-primary/30 backdrop-blur-sm">
                                <Brain size={48} className="text-primary" />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="size-12 rounded-2xl bg-primary text-white flex items-center justify-center mb-6">
                                    <Clock size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Süreç Artık Yarıda Kalmayacak</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    "Bugün ne çalışsam?" stresi bitti. Sistemimiz, seviye tespit sınavındaki verilerini işleyerek sana her sabah net görevler verir.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="size-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center mb-6">
                                    <ShieldCheck size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">Kişiye Özel Akıllı Reçete</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Yapay zeka algoritmamız, yanlış yaptığın soruların altındaki asıl eksik konuyu saptar ve sana "iyileştirici" bir reçete yazar.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                                <div className="size-12 rounded-2xl bg-green-500 text-white flex items-center justify-center mb-6">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-4">7/24 Yanında Olan Mentor</h3>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    İlerleyişini anlık takip eden sistemimiz, hedefine ulaşıp ulaşamayacağını saniyeler içinde hesaplar ve seni yönlendirir.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Neden Buradayız? */}
                <section className="py-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-20">
                            <h2 className="text-4xl font-black mb-6">Neden Buradayız?</h2>
                            <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                                Milyonlarca öğrencinin yarıştığı YKS’de en değerli kaynak zaman, en büyük düşman ise belirsizliktir.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                "Hangi konuyu tam biliyorsun?",
                                "Hangi yanlışın aslında bir 'zincirleme eksiklikten' kaynaklanıyor?",
                                "Mevcut temponla hedefine gerçekten yetişiyor musun?"
                            ].map((q, i) => (
                                <div key={i} className="p-10 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex flex-col items-center text-center">
                                    <div className="size-10 rounded-full bg-slate-100 dark:bg-slate-800 text-primary font-black flex items-center justify-center mb-6">0{i + 1}</div>
                                    <h4 className="text-xl font-bold leading-tight px-4">{q}</h4>
                                </div>
                            ))}
                        </div>

                        <div className="mt-16 text-center">
                            <p className="text-xl font-bold text-slate-800 dark:text-slate-200">
                                Biz, bu soruların cevabını <span className="text-primary">"tahminlere"</span> değil, veriye ve yapay zekaya dayandırıyoruz.
                            </p>
                        </div>
                    </div>
                </section>

                {/* UVA Farkı: NAT */}
                <section className="py-32 px-6 bg-primary/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="flex-1">
                                <div className="inline-block px-4 py-2 rounded-xl bg-primary text-white text-xs font-black uppercase tracking-widest mb-6">
                                    UVA FARKI
                                </div>
                                <h2 className="text-5xl font-black leading-tight mb-8">Nokta Atışı Tespit <span className="text-primary">(N.A.T.)</span></h2>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
                                    Tıpkı bir doktorun tahlil sonuçlarına bakıp ilaç yazması gibi; sistemimiz de senin eksiklerini nokta atışıyla belirler ve sana özel, dinamik bir çalışma planı sunar.
                                </p>

                                <div className="space-y-6">
                                    {[
                                        { t: "Veriye Dayalı Program", d: "Ezbere değil, senin eksiklerine odaklı." },
                                        { t: "Dinamik Takip", d: "Sen geliştikçe programın da seninle birlikte evrilir." },
                                        { t: "Gerçekçi Öngörü", d: "\"Yetişiyor mu?\" göstergesiyle sınav gününe ne kadar hazır olduğunu saniyelik hesaplar." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                                            <div className="text-primary mt-1">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-black text-slate-900 dark:text-white">{item.t}</h4>
                                                <p className="text-sm text-slate-500">{item.d}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="aspect-[4/5] rounded-[2.5rem] bg-blue-500 overflow-hidden shadow-2xl">
                                        <img src="https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover grayscale" alt="" />
                                    </div>
                                    <div className="aspect-square rounded-[2.5rem] bg-primary overflow-hidden shadow-2xl p-8 flex items-end">
                                        <Zap size={48} className="text-white" fill="currentColor" />
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="aspect-square rounded-[2.5rem] bg-slate-900 overflow-hidden shadow-2xl p-10 flex items-center justify-center text-white text-center">
                                        <span className="text-3xl font-black tracking-tighter uppercase">N.A.T. AI</span>
                                    </div>
                                    <div className="aspect-[4/5] rounded-[2.5rem] bg-slate-200 overflow-hidden shadow-2xl">
                                        <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800" className="w-full h-full object-cover" alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Vizyonumuz */}
                <section className="py-32 px-6">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="size-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-10 text-primary">
                            <Globe size={32} />
                        </div>
                        <h2 className="text-4xl font-black mb-8">Vizyonumuz</h2>
                        <p className="text-2xl font-medium text-slate-600 dark:text-slate-400 leading-relaxed italic">
                            "Eğitimde fırsat eşitliğini teknolojiyle sağlamak. Her öğrencinin, en pahalı özel derslere veya koçluk sistemlerine ihtiyaç duymadan, cebinde dünyanın en zeki Dijital Mentorunu taşımasını istiyoruz."
                        </p>
                    </div>
                </section>

                {/* CTA Footer */}
                <section className="py-24 px-6 mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="max-w-5xl mx-auto p-12 md:p-20 rounded-[4rem] bg-slate-900 text-white text-center relative overflow-hidden shadow-3xl"
                    >
                        <div className="absolute top-[-50%] left-[-20%] w-[80%] h-[80%] bg-primary/20 rounded-full blur-[120px]"></div>

                        <div className="relative z-10">
                            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-tight">
                                UVA Mentor ile sadece ders çalışmazsın; <br />
                                <span className="text-primary italic">hedefine giden en kısa yolu yürürsün.</span>
                            </h2>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <button
                                    onClick={() => onNavigate('register')}
                                    className="w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-[2rem] font-black text-lg hover:scale-105 transition-all shadow-2xl shadow-primary/40"
                                >
                                    Şimdi Ücretsiz Başla
                                </button>
                                <button
                                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                    className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-[2rem] font-black text-lg hover:bg-white/10 transition-all"
                                >
                                    Sayfanın Başına Dön
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </section>

                <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                        © 2026 UVA MENTOR • HER HAKKI SAKLIDIR.
                    </p>
                </footer>
            </main>
        </div>
    );
}
