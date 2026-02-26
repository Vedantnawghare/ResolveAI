import { NextResponse } from "next/server";
import { mandiData } from "@/app/data/mandiData";

async function getWeatherImpact(city: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.log("No API key found. Using fallback.");
      return 50;
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      console.log("Weather API error:", data.message);
      return 50;
    }

    return data.main?.humidity || 50;

  } catch (error) {
    console.log("Weather fetch failed:", error);
    return 50;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { crop, soilQuality, storageType, city } = body;

  // Map city to region
  const cityRegionMap: Record<string, string> = {
    Mumbai: "West",
    Pune: "West",
    Nashik: "North",
    Nagpur: "East",
    Kolhapur: "South",
    Solapur: "South",
    Aurangabad: "Central",
    Amravati: "East",
    Jalgaon: "North",
    Nanded: "East",
  };

  const region = cityRegionMap[city] || "";

  const humidity = await getWeatherImpact(city);
  console.log("Humidity:", humidity);

  const soilFactor = Number(soilQuality) / 10;
  const storageModifier = storageType === "cold" ? 0.5 : 1;

  const results = mandiData
    .filter((market) =>
      market.crop?.toLowerCase() === crop?.toLowerCase() &&
      (!region || market.region?.toLowerCase() === region.toLowerCase())
    )
    .map((market) => {

      const climateFactor = humidity > 70 ? -120 : 60;

      const predictedPrice =
        market.seasonalAvg * 0.6 +
        market.seasonalAvg * market.trend * 0.3 +
        soilFactor * 150 +
        climateFactor;

      const spoilagePenalty =
        market.transitDays * 120 * storageModifier;

      const transportCost =
        market.distance * 2;

      const netProfit =
        predictedPrice - spoilagePenalty - transportCost;

      return {
        mandi: market.mandi,
        predictedPrice: Math.round(predictedPrice),
        netProfit: Math.round(netProfit),
        transportCost: Math.round(transportCost),
        spoilageRisk:
          spoilagePenalty < 200
            ? "Low"
            : spoilagePenalty < 400
            ? "Medium"
            : "High",
        score: netProfit,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return NextResponse.json(results);
}