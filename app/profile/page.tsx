"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "../lib/auth";
import Link from "next/link";

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-green-50 flex justify-center p-6">
      <div className="w-full max-w-md">

        <div className="bg-white p-6 rounded-3xl shadow-xl mb-6">
          <h2 className="text-xl font-bold text-emerald-700">
            Dashboard
          </h2>
          <p className="text-gray-600 text-sm">
            Welcome to AgriChain AI
          </p>
        </div>

        <div className="space-y-4">
          <Link href="/history">
            <div className="bg-white p-4 rounded-2xl shadow cursor-pointer">
              📈 History
            </div>
          </Link>

          <Link href="/profile">
            <div className="bg-white p-4 rounded-2xl shadow cursor-pointer">
              👤 Profile
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}