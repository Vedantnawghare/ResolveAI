"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "../lib/auth";

export default function Register() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    registerUser(email, password);
    router.push("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm">
        <h2 className="text-xl font-bold text-emerald-700 mb-6 text-center">
          Register
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border rounded-xl mb-4"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border rounded-xl mb-4"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-emerald-600 text-white p-3 rounded-xl"
        >
          Register
        </button>
      </div>
    </div>
  );
}