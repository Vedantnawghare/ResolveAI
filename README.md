🌾 AgriChain AI  
Smart Harvest & Market Intelligence for Farmers

🚨 Problem Statement

India’s farmers lose up to **40% of produce** not because of poor farming —  
but due to:

 ❌ Poor harvest timing  
 ❌ Market mismatch  
 ❌ Post-harvest spoilage  
 ❌ Lack of price transparency  

Our goal was to build an AI system that:

 Ingests real weather data  
 Uses soil health indicators  
• Analyzes historical mandi price trends  
• Recommends optimal harvest window  
• Suggests best target market  
• Evaluates post-harvest spoilage risk  
• Ranks preservation actions  
• Works on **basic Android phones**

And most importantly:  
⚡ Shows *why* it recommends something — not just what.

---------------------------------------------------------------------------

# 🧠 Our Approach (USP)

Unlike most AI projects that use heavy ML models, we built:

### 🔹 Hybrid Rule-Based Intelligence Engine  
No GPU. No heavy ML. No large models.

Instead, we combined:

- 📊 Real Agmarknet mandi dataset  
- 🌧 OpenWeather 5-day forecast API  
- 🌱 Soil fertility index mapping  
- 🚚 Logistics distance modeling  
- 📦 Spoilage risk modeling  
- 📈 Trend multiplier pricing logic  

This makes our system:

- ✅ Explainable  
- ✅ Low-cost  
- ✅ Scalable  
- ✅ Fast  
- ✅ Suitable for rural deployment  

------------------------------------------------------------------

# 🏗 System Architecture


User Input (Crop, City, Storage)
↓
Weather Engine (Humidity + Rainfall Forecast)
↓
Soil Engine (City-based Soil Index)
↓
Trend Engine (Mandi Price Multiplier)
↓
Logistics Engine (Distance + Transit Cost)
↓
Spoilage Risk Model
↓
Preservation Ranking Engine
↓
Confidence Score Calculation
↓
Multilingual Farmer-Friendly Output


--------------------------------------------------------------------------------------------

📊 Features

 🌦 Real Weather Integration
- 5-day rainfall forecast
- Humidity impact on pricing
- Harvest window adjustment based on rain risk

 🌱 Soil Impact Engine
- City-level fertility index
- Price adjustment based on production supply logic

 📈 Price Prediction Engine

Predicted Price =
(basePrice × trendMultiplier)

climateFactor

soilFactor


 🚚 Logistics Model

Transport Cost = distance × rate
Spoilage Penalty = transitDays × storageFactor
Net Profit = predictedPrice - spoilage - transport


 📦 Preservation Ranking
Options ranked by:
- Cost
- Risk reduction %
- Efficiency score

 📊 Confidence Score
Based on:
- Weather stability
- Market volatility
- Distance uncertainty
- Soil reliability
- Spoilage impact

Range: 40% – 95%

---

 🌍 Multilingual Support

Fully available in:

- 🇬🇧 English  
- 🇮🇳 Hindi  
- 🇮🇳 Marathi  

All UI elements, dropdowns, summaries, and outputs change dynamically.

-----------------------------------------------------------------------------------------------

 📱 Designed For Low-End Android Phones

- Minimal memory footprint  
- No heavy ML dependencies  
- Lightweight backend logic  
- Runs on low-cost server  
- Mobile-first UI  
- APK-ready web app  

------------------------------------------------------------------------------------------------

 🖥 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | Next.js 16 + TailwindCSS |
| Backend | Next.js API Routes |
| Charts | Recharts |
| Animations | Framer Motion |
| Weather | OpenWeather API |
| Dataset | Agmarknet (3-month cleaned dataset) |
| Storage | LocalStorage session auth |

---

 🔬 Data Engineering Done

- Cleaned null entries  
- Standardized crop names  
- Removed duplicates  
- Calculated trend multipliers  
- Structured `realMandiData.ts`  
- Created synthetic but realistic logistics layer  

---

 🚀 How To Run

```bash
npm install
npm run dev

Add .env.local:

OPENWEATHER_API_KEY=your_key_here
📦 Future Improvements

Real soil API integration

Historical rainfall modeling

SMS-based output for non-smartphone farmers

Voice-based assistant

Market demand forecasting model

Farmer cooperative price pooling

🏆 Why This Is Different

Most teams build flashy ML demos.

We built a:

✔ Practical
✔ Explainable
✔ Low-cost
✔ Scalable
✔ Rural-friendly
✔ Trust-based decision system

No black-box AI.
Full transparency.

Built for real-world adoption.

👨‍💻 Developed For

Agriculture Intelligence & Smart Market Optimization
Hackathon Submission 2026

🌾 AgriChain AI

Empowering farmers with timing, transparency & trust.
