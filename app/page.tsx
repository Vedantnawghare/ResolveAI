"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";
import { Leaf } from "lucide-react";
import ParticleBackground from "./components/ParticleBackground";

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      const logged = localStorage.getItem("agriLoggedIn");
      if (logged) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 4000); // Extended slightly to let user play with particles
    return () => clearTimeout(timer);
  }, [router]);

  // Cinematic staggered text animation
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.5,
      },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { type: "spring", stiffness: 100 } },
  };

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex justify-center items-center text-white cursor-crosshair">
      <ParticleBackground />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 flex flex-col items-center pointer-events-none" // prevent blocking particle interaction
      >
        {/* Draggable Logo */}
        <motion.div
          drag
          dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
          dragElastic={0.2}
          whileDrag={{ scale: 1.2, cursor: "grabbing" }}
          className="relative pointer-events-auto cursor-grab touch-none"
          title="Drag me!"
        >
          <div className="absolute inset-0 bg-lime-400/40 blur-[40px] rounded-full scale-150" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            <Leaf size={100} className="text-lime-400 drop-shadow-[0_0_25px_rgba(163,230,53,1)]" />
          </motion.div>
        </motion.div>

        <motion.h1
          variants={item}
          className="text-6xl md:text-8xl font-black mt-10 tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-emerald-200 to-lime-400"
        >
          AgriChain AI
        </motion.h1>

        <motion.div variants={item} className="mt-6 flex flex-col items-center gap-2">
          <p className="text-xl md:text-2xl text-gray-400 font-light tracking-widest uppercase">
            Interact with the grid
          </p>
          <div className="flex gap-3 mt-4">
            <motion.div className="w-12 h-1 bg-lime-400 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} />
            <motion.div className="w-12 h-1 bg-emerald-400 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
            <motion.div className="w-12 h-1 bg-lime-400 rounded-full" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1 }} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}