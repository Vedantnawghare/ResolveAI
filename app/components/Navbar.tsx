"use client";

import { Menu, Leaf, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function Navbar() {
    return (
        <nav className="w-full glass-card border-b border-[#ffffff10] px-4 py-3 flex items-center justify-between md:hidden sticky top-0 z-40">
            <div className="flex items-center gap-2">
                <Leaf className="text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]" size={24} />
                <span className="font-bold text-white text-lg text-glow tracking-tight">AgriChain AI</span>
            </div>

            <div className="flex items-center gap-4">
                <button className="text-gray-300 hover:text-white transition-colors">
                    <Bell size={20} />
                </button>
                <button className="text-gray-300 hover:text-white transition-colors">
                    <Menu size={24} />
                </button>
            </div>
        </nav>
    );
}
