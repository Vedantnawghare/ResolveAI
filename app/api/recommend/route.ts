import { NextResponse } from "next/server";
import { mandiData } from "@/app/data/mandiData";
console.log("Total mandi entries:", mandiData.length);

export async function POST(req: Request) {
  const body = await req.json();
  const { crop, soilQuality, storageType } = body;

  const soilFactor = Number(soilQuality) / 10;
  const storageModifier = storageType === "cold" ? 0.5 : 1;

  let bestOption: any = null;
  let bestScore = -Infinity;

  mandiData.forEach((market) => {
    if (market.crop.toLowerCase() !== crop.toLowerCase()) return;

    const predictedPrice =
      market.seasonalAvg * 0.6 +
      market.seasonalAvg * market.trend * 0.3 +
      soilFactor * 150;

    const spoilagePenalty = market.transitDays * 120 * storageModifier;

    const netProfit = predictedPrice - spoilagePenalty;

    if (netProfit > bestScore) {
      bestScore = netProfit;

      bestOption = {
        mandi: market.mandi,
        price: Math.round(predictedPrice),
        netProfit: Math.round(netProfit),
        spoilageRisk:
          spoilagePenalty < 200 ? "Low" :
          spoilagePenalty < 400 ? "Medium" : "High",
        reason: `Recommended due to strong regional demand multiplier, ${Math.round((market.trend - 1) * 100)}% positive price trend, and optimized transit duration reducing spoilage impact.`,
      };
    }
  });

  return NextResponse.json(bestOption);
}