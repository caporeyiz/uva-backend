/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Sparkles,
  Rocket,
  Calendar as CalendarIcon,
  Brain,
  LineChart,
  Send,
  LayoutDashboard,
  Menu,
  X,
  ArrowRight,
  User,
  Bot
} from 'lucide-react';

interface LandingPageProps {
  onLogin: () => void;
  onRegister: () => void;
}

export default function LandingPage() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 overflow-x-hidden">
      <div className="layout-container flex h-full grow flex-col">
        {/* Header */}
        <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-3">
            <img src="/uva-logo.png" alt="UVA Logo" className="h-10 w-auto" />
            <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight tracking-tight">UVA-AI Mentor</h2>
          </div>

          <nav className="hidden md:flex flex-1 justify-center gap-8">
            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#ozellikler">Özellikler</a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#fiyatlar">Fiyatlandırma</a>
            <a className="text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary text-sm font-medium transition-colors" href="#hakkimizda">Hakkımızda</a>
          </nav>

          <div className="flex gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold transition-all hover:bg-slate-300 dark:hover:bg-slate-700"
            >
              <span>Giriş Yap</span>
            </button>
            <button
              onClick={() => navigate('/register')}
              className="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all"
            >
              <span>Ücretsiz Başla</span>
            </button>
            <button
              className="md:hidden text-slate-600 dark:text-slate-400"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </header>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden fixed inset-0 top-[73px] bg-white dark:bg-slate-900 z-40 p-6 flex flex-col gap-6"
          >
            <a className="text-lg font-medium" href="#ozellikler" onClick={() => setIsMenuOpen(false)}>Özellikler</a>
            <a className="text-lg font-medium" href="#fiyatlar" onClick={() => setIsMenuOpen(false)}>Fiyatlandırma</a>
            <a className="text-lg font-medium" href="#hakkimizda" onClick={() => setIsMenuOpen(false)}>Hakkımızda</a>
            <hr className="border-slate-200 dark:border-slate-800" />
            <div className="flex flex-col gap-3">
              <button onClick={() => navigate('/login')} className="w-full py-4 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold rounded-xl">Giriş Yap</button>
              <button onClick={() => navigate('/register')} className="w-full py-4 bg-primary text-white font-bold rounded-xl">Ücretsiz Başla</button>
            </div>
          </motion.div>
        )}

        <main className="flex flex-col flex-1">
          {/* Hero Section */}
          <section className="px-6 md:px-20 py-12 md:py-24">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col gap-12 lg:flex-row items-center">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex flex-col gap-8 lg:w-1/2"
                >
                  <div className="flex flex-col gap-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit uppercase tracking-wider">
                      <Rocket size={14} />
                      Yeni Nesil Sınav Hazırlığı
                    </div>
                    <h1 className="text-slate-900 dark:text-slate-100 text-4xl md:text-6xl font-extrabold leading-[1.1] tracking-tight">
                      AI Destekli YKS Maratonunda <span className="text-primary">Yanındayız</span>
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-[540px]">
                      Sana özel hazırlanan çalışma planları ve 7/24 yanındaki yapay zeka mentörünle sınavda başarıyı yakala.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={() => navigate('/register')}
                      className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all"
                    >
                      Hemen Ücretsiz Başla
                    </button>
                    <button className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 border-2 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 text-lg font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                      Nasıl Çalışır?
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <img
                          key={i}
                          className="w-8 h-8 rounded-full border-2 border-background-light"
                          src={`https://picsum.photos/seed/student${i}/100/100`}
                          referrerPolicy="no-referrer"
                          alt={`Student ${i}`}
                        />
                      ))}
                    </div>
                    <span>+10.000 öğrenci aramıza katıldı</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="w-full lg:w-1/2 relative"
                >
                  <div className="absolute -top-10 -right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
                  <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-blue-400/20 rounded-full blur-3xl -z-10"></div>
                  <div className="rounded-2xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="h-8 bg-slate-100 dark:bg-slate-800 flex items-center px-4 gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                    <img
                      className="w-full h-auto object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOyHSYjEyniuZucSnyOXseOlK6v7MVZVO60Xy1faPF70yvuEH0-rn2U1Esy5bfVbVwE2Oau5Ici4hb4Ya0uSmPqu7kiFqqRVEiXRugxJs2WrR-WDrCtu0yN7EabzgsVgl1HUzgDgt_obl64mNhvNBEf5mpxtBYJQ_bNSZNMo2tM_6PpkRbsawyV76BbAqzkblMHafFpADwatkFJBVHzFIsoZYEO5J0oSgO7C1FpySjF1esX2jKPW1j4nojJDT1RsRx0lBkYmN1SjOl"
                      referrerPolicy="no-referrer"
                      alt="Dashboard Preview"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="px-6 md:px-20 py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border-y border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto flex flex-wrap justify-around gap-8">
              {[
                { label: "Aktif Öğrenci", value: "10.000+" },
                { label: "Çözülen Soru", value: "1M+" },
                { label: "Başarı Artışı", value: "%40+" },
                { label: "Kesintisiz Destek", value: "7/24" }
              ].map((stat, i) => (
                <div key={i} className="flex flex-col items-center gap-1">
                  <span className="text-3xl font-extrabold text-primary">{stat.value}</span>
                  <span className="text-slate-500 font-medium">{stat.label}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Features Section */}
          <section className="px-6 md:px-20 py-24" id="ozellikler">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col items-center text-center gap-4 mb-16">
                <h2 className="text-primary font-bold tracking-widest uppercase text-sm">Neden Biz?</h2>
                <h3 className="text-slate-900 dark:text-slate-100 text-3xl md:text-5xl font-extrabold tracking-tight">Sınav Hazırlığında Yeni Nesil Çözümler</h3>
                <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl">YKS hazırlık sürecini daha verimli, planlı ve stressiz hale getiren yapay zeka destekli araçlarımızı keşfedin.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    icon: CalendarIcon,
                    title: "Kişiselleştirilmiş Çalışma Planı",
                    desc: "Eksiklerine, hedeflerine ve günlük rutinine göre her gün güncellenen dinamik ders programı ile zamanını en iyi şekilde yönet."
                  },
                  {
                    icon: Brain,
                    title: "Anlık AI Soru-Cevap",
                    desc: "Takıldığın her soruda, her branşta anında çözüm ve konu anlatımı desteği. Gece 03:00'te bile mentörün yanında."
                  },
                  {
                    icon: LineChart,
                    title: "Detaylı İlerleme Analitiği",
                    desc: "Hangi konuda ne kadar yol kat ettiğini, netlerindeki artışı ve odaklanman gereken zayıf noktalarını verilerle gör."
                  }
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    viewport={{ once: true }}
                    className="group p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:-translate-y-1"
                  >
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      <feature.icon size={30} />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{feature.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* AI Chat Section */}
          <section className="px-6 md:px-20 py-24 bg-slate-50 dark:bg-slate-800/20">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-col lg:flex-row items-center gap-16">
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full lg:w-1/2 order-2 lg:order-1"
                >
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-white">
                          <Sparkles size={18} />
                        </div>
                        <span className="font-bold">UVA-AI Mentor</span>
                      </div>
                      <div className="flex gap-2">
                        <div className="size-2 rounded-full bg-green-500"></div>
                        <div className="size-2 rounded-full bg-slate-200 dark:bg-slate-700"></div>
                      </div>
                    </div>
                    <div className="p-6 space-y-6">
                      <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Bot size={16} />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-sm">
                          Merhaba! Bugün fizik dünyasına dalmaya hazır mısın?
                        </div>
                      </div>
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                          <User size={16} />
                        </div>
                        <div className="bg-primary text-white p-4 rounded-2xl rounded-tr-none text-sm">
                          Biraz motivasyona ihtiyacım var, fizik konuları bazen çok karmaşık geliyor.
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="size-8 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                          <Bot size={16} />
                        </div>
                        <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none text-sm">
                          Seni çok iyi anlıyorum. Fizik, evrenin en derin sırlarını çözmeye çalışırken bazen beynimizi zorlayabilir.
                        </div>
                      </div>
                    </div>
                    <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                      <div className="flex gap-2">
                        <div className="flex-1 h-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 text-xs flex items-center text-slate-400">
                          Mesajını yaz...
                        </div>
                        <div className="size-10 bg-primary rounded-lg flex items-center justify-center text-white">
                          <Send size={18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="w-full lg:w-1/2 order-1 lg:order-2 flex flex-col gap-6"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold w-fit uppercase tracking-wider">
                    <Sparkles size={14} />
                    7/24 Kesintisiz Destek
                  </div>
                  <h2 className="text-slate-900 dark:text-slate-100 text-3xl md:text-5xl font-extrabold tracking-tight">Kişisel AI Mentörünle Sohbet Et</h2>
                  <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                    Anlamadığın konuları sor, çözemediğin soruların fotoğrafını at veya sadece motivasyon için konuş. AI Mentörün her an seninle.
                  </p>
                  <ul className="space-y-4">
                    {[
                      "Her branşta uzman konu anlatımı",
                      "Fotoğraftan anlık soru çözümü",
                      "Sınav stresi ve motivasyon desteği",
                      "Kişiselleştirilmiş ders çalışma ipuçları"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                        <div className="size-5 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                        </div>
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <button
                      onClick={() => navigate('/register')}
                      className="bg-primary text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-primary/90 transition-all shadow-xl shadow-primary/20 flex items-center gap-2"
                    >
                      AI Sohbeti Dene
                      <ArrowRight size={20} />
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="px-6 md:px-20 py-24 bg-primary text-white overflow-hidden relative">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -ml-48 -mb-48"></div>
            <div className="max-w-5xl mx-auto text-center relative z-10">
              <h2 className="text-3xl md:text-5xl font-extrabold mb-8">Hayalindeki Üniversite İçin İlk Adımı At</h2>
              <p className="text-white/80 text-lg md:text-xl mb-12 max-w-2xl mx-auto">Binlerce öğrenci UVA-AI Mentor ile netlerini artırıyor. Sen de bu başarının bir parçası olmaya hazır mısın?</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate('/register')}
                  className="bg-white text-primary px-10 py-4 rounded-xl font-bold text-lg hover:bg-slate-100 transition-all shadow-xl"
                >
                  Ücretsiz Hesabını Oluştur
                </button>
                <button className="bg-primary border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all">
                  Daha Fazla Bilgi
                </button>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="px-6 md:px-20 py-16 bg-background-light dark:bg-background-dark border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 text-primary mb-6">
                <Sparkles size={24} className="font-bold" />
                <h2 className="text-slate-900 dark:text-slate-100 text-lg font-bold">UVA-AI Mentor</h2>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">Yapay zeka teknolojisini eğitimle birleştirerek öğrencilerin sınav yolculuğunda en büyük yardımcısı oluyoruz.</p>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Ürün</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Özellikler</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">AI Soru Çözücü</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Çalışma Planı</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Fiyatlandırma</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Şirket</h5>
              <ul className="space-y-4 text-sm text-slate-500">
                <li><a className="hover:text-primary transition-colors" href="#">Hakkımızda</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Blog</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">Kariyer</a></li>
                <li><a className="hover:text-primary transition-colors" href="#">İletişim</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold text-slate-900 dark:text-slate-100 mb-6">Bülten</h5>
              <p className="text-slate-500 text-sm mb-4">Yeni özellikler ve çalışma ipuçlarından haberdar olun.</p>
              <div className="flex gap-2">
                <input className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-primary focus:border-transparent outline-none" placeholder="E-posta adresi" type="email" />
                <button className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary/90 transition-all">
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
          <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-sm">© 2024 UVA-AI Mentor. Tüm hakları saklıdır.</p>
            <div className="flex gap-6 text-slate-400">
              <a className="hover:text-primary transition-all" href="#"><LayoutDashboard size={20} /></a>
              <a className="hover:text-primary transition-all" href="#"><Send size={20} /></a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
