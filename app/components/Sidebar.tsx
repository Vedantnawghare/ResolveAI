"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Home, User, Leaf, BarChart2, Settings, LogOut } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import clsx from "clsx";

const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: BarChart2, label: "Market Trends", href: "#" },
    { icon: User, label: "Profile", href: "/profile" },
    { icon: Settings, label: "Settings", href: "#" },
];

export default function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const [isHovered, setIsHovered] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("agriLoggedIn");
        localStorage.removeItem("agriUser");
        router.replace("/login");
    };

    return (
        <motion.div
            className="fixed left-0 top-0 h-screen glass-card border-r border-[#ffffff10] z-50 flex flex-col items-center py-8 hidden md:flex transition-all duration-300 ease-in-out"
            initial={{ width: 80 }}
            animate={{ width: isHovered ? 240 : 80 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex items-center gap-3 mb-12 px-4 w-full cursor-pointer" onClick={() => router.push("/")}>
                <div className="min-w-[40px] flex justify-center">
                    <Leaf className="text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]" size={32} />
                </div>
                {isHovered && (
                    <motion.span
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-xl font-bold text-white text-glow whitespace-nowrap"
                    >
                        AgriChain AI
                    </motion.span>
                )}
            </div>

            <div className="flex-1 w-full px-3 flex flex-col gap-2">
                {navItems.map((item, idx) => {
                    const isActive = pathname === item.href;
                    return (
                        <button
                            key={idx}
                            onClick={() => item.href !== "#" && router.push(item.href)}
                            className={clsx(
                                "flex items-center gap-4 w-full p-3 rounded-xl transition-all duration-200 group relative",
                                isActive ? "bg-white/10 text-lime-400" : "text-gray-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <div className="min-w-[40px] flex justify-center">
                                <item.icon size={22} className={clsx("transition-transform group-hover:scale-110", isActive && "drop-shadow-[0_0_8px_rgba(163,230,53,0.5)]")} />
                            </div>
                            {isHovered && (
                                <motion.span
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="font-medium whitespace-nowrap"
                                >
                                    {item.label}
                                </motion.span>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="w-full px-3 mt-auto">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-4 w-full p-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all duration-200 group"
                >
                    <div className="min-w-[40px] flex justify-center">
                        <LogOut size={22} className="transition-transform group-hover:scale-110" />
                    </div>
                    {isHovered && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="font-medium whitespace-nowrap"
                        >
                            Logout
                        </motion.span>
                    )}
                </button>
            </div>
        </motion.div>
    );
}
