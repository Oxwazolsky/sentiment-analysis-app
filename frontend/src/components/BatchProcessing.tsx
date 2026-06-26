"use client";

import { useState, useCallback } from "react";
import { UploadCloud, FileText, Loader2, AlertCircle, Sparkles } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function BatchProcessing({ onResult }: { onResult: (data: any) => void }) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
      } else {
        setError("Format tidak didukung. Harap unggah file .csv");
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await axios.post(`${API_URL}/api/predict/batch`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      onResult(res.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal memproses file CSV. Pastikan formatnya benar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 flex flex-col h-full relative overflow-hidden shadow-2xl">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-fuchsia-600/10 rounded-full blur-[80px] -z-10 -translate-x-1/2 translate-y-1/2"></div>

      <div className="flex items-center gap-3 mb-2">
        <div className="p-2 bg-fuchsia-500/20 rounded-xl">
          <UploadCloud className="text-fuchsia-400 w-5 h-5" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-white">Batch Analytics</h2>
      </div>
      <p className="text-zinc-400 mb-8 text-sm">
        Unggah file dataset (.csv) berisi ratusan ulasan Play Store untuk dianalisis sekaligus.
      </p>

      <div 
        className={`flex-grow border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-8 transition-all duration-300 relative overflow-hidden group ${
          dragActive ? "border-fuchsia-500 bg-fuchsia-500/10 scale-[1.02]" : "border-zinc-700 hover:border-zinc-500 bg-black/40"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <input 
          type="file" 
          accept=".csv" 
          onChange={handleChange} 
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        />
        
        {file ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center z-10"
          >
            <div className="w-16 h-16 bg-fuchsia-500/20 rounded-full flex items-center justify-center mb-4">
              <FileText className="w-8 h-8 text-fuchsia-400" />
            </div>
            <p className="text-white font-bold text-lg mb-1">{file.name}</p>
            <p className="text-sm text-zinc-400 font-mono">{(file.size / 1024).toFixed(2)} KB</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center text-center z-10">
            <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-xl border border-white/5">
              <UploadCloud className="w-8 h-8 text-zinc-400 group-hover:text-fuchsia-400 transition-colors" />
            </div>
            <p className="text-white font-semibold text-lg mb-2">Tarik & Letakkan File CSV</p>
            <p className="text-sm text-zinc-500 max-w-[200px]">Atau klik area ini untuk mencari file di komputer Anda.</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400"
          >
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm font-medium">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={handleUpload}
        disabled={loading || !file}
        className="mt-6 relative overflow-hidden bg-white text-black hover:bg-zinc-200 font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
      >
        {loading ? (
          <Loader2 className="animate-spin w-5 h-5" />
        ) : (
          <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform text-fuchsia-600" />
        )}
        {loading ? "Menambang Data (Data Mining)..." : "Mulai Pemrosesan Massal"}
      </button>
    </div>
  );
}
