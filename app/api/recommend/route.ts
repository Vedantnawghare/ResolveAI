import { NextResponse } from "next/server";
import { realMandiData } from "@/app/data/realMandiData";

async function getWeatherImpact(city: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return 50;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${apiKey}`
    );

    const data = await response.json();
    if (data.cod !== 200) return 50;

    return data.main?.humidity || 50;
  } catch {
    return 50;
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { crop, storageType, city } = body;

  if (!crop || !city) {
    return NextResponse.json(
      { error: "Please select valid crop and city." },
      { status: 400 }
    );
  }

  const humidity = await getWeatherImpact(city);
  const storageModifier = storageType === "cold" ? 0.5 : 1;

  const results = realMandiData
    .filter((market) => market.crop.toLowerCase() === crop.toLowerCase())
    .map((market) => {

      const climateFactor = humidity > 70 ? -120 : 60;

      const predictedPrice =
        market.basePrice * market.trend + climateFactor;

      const distance = market.distance;
      const transitDays = market.transitDays;

      const spoilagePenalty =
        transitDays * 120 * storageModifier;

      const transportCost =
        distance * 2;

      const netProfit =
        predictedPrice - spoilagePenalty - transportCost;

      // 🟢 PRESERVATION RANKING ENGINE

      // Dynamic preservation logic

let baseRisk = spoilagePenalty / 100; // normalized risk score

const preservationOptions = [
  {
    method: "Cold Storage",
    cost: 400,
    riskReduction: Math.min(60, Math.round(baseRisk * 1.5))
  },
  {
    method: "Local Market Sale",
    cost: 150,
    riskReduction: Math.min(40, Math.round(baseRisk * 1.0))
  },
  {
    method: "Immediate Sale",
    cost: 0,
    riskReduction: Math.min(25, Math.round(baseRisk * 0.7))
  }
]
.map(option => ({
  ...option,
  rankScore: (option.riskReduction * 2) - (option.cost / 10)
}))
.sort((a, b) => b.rankScore - a.rankScore);
// CONFIDENCE SCORE

// SMART CONFIDENCE SCORE

let confidenceScore = 80;

// 1️⃣ Weather impact strength
confidenceScore -= Math.abs(humidity - 50) * 0.2;

// 2️⃣ Market volatility (how far from stable 1.0)
confidenceScore -= Math.abs(market.trend - 1) * 100;

// 3️⃣ Distance uncertainty
confidenceScore -= distance * 0.02;

// 4️⃣ High spoilage reduces confidence
confidenceScore -= spoilagePenalty * 0.01;

// Clamp range
confidenceScore = Math.max(40, Math.min(95, Math.round(confidenceScore)));
      // 🟢 HARVEST WINDOW LOGIC

      let harvestAdvice = "";
      let harvestWindow = "";

      if (market.trend > 1.03) {
        if (humidity > 75) {
          harvestAdvice = "Harvest immediately due to high humidity risk.";
          harvestWindow = "Next 1-2 days";
        } else {
          harvestAdvice = "Prices rising. Consider waiting.";
          harvestWindow = "5-7 days";
        }
      } else if (market.trend < 0.97) {
        harvestAdvice = "Market falling. Sell quickly.";
        harvestWindow = "1-3 days";
      } else {
        harvestAdvice = "Market stable.";
        harvestWindow = "3-5 days";
      }

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
        harvestAdvice,
        harvestWindow,
        confidenceScore,
        preservationOptions,
        score: netProfit
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (results.length === 0) {
    return NextResponse.json(
      { error: "No mandi data available for selected crop." },
      { status: 404 }
    );
  }

  return NextResponse.json(results);
}