"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    crop: "",
    city: "",
    soilQuality: "",
    storageType: "",
    harvestDate: "",
  });

  const [result, setResult] = useState<any[]>([]);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">AgriChain Advisor</h1>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded shadow">
        <input name="crop" placeholder="Crop" onChange={handleChange} className="w-full p-2 border rounded" />
        <select
  name="city"
  onChange={handleChange}
  className="w-full p-2 border rounded"
>
  <option value="">Select Nearest City</option>
  <option value="Mumbai">Mumbai</option>
  <option value="Pune">Pune</option>
  <option value="Nagpur">Nagpur</option>
  <option value="Nashik">Nashik</option>
  <option value="Kolhapur">Kolhapur</option>
  <option value="Aurangabad">Aurangabad</option>
  <option value="Solapur">Solapur</option>
  <option value="Amravati">Amravati</option>
  <option value="Nanded">Nanded</option>
  <option value="Jalgaon">Jalgaon</option>
</select>
        <input name="soilQuality" placeholder="Soil Quality (1-10)" onChange={handleChange} className="w-full p-2 border rounded" />
        <select name="storageType" onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">Select Storage Type</option>
          <option value="cold">Cold Storage</option>
          <option value="normal">Normal Storage</option>
        </select>
        <input type="date" name="harvestDate" onChange={handleChange} className="w-full p-2 border rounded" />

        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Get Recommendation
        </button>
      </form>

      {result.length > 0 && result.map((item: any, index: number) => (
  <div key={index} className="mt-4 bg-white p-6 rounded shadow">
    <h2 className="text-lg font-semibold">Option {index + 1}</h2>
    <p><strong>Mandi:</strong> {item.mandi}</p>
    <p><strong>Predicted Price:</strong> ₹{item.predictedPrice}</p>
    <p><strong>Net Profit:</strong> ₹{item.netProfit}</p>
    <p><strong>Spoilage Risk:</strong> {item.spoilageRisk}</p>
    <p><strong>Transport Cost:</strong> ₹{item.transportCost}</p>
  </div>
))}
{result.length > 0 && (
  <div className="mt-8 bg-white p-6 rounded shadow">
    <h2 className="text-lg font-semibold mb-4">Profit Comparison</h2>
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={result}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="mandi" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="netProfit" />
      </BarChart>
    </ResponsiveContainer>
  </div>
)}
      
    </div>
  );
}