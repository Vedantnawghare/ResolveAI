"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Mail, Lock, KeyRound } from "lucide-react";
import TiltCard from "../components/TiltCard";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsLoading(true);

    setTimeout(() => {
      localStorage.setItem("agriLoggedIn", "true");
      localStorage.setItem("agriUser", email);
      router.replace("/dashboard");
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex justify-center items-center relative overflow-hidden">

      {/* Animated abstract geometric background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute w-[800px] h-[800px] border-[1px] border-emerald-500/20 rounded-full top-[-10%] right-[-10%]"
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute w-[600px] h-[600px] border-[2px] border-lime-400/10 rounded-full bottom-[-20%] left-[-20%]"
          animate={{ rotate: -360, scale: [1, 1.2, 1] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />
        {/* Deep background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(163,230,53,0.05)_0%,transparent_50%)]" />
      </div>

      <div className="w-full max-w-md p-6 z-10 perspective-1000">
        <TiltCard intensity={10} className="w-full">
          <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl p-10 rounded-[2rem] border border-white/5 relative overflow-hidden shadow-2xl">

            {/* Inner top gradient bar */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-lime-400 to-transparent opacity-50" />

            {/* Logo/Icon Area */}
            <div className="flex justify-center mb-10 relative">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                className="relative z-10 p-5 bg-gradient-to-br from-lime-400/20 to-emerald-600/20 rounded-2xl border border-lime-400/30 shadow-[0_0_30px_rgba(163,230,53,0.3)]"
              >
                <KeyRound size={40} className="text-lime-400" />
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-center mb-10"
            >
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Secure Access</h2>
              <p className="text-gray-400 text-sm tracking-wide">Enter your credentials to continue</p>
            </motion.div>

            <form onSubmit={handleLogin} className="space-y-6">

              {/* Email Input Group */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="relative group block"
              >
                {/* Active glow effect that reveals on focus-within */}
                <div className="absolute -inset-[1px] bg-gradient-to-r from-lime-400 to-emerald-500 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                <div className="relative flex items-center bg-[#111] rounded-xl overflow-hidden">
                  <div className="pl-4 pr-3 flex items-center justify-center">
                    <Mail size={18} className="text-gray-500 group-focus-within:text-lime-400 transition-colors" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent text-white p-4 pl-0 border-none outline-none placeholder:text-gray-600 font-medium"
                  />
                </div>
              </motion.div>

              {/* Password Input Group */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative group block"
              >
                <div className="absolute -inset-[1px] bg-gradient-to-r from-emerald-500 to-lime-400 rounded-xl opacity-0 group-focus-within:opacity-100 blur-sm transition-opacity duration-500" />
                <div className="relative flex items-center bg-[#111] rounded-xl overflow-hidden">
                  <div className="pl-4 pr-3 flex items-center justify-center">
                    <Lock size={18} className="text-gray-500 group-focus-within:text-lime-400 transition-colors" />
                  </div>
                  <input
                    type="password"
                    required
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent text-white p-4 pl-0 border-none outline-none placeholder:text-gray-600 font-medium tracking-widest"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="pt-4"
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full overflow-hidden rounded-xl font-bold text-black bg-lime-400 hover:bg-lime-300 transition-all disabled:opacity-80 group h-14 flex items-center justify-center"
                >
                  <AnimatePresence mode="popLayout">
                    {isLoading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.5 }}
                      >
                        <Leaf className="animate-spin" size={24} />
                      </motion.div>
                    ) : (
                      <motion.span
                        key="text"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="text-lg tracking-wide z-10"
                      >
                        INITIALIZE SYSTEM
                      </motion.span>
                    )}
                  </AnimatePresence>

                  {/* Laser sweep hover effect */}
                  <div className="absolute inset-0 -translate-x-full group-hover:animate-[sweep_1.5s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-12 z-0" />
                </button>
              </motion.div>

            </form>
          </div>
        </TiltCard>
      </div>
    </div>
  );
}