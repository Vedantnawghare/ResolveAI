"use client";
import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    crop: "",
    region: "",
    soilQuality: "",
    storageType: "",
    harvestDate: "",
  });

  const [result, setResult] = useState<any>(null);

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
        <input name="region" placeholder="Region" onChange={handleChange} className="w-full p-2 border rounded" />
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

      {result && (
        <div className="mt-6 bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold">Recommendation</h2>
          <p><strong>Best Mandi:</strong> {result.mandi}</p>
          <p><strong>Predicted Price:</strong> ₹{result.price}</p>
          <p><strong>Net Profit Estimate:</strong> ₹{result.netProfit}</p>
          <p><strong>Spoilage Risk:</strong> {result.spoilageRisk}</p>
          <p><strong>Reason:</strong> {result.reason}</p>
        </div>
      )}
    </div>
  );
}