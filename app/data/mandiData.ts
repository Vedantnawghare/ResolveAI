const crops = [
  { name: "Onion", basePrice: 2400 },
  { name: "Tomato", basePrice: 1800 },
  { name: "Potato", basePrice: 1500 },
  { name: "Wheat", basePrice: 2100 },
  { name: "Rice", basePrice: 2600 },
  { name: "Sugarcane", basePrice: 3000 },
  { name: "Soybean", basePrice: 2800 },
  { name: "Cotton", basePrice: 3500 },
  { name: "Maize", basePrice: 1900 },
  { name: "Tur", basePrice: 3200 },
];

const mandis = [
  { name: "Nashik", multiplier: 1.1, transit: 2 },
  { name: "Pune", multiplier: 1.05, transit: 1 },
  { name: "Nagpur", multiplier: 0.95, transit: 3 },
  { name: "Mumbai", multiplier: 1.2, transit: 2 },
  { name: "Solapur", multiplier: 1.0, transit: 2 },
  { name: "Kolhapur", multiplier: 1.08, transit: 2 },
  { name: "Aurangabad", multiplier: 0.98, transit: 3 },
  { name: "Amravati", multiplier: 0.92, transit: 4 },
  { name: "Jalgaon", multiplier: 1.03, transit: 2 },
  { name: "Latur", multiplier: 0.97, transit: 3 },
  { name: "Sangli", multiplier: 1.06, transit: 2 },
  { name: "Satara", multiplier: 1.04, transit: 2 },
  { name: "Ahmednagar", multiplier: 1.02, transit: 2 },
  { name: "Beed", multiplier: 0.94, transit: 3 },
  { name: "Nanded", multiplier: 0.96, transit: 3 },
];

export const mandiData = crops.flatMap((crop) =>
  mandis.map((mandi) => ({
    mandi: mandi.name,
    crop: crop.name,
    seasonalAvg: Math.round(crop.basePrice * mandi.multiplier),
    trend: 0.95 + Math.random() * 0.1, // 0.95–1.05 realistic trend
    transitDays: mandi.transit,
  }))
);