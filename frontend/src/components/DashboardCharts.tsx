"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { Star, MessageSquareText, Target, Activity, Hash, Database, BarChart3, Percent, ThumbsUp, ThumbsDown } from "lucide-react";

const COLORS = {
  Positif: "#4ade80", // green-400
  Netral: "#facc15",  // yellow-400
  Negatif: "#f87171"  // red-400
};

export default function DashboardCharts({ data }: { data: any }) {
  const [activeWordCloud, setActiveWordCloud] = useState<'Negatif' | 'Positif'>('Negatif');

  if (!data) return null;

  const { average_rating, sentiment_distribution, word_cloud_negative, word_cloud_positive, results } = data;
  const totalReviews = results.length;
  const majoritySentiment = sentiment_distribution.reduce((prev: any, current: any) => (prev.value > current.value) ? prev : current).name;

  // Kalkulasi Distribusi Rating Bintang
  const ratingData = [1, 2, 3, 4, 5].map(star => ({
    name: `${star} Bintang`,
    count: results.filter((r: any) => r.rating === star).length,
    fill: star >= 4 ? '#4ade80' : star <= 2 ? '#f87171' : '#facc15'
  }));

  // Kalkulasi Rata-rata Confidence Score per Sentimen
  const confidenceData = [
    { name: 'Positif', fill: '#4ade80' },
    { name: 'Netral', fill: '#facc15' },
    { name: 'Negatif', fill: '#f87171' }
  ].map(cat => {
    const subset = results.filter((r: any) => r.sentiment === cat.name);
    const avgConf = subset.length > 0 ? subset.reduce((acc: number, val: any) => acc + val.confidence, 0) / subset.length : 0;
    return { ...cat, avg: parseFloat(avgConf.toFixed(2)) };
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col gap-8 w-full"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
        <h2 className="text-2xl font-bold tracking-widest uppercase text-zinc-400">Hasil Analitik</h2>
        <div className="h-[1px] flex-grow bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      </div>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => {
            const csvRows = [];
            const headers = ["Teks Asli", "Teks Preprocessing", "Sentimen", "Confidence (%)", "Estimasi Rating"];
            csvRows.push(headers.join(","));
            
            results.forEach((r: any) => {
              const text = `"${r.original_text?.replace(/"/g, '""')}"`;
              const cleanText = `"${r.preprocessed_text?.replace(/"/g, '""')}"`;
              csvRows.push([text, cleanText, r.sentiment, r.confidence, r.rating].join(","));
            });
            
            const csvString = csvRows.join("\n");
            const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.setAttribute("href", url);
            link.setAttribute("download", "hasil_prediksi_sentimen.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }}
          className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white font-semibold py-2 px-6 rounded-full flex items-center gap-2 transition-colors border border-fuchsia-400/50 shadow-[0_0_15px_rgba(192,38,211,0.3)]"
        >
          <Database className="w-4 h-4" /> Download Data Prediksi (.csv)
        </button>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-[50px] -z-10 group-hover:bg-blue-500/20 transition-colors"></div>
          <Hash className="w-6 h-6 text-blue-400 mb-3" />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Total Ulasan</p>
          <p className="text-4xl font-black text-white">{totalReviews}</p>
        </div>
        
        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-[50px] -z-10 group-hover:bg-yellow-500/20 transition-colors"></div>
          <Star className="w-6 h-6 text-yellow-500 mb-3" />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Estimasi Rating</p>
          <div className="flex items-end gap-2">
            <p className="text-4xl font-black text-white">{average_rating}</p>
            <span className="text-zinc-500 font-medium mb-1">/ 5.0</span>
          </div>
        </div>

        <div className="bg-zinc-900/40 backdrop-blur-xl p-6 rounded-3xl border border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -z-10 group-hover:bg-green-500/20 transition-colors"></div>
          <Target className="w-6 h-6 text-green-400 mb-3" />
          <p className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">Sentimen Mayoritas</p>
          <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400">
            {majoritySentiment}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pie Chart: Sentiment Distribution */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-indigo-500/10 rounded-full blur-[60px] -z-10"></div>
          
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <Activity className="text-indigo-400 w-5 h-5" /> Distribusi Sentimen
          </h3>
          <div className="h-[300px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sentiment_distribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  cornerRadius={8}
                >
                  {sentiment_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)' }}
                  itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Text inside Donut */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <p className="text-3xl font-black text-white">{totalReviews}</p>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">Data</p>
            </div>
          </div>
          <div className="flex justify-center gap-8 mt-6">
            {sentiment_distribution.map((entry: any) => (
              <div key={entry.name} className="flex flex-col items-center gap-2">
                <div className="w-4 h-4 rounded-full shadow-inner" style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}></div>
                <div className="text-center">
                  <span className="block text-sm font-bold text-white">{entry.name}</span>
                  <span className="block text-xs text-zinc-500">{entry.value} ulasan</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Word Cloud */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden flex flex-col">
          <div className={`absolute top-[-50px] right-[-50px] w-40 h-40 rounded-full blur-[60px] -z-10 ${activeWordCloud === 'Negatif' ? 'bg-red-500/10' : 'bg-green-500/10'}`}></div>
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h3 className="text-lg font-bold flex items-center gap-3">
              <MessageSquareText className={`${activeWordCloud === 'Negatif' ? 'text-red-400' : 'text-green-400'} w-5 h-5`} /> 
              Fokus Kata Kunci
            </h3>
            
            {/* Toggle Word Cloud */}
            <div className="flex items-center bg-black/40 rounded-full p-1 border border-white/5">
              <button 
                onClick={() => setActiveWordCloud('Negatif')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${activeWordCloud === 'Negatif' ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(248,113,113,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ThumbsDown className="w-3.5 h-3.5" /> Negatif
              </button>
              <button 
                onClick={() => setActiveWordCloud('Positif')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${activeWordCloud === 'Positif' ? 'bg-green-500/20 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.2)]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                <ThumbsUp className="w-3.5 h-3.5" /> Positif
              </button>
            </div>
          </div>

          <div className="flex-grow w-full bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center p-4">
            {(() => {
              const activeData = activeWordCloud === 'Negatif' ? word_cloud_negative : word_cloud_positive;
              const textColor = activeWordCloud === 'Negatif' ? 'text-red-400' : 'text-green-400';
              const hoverColor = activeWordCloud === 'Negatif' ? 'hover:text-red-300' : 'hover:text-green-300';
              
              if (activeData && activeData.length > 0) {
                return (
                  <div className="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 h-full overflow-y-auto custom-scrollbar content-center">
                    {activeData.map((w: any, i: number) => {
                      const maxVal = Math.max(...activeData.map((x: any) => x.value));
                      const minVal = Math.min(...activeData.map((x: any) => x.value));
                      const fontSize = minVal === maxVal ? 24 : 14 + ((w.value - minVal) / (maxVal - minVal)) * 30;
                      const opacity = minVal === maxVal ? 1 : 0.4 + ((w.value - minVal) / (maxVal - minVal)) * 0.6;
                      
                      return (
                        <span 
                          key={i} 
                          className={`${textColor} font-bold tracking-wide transition-all duration-300 hover:scale-125 ${hoverColor} hover:opacity-100 cursor-crosshair hover:z-10`}
                          style={{ fontSize: `${fontSize}px`, opacity }}
                          title={`${w.text}: Muncul ${w.value} kali`}
                        >
                          {w.text}
                        </span>
                      );
                    })}
                  </div>
                );
              }
              return <p className="text-zinc-600 font-medium">Kata kunci {activeWordCloud.toLowerCase()} tidak cukup untuk divisualisasikan.</p>;
            })()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Rating Distribution Bar Chart */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute bottom-[-50px] left-[-50px] w-40 h-40 bg-yellow-500/10 rounded-full blur-[60px] -z-10"></div>
          
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <BarChart3 className="text-yellow-500 w-5 h-5" /> Distribusi Rating Bintang
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ratingData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.3)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {ratingData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Confidence Score Distribution */}
        <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl relative overflow-hidden">
          <div className="absolute bottom-[-50px] right-[-50px] w-40 h-40 bg-green-500/10 rounded-full blur-[60px] -z-10"></div>
          
          <h3 className="text-lg font-bold mb-8 flex items-center gap-3">
            <Percent className="text-green-400 w-5 h-5" /> Rata-Rata Confidence Score Model
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={confidenceData} layout="vertical" margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.3)" fontSize={12} tickMargin={10} axisLine={false} tickLine={false} unit="%" />
                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" fontSize={13} fontWeight="bold" axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                  contentStyle={{ backgroundColor: 'rgba(9, 9, 11, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff' }}
                  formatter={(value: any) => [`${value}%`, 'Confidence']}
                />
                <Bar dataKey="avg" radius={[0, 6, 6, 0]} barSize={40}>
                  {confidenceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-zinc-900/40 backdrop-blur-xl p-8 rounded-3xl border border-white/5 shadow-xl overflow-hidden flex flex-col relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
        
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold flex items-center gap-3">
            <Database className="text-indigo-400 w-5 h-5" /> Log Prediksi Model
          </h3>
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 text-xs text-zinc-400">
            Menampilkan {Math.min(results.length, 50)} dari {results.length} data
          </div>
        </div>
        
        <div className="overflow-x-auto overflow-y-auto max-h-[500px] custom-scrollbar pr-2 rounded-xl border border-white/5">
          <table className="w-full text-left text-sm border-collapse">
            <thead className="text-xs text-zinc-500 uppercase bg-black/80 sticky top-0 z-10 backdrop-blur-md">
              <tr>
                <th className="px-6 py-5 font-bold tracking-wider rounded-tl-xl border-b border-white/10">Ulasan Asli</th>
                <th className="px-6 py-5 font-bold tracking-wider border-b border-white/10 hidden md:table-cell">Teks Preprocessing</th>
                <th className="px-6 py-5 font-bold tracking-wider text-center border-b border-white/10">Rating</th>
                <th className="px-6 py-5 font-bold tracking-wider text-center rounded-tr-xl border-b border-white/10">Sentimen</th>
              </tr>
            </thead>
            <tbody className="bg-black/20 divide-y divide-white/5">
              {results.slice(0, 50).map((row: any, i: number) => (
                <tr key={i} className="hover:bg-indigo-500/10 transition-colors group">
                  <td className="px-6 py-4 max-w-[200px] md:max-w-xs text-zinc-300">
                    <p className="truncate group-hover:whitespace-normal group-hover:break-words transition-all duration-300">{row.original_text}</p>
                  </td>
                  <td className="px-6 py-4 max-w-[200px] md:max-w-xs text-zinc-500 font-mono text-xs hidden md:table-cell">
                    <p className="truncate">{row.preprocessed_text}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center gap-1.5 bg-zinc-800/80 px-3 py-1.5 rounded-full border border-white/5">
                      <span className="font-bold text-white">{row.rating}</span>
                      <Star className={`w-3.5 h-3.5 ${
                        row.rating >= 4 ? "text-green-400 fill-current" : 
                        row.rating <= 2 ? "text-red-400 fill-current" : "text-yellow-400 fill-current"
                      }`} />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center justify-center px-3 py-1.5 rounded-full text-xs font-bold tracking-wide border ${
                      row.sentiment === 'Positif' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      row.sentiment === 'Negatif' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                    }`}>
                      {row.sentiment}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </motion.div>
  );
}
