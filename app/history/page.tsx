"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "../lib/auth";

export default function Profile() {
  const router = useRouter();

  const handleLogout = () => {
    logoutUser();
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-green-50 flex justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-6 rounded-3xl shadow-xl">
          <h2 className="text-xl font-bold text-emerald-700 mb-4">
            Profile
          </h2>

          <button
            onClick={handleLogout}
            className="w-full bg-red-500 text-white p-3 rounded-xl"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}