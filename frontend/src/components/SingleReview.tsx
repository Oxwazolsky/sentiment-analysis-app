"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Star, AlertCircle, CheckCircle2, Loader2, Sparkles } from "lucide-react";
import axios from "axios";

export default function SingleReview() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.post(`${API_URL}/api/predict/single`, { text });
      setResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Terjadi kesalahan saat memprediksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 flex flex-col h-full relative overflow-hidden shadow-2xl">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-[80px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-indigo-500/20 rounded-xl">
          <Star className="text-indigo-400 w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Single Review Test</h2>
      </div>
      <p className="text-zinc-400 mb-8 text-sm">
        Ketik ulasan secara manual untuk melihat prediksi instan model LSTM.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-grow">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-2xl blur opacity-0 group-hover:opacity-20 transition duration-500 group-focus-within:opacity-40"></div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Cth: habis update tambah gak masuk akal, masa pas match tiba² keluar sendiri."
            className="relative w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-zinc-200 placeholder:text-zinc-600 focus:outline-none transition-all resize-none h-36 font-medium leading-relaxed"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading || !text.trim()}
          className="relative overflow-hidden bg-white text-black hover:bg-zinc-200 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <Loader2 className="animate-spin w-5 h-5" />
          ) : (
            <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform text-indigo-600" />
          )}
          {loading ? "Menjalankan Model LSTM..." : "Proses Analisis"}
        </button>
      </form>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-black/40 rounded-2xl border border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-fuchsia-500"></div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Hasil Ekstraksi Fitur</span>
              <div className="flex gap-1 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-6 h-6 ${i < result.rating ? "fill-current" : "text-zinc-800"}`} />
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/5 flex flex-col justify-center">
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-semibold">Sentimen</p>
                <div className="flex items-center gap-2">
                  {result.sentiment === "Positif" && <CheckCircle2 className="w-5 h-5 text-green-400" />}
                  {result.sentiment === "Negatif" && <AlertCircle className="w-5 h-5 text-red-400" />}
                  <span className={`text-xl font-bold ${
                    result.sentiment === "Positif" ? "text-green-400" :
                    result.sentiment === "Negatif" ? "text-red-400" : "text-yellow-400"
                  }`}>
                    {result.sentiment}
                  </span>
                </div>
              </div>
              
              <div className="bg-zinc-900/80 p-4 rounded-xl border border-white/5 flex flex-col justify-center relative overflow-hidden">
                <div 
                  className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-1000" 
                  style={{ width: `${result.confidence}%` }}
                ></div>
                <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-semibold">Confidence Score</p>
                <p className="text-2xl font-bold text-white font-mono">{result.confidence}%</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-zinc-500 mb-2 uppercase tracking-wide font-semibold">Teks Preprocessing</p>
              <p className="text-sm bg-black/60 p-4 rounded-xl border border-white/5 text-zinc-300 font-mono">
                {result.preprocessed_text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
