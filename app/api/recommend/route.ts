import { NextResponse } from "next/server";
import { realMandiData } from "@/app/data/realMandiData";

/* ---------------- WEATHER ENGINE ---------------- */

async function getWeatherData(city: string) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) return { humidity: 50, rainfall: 0 };

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&appid=${apiKey}&units=metric`
    );

    const data = await response.json();

    if (data.cod !== "200") {
      console.log("Weather API error:", data.message);
      return { humidity: 50, rainfall: 0 };
    }

    const humidityAvg =
      data.list.reduce(
        (sum: number, item: any) => sum + item.main.humidity,
        0
      ) / data.list.length;

    const totalRainfall = data.list.reduce(
      (sum: number, item: any) => sum + (item.rain?.["3h"] || 0),
      0
    );

    return {
      humidity: Math.round(humidityAvg),
      rainfall: Math.round(totalRainfall),
    };

  } catch (error) {
    console.log("Weather fetch failed:", error);
    return { humidity: 50, rainfall: 0 };
  }
}

/* ---------------- MAIN API ---------------- */

export async function POST(req: Request) {
  const body = await req.json();
  const { crop, storageType, city } = body;

  if (!crop || !city) {
    return NextResponse.json(
      { error: "Please select valid crop and city." },
      { status: 400 }
    );
  }

  const weather = await getWeatherData(city);
  const humidity = weather.humidity;
  const rainfall = weather.rainfall;

  const storageModifier = storageType === "cold" ? 0.5 : 1;

  const results = realMandiData
    .filter((market) =>
      market.crop.toLowerCase() === crop.toLowerCase()
    )
    .map((market) => {

      /* -------- CLIMATE FACTOR -------- */

      let climateFactor = 0;

      if (rainfall > 40) climateFactor -= 150;
      else if (rainfall < 5) climateFactor += 80;

      if (humidity > 75) climateFactor -= 60;

      /* -------- PRICE MODEL -------- */

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

      /* -------- PRESERVATION ENGINE -------- */

     const baseRisk = spoilagePenalty / 10;

const preservationOptions = [
  {
    method: "Cold Storage",
    cost: 400,
    riskReduction: Math.min(60, Math.round(baseRisk * 1.4))
  },
  {
    method: "Local Market Sale",
    cost: 150,
    riskReduction: Math.min(40, Math.round(baseRisk))
  },
  {
    method: "Immediate Sale",
    cost: 0,
    riskReduction: Math.min(25, Math.round(baseRisk * 0.6))
  }
]
.map(option => ({
  ...option,
  rankScore: (option.riskReduction * 3) - (option.cost / 20)
}))
.sort((a, b) => b.rankScore - a.rankScore);

      /* -------- CONFIDENCE SCORE -------- */

      let confidenceScore = 85;

      confidenceScore -= Math.abs(humidity - 50) * 0.2;
      confidenceScore -= Math.abs(market.trend - 1) * 100;
      confidenceScore -= distance * 0.02;
      confidenceScore -= spoilagePenalty * 0.01;

      confidenceScore = Math.max(
        40,
        Math.min(95, Math.round(confidenceScore))
      );

      /* -------- HARVEST WINDOW -------- */

      let harvestAdvice = "";
      let harvestWindow = "";

      if (rainfall > 50) {
        harvestAdvice = "Heavy rain expected. Harvest immediately.";
        harvestWindow = "Next 1-2 days";
      }
      else if (market.trend > 1.05) {
        harvestAdvice = "Prices rising. Wait few days.";
        harvestWindow = "5-7 days";
      }
      else if (market.trend < 0.97) {
        harvestAdvice = "Prices falling. Sell quickly.";
        harvestWindow = "1-3 days";
      }
      else {
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
        rainfall,
        humidity,
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