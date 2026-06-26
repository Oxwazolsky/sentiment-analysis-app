"use client";

import { useState } from "react";
import SingleReview from "@/components/SingleReview";
import BatchProcessing from "@/components/BatchProcessing";
import DashboardCharts from "@/components/DashboardCharts";
import { LayoutDashboard, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [batchData, setBatchData] = useState<any>(null);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-indigo-500/30 relative overflow-hidden pb-20">
      
      {/* Premium Background with Animated Grid */}
      <div className="fixed inset-0 z-0 opacity-[0.15] pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>
      
      {/* Glowing Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <main className="relative z-10 p-6 md:p-12 lg:px-24 max-w-[1600px] mx-auto">
        {/* Navigation */}
        <nav className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-all text-sm font-medium">
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Home</span>
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12 flex flex-col items-start border-b border-white/5 pb-8">
          <motion.h1 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl md:text-5xl font-black tracking-tight mb-3 flex items-center gap-4"
          >
            <div className="p-3 bg-gradient-to-br from-indigo-500/20 to-fuchsia-500/20 rounded-2xl border border-indigo-500/30">
              <LayoutDashboard className="text-indigo-400 w-8 h-8" />
            </div>
            Workspace Analitik
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-zinc-400 text-lg max-w-2xl ml-1"
          >
            Dashboard utama untuk pengujian model LSTM secara individual maupun pemrosesan data massal via file CSV.
          </motion.p>
        </header>

        {/* Main Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <div className="h-full">
            <SingleReview />
          </div>
          <div className="h-full">
            <BatchProcessing onResult={(data) => setBatchData(data)} />
          </div>
        </motion.div>

        {/* Batch Analytics Result */}
        <div className="mt-12">
          {batchData && <DashboardCharts data={batchData} />}
        </div>
      </main>
    </div>
  );
}
