"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";

export default function Profile() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string, email?: string } | null>(null);

  useEffect(() => {
    const logged = localStorage.getItem("agriLoggedIn");
    if (!logged) {
      router.replace("/login");
      return;
    }

    const stored = localStorage.getItem("agriUser");

    if (!stored) return;

    try {
      const parsed = JSON.parse(stored);
      if (typeof parsed === "object") {
        setUser(parsed);
      } else {
        // if old format (just email string)
        setUser({ name: parsed.split("@")[0], email: parsed });
      }
    } catch {
      // fallback if plain string
      setUser({ name: stored.split("@")[0], email: stored });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-900 to-green-600 flex justify-center items-center text-white">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-white text-black p-6 rounded-3xl shadow-xl w-full max-w-sm"
      >
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">
            {user.name?.charAt(0)?.toUpperCase()}
          </div>

          <h2 className="mt-4 text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
        </div>

        <button
          onClick={logout}
          className="w-full mt-6 bg-red-500 text-white p-3 rounded-xl flex justify-center gap-2"
        >
          <LogOut size={18} /> Logout
        </button>
      </motion.div>
    </div>
  );
}