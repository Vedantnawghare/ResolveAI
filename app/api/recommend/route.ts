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
      { error: "Please select crop and district." },
      { status: 400 }
    );
  }

  const humidity = await getWeatherImpact(city);

 
  const districtSoilMap: Record<string, number> = {
    Nagpur: 7,
    Pune: 8,
    Nashik: 6,
    Kolhapur: 8,
    Mumbai: 5,
    Amarawati: 7,
    Jalgaon: 6,
    Nanded: 7,
    Sholapur: 6,
    "Chattrapati Sambhajinagar": 6
  };

  const soilFactor = (districtSoilMap[city] || 6) / 10;

  const storageModifier = storageType === "cold" ? 0.5 : 1;

  
  const cityDistanceMatrix: Record<string, Record<string, number>> = {
    Nagpur: { Nagpur: 0, Pune: 250, Mumbai: 300, Nashik: 220, Kolhapur: 350 },
    Pune: { Pune: 0, Mumbai: 150, Nashik: 200, Nagpur: 250 },
    Mumbai: { Mumbai: 0, Pune: 150, Nashik: 180, Nagpur: 300 },
  };

  const results = realMandiData
    .filter((market) =>
      market.crop?.toLowerCase() === crop.toLowerCase()
    )
    .map((market) => {

      const distance =
        cityDistanceMatrix[city]?.[market.mandi] ?? market.distance;

      const transitDays =
        distance === 0 ? 0 :
        distance < 200 ? 1 :
        distance < 300 ? 2 : 3;

      const climateFactor = humidity > 70 ? -120 : 60;

      const predictedPrice =
        market.basePrice +
        (market.basePrice * (market.trend - 1)) +
        soilFactor * 150 +
        climateFactor;

      const spoilagePenalty =
        transitDays * 120 * storageModifier;

      const transportCost = distance * 2;

      const netProfit =
        predictedPrice - spoilagePenalty - transportCost;

      const score = netProfit - (distance * 0.5);

      
      let harvestAdvice = "";
      let harvestWindow = "";

      if (market.trend > 1.03) {
        if (humidity > 75) {
          harvestAdvice = "Harvest now due to high humidity risk.";
          harvestWindow = "1-2 days";
        } else {
          harvestAdvice = "Prices rising. Wait for better rate.";
          harvestWindow = "5-7 days";
        }
      } else if (market.trend < 0.97) {
        harvestAdvice = "Prices falling. Sell quickly.";
        harvestWindow = "Immediately (1-3 days)";
      } else {
        harvestAdvice = "Market stable.";
        harvestWindow = "Within 3-5 days";
      }

     
      let preservationAdvice = "";

      if (spoilagePenalty > 400) {
        preservationAdvice =
          "High spoilage risk. Use cold storage or sell locally.";
      } else if (spoilagePenalty > 200) {
        preservationAdvice =
          "Moderate risk. Reduce delay in transport.";
      } else {
        preservationAdvice =
          "Low spoilage risk. Normal storage acceptable.";
      }

    
      const trendPercentage = Math.round((market.trend - 1) * 100);

      const explanation = `
Price trend: ${trendPercentage >= 0 ? "+" : ""}${trendPercentage}%.
Humidity: ${humidity}%.
Transport distance: ${distance} km.
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
        harvestAdvice,
        harvestWindow,
        preservationAdvice,
        explanation,
        score,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (results.length === 0) {
    return NextResponse.json(
      { error: "No mandi data available for this crop." },
      { status: 404 }
    );
  }

  return NextResponse.json(results);
}