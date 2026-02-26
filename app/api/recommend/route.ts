import { NextResponse } from "next/server";
import { mandiData } from "@/app/data/mandiData";

export async function POST(req: Request) {
  const body = await req.json();
  const { crop, soilQuality, storageType } = body;

  const soilFactor = Number(soilQuality) / 10;
  const storageModifier = storageType === "cold" ? 0.5 : 1;

  const results = mandiData
    .filter((market) => market.crop.toLowerCase() === crop.toLowerCase())
    .map((market) => {
      const predictedPrice =
        market.seasonalAvg * 0.6 +
        market.seasonalAvg * market.trend * 0.3 +
        soilFactor * 150;

      const spoilagePenalty = market.transitDays * 120 * storageModifier;
      const netProfit = predictedPrice - spoilagePenalty;

      return {
        mandi: market.mandi,
        predictedPrice: Math.round(predictedPrice),
        netProfit: Math.round(netProfit),
        spoilageRisk:
          spoilagePenalty < 200 ? "Low" :
          spoilagePenalty < 400 ? "Medium" : "High",
        score: netProfit,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  return NextResponse.json(results);
}