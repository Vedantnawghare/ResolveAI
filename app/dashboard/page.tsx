"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { realMandiData } from "../data/realMandiData";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  CartesianGrid
} from "recharts";
import { Leaf, TrendingUp, CloudRain, ShieldCheck, MapPin, Box, ArrowRight } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import TiltCard from "../components/TiltCard";
import AnimatedCounter from "../components/AnimatedCounter";

interface ResultType {
  mandi: string;
  netProfit: number;
  harvestWindow: string;
  confidenceScore: number;
  rainfallTrend?: { time: string; rainfall: number }[];
}

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [formData, setFormData] = useState({
    crop: "",
    city: "",
    storageType: "",
  });
  const [result, setResult] = useState<ResultType[]>([]);

  useEffect(() => {
    const logged = localStorage.getItem("agriLoggedIn");
    if (!logged) router.replace("/login");
  }, [router]);

  const crops = [...new Set(realMandiData.map((d) => d.crop))];
  const cities = [...new Set(realMandiData.map((d) => d.mandi))];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = result.map((r) => ({
    mandi: r.mandi,
    profit: r.netProfit,
  }));

  const rainfallTrend = result[0]?.rainfallTrend || [];

  const t = {
    en: {
      predict: "Market Predictor",
      selectCrop: "Select your Crop",
      selectCity: "Nearest Market City",
      storage: "Storage Condition",
      analyze: "Generate Prediction",
      profit: "Max Expected Profit",
      summary: "AI Recommendation",
    },
    hi: {
      predict: "बाजार भविष्यवाणी",
      selectCrop: "अपनी फसल चुनें",
      selectCity: "निकटतम बाजार",
      storage: "भंडारण स्थिति",
      analyze: "भविष्यवाणी करें",
      profit: "अधिकतम संभावित लाभ",
      summary: "एआई सुझाव",
    },
    mr: {
      predict: "बाजार अंदाज",
      selectCrop: "तुमचे पीक निवडा",
      selectCity: "जवळचे मार्केट शहर",
      storage: "साठवणूक स्थिती",
      analyze: "अंदाज व्यत्क करा",
      profit: "कमाल अपेक्षित नफा",
      summary: "एआय शिफारस",
    },
  }[language] || {
    predict: "",
    selectCrop: "",
    selectCity: "",
    storage: "",
    analyze: "",
    profit: "",
    summary: "",
  };

  // Custom Recharts Tooltip with Glassmorphism
  const CustomTooltip = ({ active, payload, label }: { active?: boolean, payload?: any[], label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#111]/90 backdrop-blur-xl p-4 rounded-xl border border-white/20 shadow-2xl">
          <p className="text-gray-300 mb-1">{label}</p>
          <p className="text-lime-400 font-bold text-lg text-glow">
            ₹{payload[0].value.toLocaleString("en-IN")}
          </p>
        </div>
      );
    }
    return null;
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col md:flex-row relative">
      <Sidebar />
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 md:ml-[80px] p-4 md:p-8 lg:p-10 min-h-screen relative z-0">

        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 rounded-full blur-[180px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-lime-500/10 rounded-full blur-[180px] pointer-events-none" />

        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4 relative z-10"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 tracking-tight">
              Dashboard Analytics
            </h1>
            <p className="text-gray-400 mt-2 text-lg">Real-time agricultural market insights.</p>
          </div>

          <div className="bg-white/5 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 border border-white/10">
            <span className="text-sm text-gray-400 font-medium">Language:</span>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-transparent text-white font-bold outline-none cursor-pointer"
            >
              <option className="bg-black" value="en">English</option>
              <option className="bg-black" value="hi">हिंदी</option>
              <option className="bg-black" value="mr">मराठी</option>
            </select>
          </div>
        </motion.div>

        {/* Bento Box Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">

          {/* Predictor Form (Left Column) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-4"
          >
            <TiltCard intensity={25} className="h-full">
              <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] border border-white/10 h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
                {/* Interactive top line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-emerald-500 to-lime-400 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 bg-lime-400/10 rounded-xl text-lime-400">
                      <TrendingUp size={24} />
                    </div>
                    <h2 className="text-2xl font-bold text-white tracking-tight">{t.predict}</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="relative group/input block">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-lime-400 to-emerald-500 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur-sm transition-opacity duration-500" />
                      <div className="relative flex items-center bg-[#111] rounded-xl overflow-hidden">
                        <div className="pl-4 pr-3 flex items-center justify-center pointer-events-none">
                          <Leaf size={18} className="text-gray-500 group-focus-within/input:text-lime-400 transition-colors" />
                        </div>
                        <select
                          name="crop"
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent text-white p-4 pl-0 border-none outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="text-gray-500">{t.selectCrop}</option>
                          {crops.map((c, i) => <option className="bg-[#111] text-white" key={i} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="relative group/input block">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 to-lime-400 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur-sm transition-opacity duration-500" />
                      <div className="relative flex items-center bg-[#111] rounded-xl overflow-hidden">
                        <div className="pl-4 pr-3 flex items-center justify-center pointer-events-none">
                          <MapPin size={18} className="text-gray-500 group-focus-within/input:text-lime-400 transition-colors" />
                        </div>
                        <select
                          name="city"
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent text-white p-4 pl-0 border-none outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="text-gray-500">{t.selectCity}</option>
                          {cities.map((c, i) => <option className="bg-[#111] text-white" key={i} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="relative group/input block">
                      <div className="absolute -inset-[1px] bg-gradient-to-r from-lime-400 to-emerald-500 rounded-xl opacity-0 group-focus-within/input:opacity-100 blur-sm transition-opacity duration-500" />
                      <div className="relative flex items-center bg-[#111] rounded-xl overflow-hidden">
                        <div className="pl-4 pr-3 flex items-center justify-center pointer-events-none">
                          <Box size={18} className="text-gray-500 group-focus-within/input:text-lime-400 transition-colors" />
                        </div>
                        <select
                          name="storageType"
                          onChange={handleChange}
                          required
                          className="w-full bg-transparent text-white p-4 pl-0 border-none outline-none appearance-none cursor-pointer"
                        >
                          <option value="" className="text-gray-500">{t.storage}</option>
                          <option className="bg-[#111] text-white" value="normal">Normal</option>
                          <option className="bg-[#111] text-white" value="cold">Cold</option>
                        </select>
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      className="w-full bg-lime-400 text-black font-bold p-4 rounded-xl hover:bg-lime-300 transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-70 group/btn relative overflow-hidden"
                    >
                      <div className="absolute inset-0 -translate-x-full group-hover/btn:animate-[sweep_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0" />
                      {loading ? (
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="z-10 relative">
                          <Leaf size={20} />
                        </motion.div>
                      ) : (
                        <div className="flex items-center gap-2 z-10 relative">
                          {t.analyze}
                          <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </div>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </TiltCard>
          </motion.div>

          {/* Results Area (Right Column) */}
          <div className="lg:col-span-8 flex flex-col gap-6">

            {/* Empty State / Loading State */}
            {!result.length && !loading && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="flex-1 bg-white/5 border border-white/5 rounded-[2rem] flex flex-col justify-center items-center text-center p-12 opacity-80 min-h-[400px]"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <Box size={60} className="text-gray-600 mb-6" />
                </motion.div>
                <h3 className="text-2xl font-bold text-gray-300 mb-2">Awaiting Parameters</h3>
                <p className="text-gray-500 max-w-sm">Select a crop, market city, and storage type to instantly generate AI-driven market predictions.</p>
              </motion.div>
            )}

            {/* Render Results */}
            {result.length > 0 && (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {/* Hero Profit Card */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <TiltCard intensity={30}>
                    <div className="bg-[#0a0a0a]/90 backdrop-blur-xl p-8 rounded-[2rem] border border-white/10 relative overflow-hidden shadow-2xl">
                      <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-lime-400/20 rounded-full blur-[60px]" />
                      <p className="text-gray-400 font-medium mb-2">{t.profit}</p>
                      <div className="flex items-end gap-4">
                        <h2 className="text-6xl font-extrabold text-white text-glow">
                          ₹<AnimatedCounter value={result[0].netProfit} duration={1.5} />
                        </h2>
                        <span className="text-lime-400 font-semibold text-xl mb-2 flex items-center gap-1">
                          <TrendingUp size={24} /> Highly Profitable
                        </span>
                      </div>
                      <div className="mt-6 flex flex-wrap gap-4">
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                          <MapPin size={16} className="text-gray-400" />
                          <span className="text-white font-medium">Best Market: {result[0].mandi}</span>
                        </div>
                        <div className="px-4 py-2 bg-white/5 rounded-lg border border-white/10 flex items-center gap-2">
                          <CloudRain size={16} className="text-blue-400" />
                          <span className="text-white font-medium">Harvest in: {result[0].harvestWindow}</span>
                        </div>
                      </div>
                    </div>
                  </TiltCard>
                </motion.div>

                {/* AI Summary Card */}
                <motion.div variants={itemVariants} className="md:col-span-2">
                  <div className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 md:p-8 rounded-[2rem] border border-white/10 shadow-xl transition-transform hover:scale-[1.01]">
                    <div className="flex items-center gap-3 mb-4">
                      <ShieldCheck className="text-emerald-400" size={24} />
                      <h3 className="font-bold text-xl text-white">{t.summary}</h3>
                    </div>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      Based on real-time data, selling <span className="text-lime-400 font-bold">{formData.crop}</span> in <span className="text-white font-bold">{result[0].mandi}</span> is currently highly recommended.
                      The expected net profit stands at <span className="text-white font-bold">₹{result[0].netProfit.toLocaleString()}</span>.
                      Weather conditions indicate you should harvest within <span className="text-white font-bold">{result[0].harvestWindow}</span>.
                      <br /><br />
                      <span className="text-emerald-400 font-semibold pr-2">AI Confidence Score:</span>
                      <span className="text-white font-bold px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full">
                        <AnimatedCounter value={result[0].confidenceScore} duration={2} />%
                      </span>
                    </p>
                  </div>
                </motion.div>

                {/* Bar Graph - Profit Comp */}
                <motion.div variants={itemVariants} className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-xl transition-transform hover:scale-[1.02]">
                  <h3 className="font-bold text-white mb-6">Profit by Market Comparison</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                        <XAxis dataKey="mandi" stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                        <Bar
                          dataKey="profit"
                          fill="#a3e635"
                          radius={[4, 4, 0, 0]}
                          animationDuration={1500}
                          animationEasing="ease-out"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

                {/* Line Graph - Rainfall Trend */}
                <motion.div variants={itemVariants} className="bg-[#0a0a0a]/80 backdrop-blur-xl p-6 rounded-[2rem] border border-white/10 shadow-xl transition-transform hover:scale-[1.02]">
                  <h3 className="font-bold text-white mb-6">Rainfall Forecast Trend</h3>
                  <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={rainfallTrend as any} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                        <XAxis dataKey="time" stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                        <YAxis stroke="#666" tick={{ fill: '#888' }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line
                          type="monotone"
                          dataKey="rainfall"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          dot={{ fill: '#3b82f6', r: 4, strokeWidth: 0 }}
                          activeDot={{ r: 6, fill: '#60a5fa', strokeWidth: 0 }}
                          animationDuration={2000}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </motion.div>

              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}