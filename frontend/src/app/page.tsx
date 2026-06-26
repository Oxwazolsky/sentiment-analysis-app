"use client";

import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Gamepad2, BrainCircuit, BarChart3, ArrowRight, Sparkles, MessageSquare, Zap, Database, Cpu, Layers, Activity } from "lucide-react";
import { useRef } from "react";

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div ref={containerRef} className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden">
      
      {/* Premium Background with Animated Grid */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      {/* Glowing Orbs */}
      <motion.div style={{ y: yBackground }} className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></motion.div>
      <motion.div style={{ y: yBackground }} className="absolute top-[40%] right-[-20%] w-[40vw] h-[40vw] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none"></motion.div>

      {/* Navbar */}
      <nav className="fixed top-0 w-full px-6 md:px-12 py-4 flex items-center justify-between z-50 bg-[#050505]/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)]">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">ReviewMind<span className="text-indigo-400">.ai</span></span>
        </div>
        <div>
          <Link href="/dashboard" className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/10 text-sm font-medium transition-all hover:scale-105 active:scale-95">
            Launch Dashboard
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <main className="relative z-10 pt-32 pb-20 px-6 md:px-12 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 min-h-[90vh]">
        
        {/* Left: Typography & CTA */}
        <div className="flex-1 text-left">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Tugas Akhir Data Mining 2026</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tighter mb-6 leading-[1.1]"
          >
            Kecerdasan Buatan <br /> untuk Analisis <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-fuchsia-400">
              Ulasan Game.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-400 mb-10 max-w-xl leading-relaxed"
          >
            Sistem prediksi rating bintang dan klasifikasi sentimen otomatis yang ditenagai oleh arsitektur <strong className="text-zinc-200">Long Short-Term Memory (LSTM)</strong> untuk mengungkap wawasan tersembunyi dari ribuan ulasan pemain.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Link 
              href="/dashboard"
              className="group relative px-8 py-4 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-fuchsia-100 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <span className="relative z-10 flex items-center gap-2">
                Mulai Analisis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Link>
          </motion.div>
        </div>

        {/* Right: Floating 3D/Interactive Infographic */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="flex-1 w-full max-w-lg relative perspective-1000"
        >
          {/* Main Visual Container */}
          <div className="relative w-full aspect-square bg-gradient-to-br from-zinc-900 to-black rounded-3xl border border-white/10 shadow-2xl p-6 overflow-hidden flex flex-col justify-between transform-gpu rotate-y-[-5deg] rotate-x-[5deg] hover:rotate-y-0 hover:rotate-x-0 transition-transform duration-700">
            {/* Top decorative bar */}
            <div className="flex justify-between items-center border-b border-white/5 pb-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="text-xs text-zinc-500 font-mono">LSTM_INFERENCE_NODE</div>
            </div>

            {/* Simulated Live Processing Animation */}
            <div className="flex-1 flex flex-col justify-center gap-6 relative">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                className="bg-zinc-800/50 border border-zinc-700 p-4 rounded-xl backdrop-blur-sm"
              >
                <p className="text-xs text-zinc-400 mb-1">Input Text</p>
                <p className="text-sm font-medium">"Game selalu crash pas mau gacha, rugi!"</p>
              </motion.div>

              <div className="flex justify-center -my-2 relative z-10">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-2 border-dashed border-indigo-500 flex items-center justify-center bg-black"
                >
                  <Database className="w-4 h-4 text-indigo-400" />
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 2, repeat: Infinity, repeatType: "reverse", repeatDelay: 3 }}
                className="bg-gradient-to-r from-red-500/20 to-orange-500/20 border border-red-500/30 p-4 rounded-xl flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-red-300 mb-1">Output Prediksi</p>
                  <p className="text-lg font-bold text-red-400">1 Bintang (Negatif)</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-zinc-400 mb-1">Confidence</p>
                  <p className="text-lg font-mono text-white">98.4%</p>
                </div>
              </motion.div>
            </div>
            
            {/* Decorative background grid inside the visual */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none -z-10"></div>
          </div>
          
          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [-10, 10, -10] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-6 bg-zinc-900 border border-white/10 p-3 rounded-2xl shadow-xl backdrop-blur-xl flex items-center gap-3"
          >
            <div className="bg-indigo-500/20 p-2 rounded-lg"><Cpu className="w-5 h-5 text-indigo-400" /></div>
            <div>
              <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Arsitektur</p>
              <p className="text-sm font-semibold text-white">LSTM Neural Net</p>
            </div>
          </motion.div>
        </motion.div>

      </main>

      {/* QUICK STATS INFOGRAPHIC */}
      <section className="relative z-10 border-y border-white/5 bg-zinc-950/50 py-10">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-white/5">
          {[
            { value: "92%+", label: "Akurasi Prediksi" },
            { value: "< 0.5s", label: "Waktu Inferensi" },
            { value: "10k+", label: "Kapasitas Batch CSV" },
            { value: "3 Class", label: "Kategori Sentimen" },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center px-4"
            >
              <p className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500 mb-2">{stat.value}</p>
              <p className="text-sm text-zinc-400 font-medium tracking-wide uppercase">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS INFOGRAPHIC */}
      <section className="py-32 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Alur Kerja Sistem <span className="text-indigo-400">Data Mining</span></h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">Bagaimana teks mentah dari ulasan game diproses hingga menjadi wawasan analitik yang berharga bagi developer.</p>
          </div>

          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              {[
                { icon: <Database />, title: "Data Collection", desc: "Mengumpulkan data mentah berupa CSV dari hasil scraping ulasan Google Play Store." },
                { icon: <Layers />, title: "Preprocessing", desc: "Membersihkan teks (Stopword removal, Stemming) agar model dapat memahami konteks dasar kata." },
                { icon: <BrainCircuit />, title: "LSTM Processing", desc: "Memasukkan sekuens kata ke dalam model Deep Learning untuk mengekstraksi makna temporal." },
                { icon: <Activity />, title: "Dashboard Insights", desc: "Menghasilkan klasifikasi rating (1-5 Bintang), label sentimen, dan visualisasi distribusi sentimen." }
              ].map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 group-hover:border-indigo-500/50 group-hover:shadow-indigo-500/20 transition-all duration-300 relative">
                    <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-indigo-400 group-hover:text-indigo-300 transition-colors w-8 h-8 flex items-center justify-center">
                      {step.icon}
                    </span>
                    {/* Step number badge */}
                    <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                      0{i+1}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-zinc-200">{step.title}</h3>
                  <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 relative z-10">
        <div className="max-w-5xl mx-auto bg-gradient-to-br from-indigo-900/40 to-fuchsia-900/40 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Siap Menganalisis Data Anda?</h2>
            <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
              Langsung tuju ke dashboard untuk menguji model dengan kalimat ulasan Anda sendiri atau unggah dataset CSV untuk Batch Processing.
            </p>
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 px-10 py-5 bg-white text-black font-bold rounded-full overflow-hidden transition-all hover:scale-105 shadow-2xl text-lg"
            >
              Buka Dashboard Analitik <Zap className="w-5 h-5 text-yellow-500" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-white/5 bg-black z-10 relative">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 opacity-50 hover:opacity-100 transition-opacity">
            <Gamepad2 className="w-5 h-5" />
            <span className="font-bold tracking-tight">ReviewMind.ai</span>
          </div>
          <p className="text-zinc-600 text-sm">
            &copy; {new Date().getFullYear()} - Implementasi Sistem Prediksi Rating Bintang (Data Mining)
          </p>
        </div>
      </footer>
    </div>
  );
}

