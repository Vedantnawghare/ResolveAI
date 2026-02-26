import { NextResponse } from "next/server";
import { realMandiData } from "@/app/data/realMandiData";

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

  if (!crop || !city) {
    return NextResponse.json(
      { error: "Please select a valid crop and city." },
      { status: 400 }
    );
  }

  const humidity = await getWeatherImpact(city);
  console.log("Humidity:", humidity);

  const soilFactor = Number(soilQuality) / 10;
  const storageModifier = storageType === "cold" ? 0.5 : 1;

  const results = realMandiData
    .filter((market) =>
      market.crop?.toLowerCase() === crop?.toLowerCase()
    )
    .map((market) => {

      const climateFactor = humidity > 70 ? -120 : 60;

      // ✅ REAL HYBRID PRICE MODEL
      const predictedPrice =
        market.basePrice * market.trend +
        soilFactor * 150 +
        climateFactor;

      const spoilagePenalty =
        market.transitDays * 120 * storageModifier;

      const transportCost =
        market.distance * 2;

      const netProfit =
        predictedPrice - spoilagePenalty - transportCost;

      // ---------- Explanation Engine ----------

      const climateExplanation =
        humidity > 70
          ? "High humidity may increase supply pressure."
          : "Favorable humidity supports stable pricing.";

      const transportExplanation =
        market.distance < 200
          ? "Short transport distance reduces logistics cost."
          : "Longer transport distance increases logistics cost.";

      const spoilageExplanation =
        spoilagePenalty < 200
          ? "Low spoilage risk due to manageable transit."
          : spoilagePenalty < 400
          ? "Moderate spoilage risk."
          : "High spoilage risk due to extended transit.";

      const trendPercentage = Math.round((market.trend - 1) * 100);

      const demandExplanation =
        trendPercentage > 0
          ? `Positive market trend of +${trendPercentage}% indicates strong demand.`
          : `Market trend of ${trendPercentage}% suggests weaker demand.`;

      const explanation = `
${demandExplanation}
${climateExplanation}
${transportExplanation}
${spoilageExplanation}
`;

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
        explanation,
        score: netProfit,
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