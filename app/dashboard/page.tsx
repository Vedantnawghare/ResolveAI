"use client";
import { realMandiData } from "../data/realMandiData";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn } from "../lib/auth";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Leaf, CloudRain, TrendingUp, User } from "lucide-react";

export default function Dashboard() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    crop: "",
    city: "",
    storageType: "",
  });

  const [result, setResult] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.push("/login");
    }
  }, []);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResult(data);
  };
const crops = [...new Set(realMandiData.map(item => item.crop))];
const cities = [...new Set(realMandiData.map(item => item.mandi))];
  const chartData = result.map((r) => ({
    mandi: r.mandi,
    profit: r.netProfit,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-200 to-green-300 p-6">
      <div className="max-w-5xl mx-auto">

        {/* TOP NAV */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-emerald-800 flex items-center gap-2">
            <Leaf /> AgriChain AI
          </h1>

          <div className="flex gap-4 items-center">
            <button onClick={() => router.push("/history")} className="text-sm font-medium">
              History
            </button>
            <User
              className="cursor-pointer"
              onClick={() => router.push("/profile")}
            />
          </div>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl mb-8 grid md:grid-cols-3 gap-4"
        >
         <select name="crop" onChange={handleChange} required className="p-3 rounded-xl border">
  <option value="">Select Crop</option>
  {crops.map((crop, index) => (
    <option key={index} value={crop}>
      {crop}
    </option>
  ))}
</select>

          <select name="city" onChange={handleChange} required className="p-3 rounded-xl border">
  <option value="">Select City</option>
  {cities.map((city, index) => (
    <option key={index} value={city}>
      {city}
    </option>
  ))}
</select>

          <select name="storageType" onChange={handleChange} required className="p-3 rounded-xl border">
            <option value="">Storage</option>
            <option value="normal">Normal</option>
            <option value="cold">Cold</option>
          </select>

          <button className="md:col-span-3 bg-emerald-600 text-white p-3 rounded-xl font-semibold">
            Get Recommendation
          </button>
        </form>

        {/* SUMMARY CARDS */}
        {result.length > 0 && (
          <>
            <div className="grid md:grid-cols-3 gap-6 mb-8">

              <motion.div whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl">
                <TrendingUp className="mb-2 text-emerald-600" />
                <p className="text-sm text-gray-600">Best Profit</p>
                <p className="text-2xl font-bold text-green-700">
                  ₹{result[0].netProfit}
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl">
                <CloudRain className="mb-2 text-blue-600" />
                <p className="text-sm text-gray-600">Rainfall</p>
                <p className="text-2xl font-bold text-blue-700">
                  {result[0].rainfall} mm
                </p>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}
                className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-xl">
                <Leaf className="mb-2 text-emerald-600" />
                <p className="text-sm text-gray-600">Soil Index</p>
                <p className="text-2xl font-bold text-emerald-800">
                  {result[0].soilIndex}/10
                </p>
              </motion.div>

            </div>
<div className="grid md:grid-cols-4 gap-4 mb-6">

  <div className="bg-white p-4 rounded-xl shadow">
    📈 <strong>Trend:</strong> Rising
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    🌧 <strong>Rainfall:</strong> {result[0]?.rainfall} mm
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    🌱 <strong>Soil:</strong> {result[0]?.soilIndex}/10
  </div>

  <div className="bg-white p-4 rounded-xl shadow">
    🚚 <strong>Transport:</strong> ₹{result[0]?.transportCost}
  </div>

</div>
            {/* CHART */}
            <div className="bg-white/80 backdrop-blur-md p-6 rounded-3xl shadow-xl">
              <h2 className="font-bold mb-4">Profit Comparison</h2>

              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="mandi" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="profit" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
    
  );
  <div className="bg-white/90 p-6 rounded-3xl shadow-xl mt-8">
  <h2 className="text-lg font-bold mb-3">
    🤖 AI Summary
  </h2>

  <p className="text-gray-700 leading-relaxed">
    {result.length > 0 &&
      `Selling in ${result[0].mandi} is recommended. 
       Expected profit is ₹${result[0].netProfit}. 
       Weather forecast shows ${result[0].rainfall}mm rainfall and 
       soil index is ${result[0].soilIndex}/10. 
       Harvest within ${result[0].harvestWindow}.`}
  </p>
</div>
}
