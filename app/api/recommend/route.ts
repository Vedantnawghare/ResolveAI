import { NextResponse } from "next/server";
import { mandiData } from "@/app/data/mandiData";

// Fetch humidity instead of rain (more stable for demo)
async function getWeatherImpact(region: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;

    if (!apiKey) {
      console.log("No API key found. Using fallback.");
      return 50; // fallback humidity
    }

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${region},IN&appid=${apiKey}`
    );

    const data = await response.json();

    if (data.cod !== 200) {
      console.log("Weather API error:", data.message);
      return 50; // fallback humidity
    }

    // Use humidity (always exists)
    return data.main?.humidity || 50;

  } catch (error) {
    console.log("Weather fetch failed:", error);
    return 50;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { crop, soilQuality, storageType, region } = body;

  const humidity = await getWeatherImpact(region);
  console.log("Humidity:", humidity);

  const soilFactor = Number(soilQuality) / 10;
  const storageModifier = storageType === "cold" ? 0.5 : 1;

  const results = mandiData
    .filter((market) =>
      market.crop?.toLowerCase() === crop?.toLowerCase() &&
      (!region || market.region?.toLowerCase() === region.toLowerCase())
    )
    .map((market) => {

      // Climate impact using humidity
      const climateFactor = humidity > 70 ? -120 : 60;

      const predictedPrice =
        market.seasonalAvg * 0.6 +
        market.seasonalAvg * market.trend * 0.3 +
        soilFactor * 150 +
        climateFactor;

      const spoilagePenalty =
        market.transitDays * 120 * storageModifier;

      const transportCost =
        market.distance * 2; // ₹2 per km

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