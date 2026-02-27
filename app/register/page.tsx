"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf } from "lucide-react";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name || !email || !password) {
      alert("Fill all fields");
      return;
    }

    const user = { name, email };

    localStorage.setItem("agriUser", JSON.stringify(user));
    localStorage.setItem("agriLoggedIn", "true");

    router.replace("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-green-900 to-emerald-700 flex justify-center items-center">

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm bg-white/10 backdrop-blur-lg p-8 rounded-3xl shadow-2xl"
      >
        <div className="flex justify-center mb-6">
          <Leaf size={50} className="text-lime-400" />
        </div>

        <h2 className="text-white text-xl font-bold text-center mb-6">
          Create Account
        </h2>

        <div className="space-y-4">
          <input
            placeholder="Full Name"
            className="w-full p-3 rounded-xl"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full p-3 rounded-xl"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded-xl"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleRegister}
            className="w-full bg-lime-400 text-black font-bold p-3 rounded-xl"
          >
            Register
          </button>
        </div>
      </motion.div>
    </div>
  );
}