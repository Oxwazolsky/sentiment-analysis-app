"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Target, BarChart4, PieChart, Activity } from "lucide-react";

export default function ModelMetrics({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        ></motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="relative p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-fuchsia-500 to-indigo-500"></div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-fuchsia-500/20 rounded-lg">
                <Target className="w-5 h-5 text-fuchsia-400" />
              </div>
              <h2 className="text-xl font-bold text-white">Validasi Metrik Model LSTM</h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-8">
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Model Long Short-Term Memory (LSTM) telah dilatih menggunakan ribuan data ulasan game. Berikut adalah hasil evaluasi performa klasifikasi sentimen pada data uji (Test Set).
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {/* Accuracy */}
              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                <PieChart className="w-6 h-6 text-emerald-400 mb-2" />
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Akurasi</p>
                <p className="text-2xl font-black text-white">88.5%</p>
              </div>
              
              {/* Precision */}
              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                <Target className="w-6 h-6 text-blue-400 mb-2" />
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Presisi</p>
                <p className="text-2xl font-black text-white">85.2%</p>
              </div>

              {/* Recall */}
              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                <Activity className="w-6 h-6 text-fuchsia-400 mb-2" />
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Recall</p>
                <p className="text-2xl font-black text-white">87.1%</p>
              </div>

              {/* F1 Score */}
              <div className="bg-zinc-900 border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                <BarChart4 className="w-6 h-6 text-amber-400 mb-2" />
                <p className="text-zinc-500 text-xs font-bold uppercase mb-1">F1-Score</p>
                <p className="text-2xl font-black text-white">86.1%</p>
              </div>
            </div>

            {/* Confusion Matrix Illustration */}
            <div className="bg-zinc-900 border border-white/5 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-zinc-300 mb-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-fuchsia-500"></div> Parameter Arsitektur AI
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Arsitektur</span>
                  <span className="text-zinc-300 font-mono">LSTM (RNN)</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Epochs</span>
                  <span className="text-zinc-300 font-mono">10</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Batch Size</span>
                  <span className="text-zinc-300 font-mono">64</span>
                </div>
                <div className="flex justify-between border-b border-white/5 pb-2">
                  <span className="text-zinc-500">Loss Function</span>
                  <span className="text-zinc-300 font-mono">Categorical Crossentropy</span>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-white text-black font-semibold rounded-lg hover:bg-zinc-200 transition-colors"
              >
                Tutup Panel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
