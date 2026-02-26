"use client";

import { useState } from "react";

export default function Home() {
  const [formData, setFormData] = useState({
    crop: "",
    city: "",
    storageType: "",
  });

  const [result, setResult] = useState<any[]>([]);
  const [language, setLanguage] = useState("en");

  // ---------------- TRANSLATIONS ----------------

  const translations: any = {
    en: {
      title: "AgriChain Advisor",
      crop: "Select Crop",
      city: "Select District",
      storage: "Select Storage Type",
      normal: "Normal Storage",
      cold: "Cold Storage",
      button: "Get Recommendation",
      bestDecision: "Best Decision",
      expectedProfit: "Expected Profit",
      harvestAdvice: "Harvest Advice",
      storageAdvice: "Storage Advice",
      spoilageRisk: "Spoilage Risk",
      transportCost: "Transport Cost",
      predictedPrice: "Predicted Price",
    },
    hi: {
      title: "एग्रीचेन सलाहकार",
      crop: "फसल चुनें",
      city: "जिला चुनें",
      storage: "भंडारण चुनें",
      normal: "सामान्य भंडारण",
      cold: "कोल्ड स्टोरेज",
      button: "सलाह प्राप्त करें",
      bestDecision: "सबसे अच्छा निर्णय",
      expectedProfit: "अनुमानित लाभ",
      harvestAdvice: "कटाई सलाह",
      storageAdvice: "भंडारण सलाह",
      spoilageRisk: "खराब होने का जोखिम",
      transportCost: "परिवहन लागत",
      predictedPrice: "अनुमानित कीमत",
    },
    mr: {
      title: "अ‍ॅग्रीचेन सल्लागार",
      crop: "पीक निवडा",
      city: "जिल्हा निवडा",
      storage: "साठवण निवडा",
      normal: "सामान्य साठवण",
      cold: "कोल्ड स्टोरेज",
      button: "शिफारस मिळवा",
      bestDecision: "सर्वोत्तम निर्णय",
      expectedProfit: "अपेक्षित नफा",
      harvestAdvice: "कापणी सल्ला",
      storageAdvice: "साठवण सल्ला",
      spoilageRisk: "नुकसान जोखीम",
      transportCost: "वाहतूक खर्च",
      predictedPrice: "अंदाजे किंमत",
    },
  };

  const t = translations[language];

  // ---------------- CROP OPTIONS ----------------

  const cropOptions: any = {
    Cotton: { en: "Cotton", hi: "कपास", mr: "कापूस" },
    Tomato: { en: "Tomato", hi: "टमाटर", mr: "टोमॅटो" },
    Onion: { en: "Onion", hi: "प्याज", mr: "कांदा" },
    Wheat: { en: "Wheat", hi: "गेहूं", mr: "गहू" },
    Rice: { en: "Rice", hi: "चावल", mr: "तांदूळ" },
    Soybean: { en: "Soybean", hi: "सोयाबीन", mr: "सोयाबीन" },
    Maize: { en: "Maize", hi: "मक्का", mr: "मका" },
    Sugarcane: { en: "Sugarcane", hi: "गन्ना", mr: "ऊस" },
    "Tur Dal": { en: "Tur Dal", hi: "अरहर दाल", mr: "तूर डाळ" },
    Chana: { en: "Chana", hi: "चना", mr: "हरभरा" },
  };

  // ---------------- CITY OPTIONS ----------------

  const cityOptions: any = {
    Nagpur: { en: "Nagpur", hi: "नागपुर", mr: "नागपूर" },
    Pune: { en: "Pune", hi: "पुणे", mr: "पुणे" },
    Mumbai: { en: "Mumbai", hi: "मुंबई", mr: "मुंबई" },
    Nashik: { en: "Nashik", hi: "नासिक", mr: "नाशिक" },
    Kolhapur: { en: "Kolhapur", hi: "कोल्हापुर", mr: "कोल्हापूर" },
    Amarawati: { en: "Amarawati", hi: "अमरावती", mr: "अमरावती" },
    Jalgaon: { en: "Jalgaon", hi: "जलगांव", mr: "जळगाव" },
    Nanded: { en: "Nanded", hi: "नांदेड़", mr: "नांदेड" },
    Sholapur: { en: "Sholapur", hi: "सोलापुर", mr: "सोलापूर" },
    "Chattrapati Sambhajinagar": {
      en: "Chattrapati Sambhajinagar",
      hi: "छत्रपति संभाजीनगर",
      mr: "छत्रपती संभाजीनगर",
    },
  };

  // ---------------- TRANSLATE ADVICE ----------------

  const translateAdvice = (text: string) => {
    if (language === "en") return text;

    const adviceMap: any = {
      "Harvest now due to high humidity risk.": {
        hi: "उच्च आर्द्रता के कारण तुरंत कटाई करें।",
        mr: "जास्त आर्द्रतेमुळे तात्काळ कापणी करा.",
      },
      "Prices rising. Wait for better rate.": {
        hi: "कीमत बढ़ रही है। कुछ दिन इंतजार करें।",
        mr: "दर वाढत आहेत. थोडे दिवस थांबा.",
      },
      "Prices falling. Sell quickly.": {
        hi: "कीमत गिर रही है। तुरंत बेचें।",
        mr: "दर कमी होत आहेत. लगेच विक्री करा.",
      },
      "Market stable.": {
        hi: "बाजार स्थिर है।",
        mr: "बाजार स्थिर आहे.",
      },
      "High spoilage risk. Use cold storage or sell locally.": {
        hi: "खराब होने का जोखिम अधिक है। कोल्ड स्टोरेज का उपयोग करें।",
        mr: "नुकसान जास्त आहे. कोल्ड स्टोरेज वापरा.",
      },
      "Moderate risk. Reduce delay in transport.": {
        hi: "मध्यम जोखिम। परिवहन में देरी न करें।",
        mr: "मध्यम जोखीम. वाहतूक उशीर करू नका.",
      },
      "Low spoilage risk. Normal storage acceptable.": {
        hi: "कम जोखिम। सामान्य भंडारण ठीक है।",
        mr: "कमी जोखीम. सामान्य साठवण चालेल.",
      },
    };

    return adviceMap[text]?.[language] || text;
  };

  // ---------------- HANDLERS ----------------

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="mr">मराठी</option>
          </select>
        </div>

        <h1 className="text-3xl font-bold mb-6 text-center">
          {t.title}
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow space-y-4"
        >
          <select name="crop" onChange={handleChange} required>
            <option value="">{t.crop}</option>
            {Object.keys(cropOptions).map((key) => (
              <option key={key} value={key}>
                {cropOptions[key][language]}
              </option>
            ))}
          </select>

          <select name="city" onChange={handleChange} required>
            <option value="">{t.city}</option>
            {Object.keys(cityOptions).map((key) => (
              <option key={key} value={key}>
                {cityOptions[key][language]}
              </option>
            ))}
          </select>

          <select name="storageType" onChange={handleChange} required>
            <option value="">{t.storage}</option>
            <option value="normal">{t.normal}</option>
            <option value="cold">{t.cold}</option>
          </select>

          <button
            type="submit"
            className="w-full bg-green-600 text-white p-3 rounded font-semibold"
          >
            {t.button}
          </button>
        </form>

        {/* Results */}
        {result.length > 0 &&
          result.map((item: any, index: number) => (
            <div
              key={index}
              className="mt-6 bg-white p-6 rounded-xl shadow-lg border"
            >
              <h2 className="text-xl font-bold mb-2">
                Best Option {index + 1}
              </h2>

              <p><strong>Mandi:</strong> {item.mandi}</p>
              <p><strong>Predicted Price:</strong> ₹{item.predictedPrice}</p>
              <p className="text-green-600 font-semibold">
                Net Profit: ₹{item.netProfit}
              </p>

              <p><strong>Transport Cost:</strong> ₹{item.transportCost}</p>
              <p>
                <strong>Spoilage Risk:</strong>{" "}
                <span
                  className={
                    item.spoilageRisk === "Low"
                      ? "text-green-600"
                      : item.spoilageRisk === "Medium"
                      ? "text-yellow-600"
                      : "text-red-600"
                  }
                >
                  {item.spoilageRisk}
                </span>
              </p>

              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="font-semibold">Harvest Advice:</p>
                <p>{item.harvestAdvice}</p>
                <p className="text-sm text-gray-600">
                  Recommended Window: {item.harvestWindow}
                </p>
              </div>

              {/* Preservation Ranking */}
              <div className="mt-4">
                <h3 className="font-semibold mb-2">
                  Preservation Options (Ranked)
                </h3>

                {item.preservationOptions.map(
                  (option: any, idx: number) => (
                    <div
                      key={idx}
                      className={`p-3 mb-2 rounded ${
                        idx === 0
                          ? "bg-green-100 border border-green-500"
                          : "bg-gray-50"
                      }`}
                    >
                      <p className="font-medium">
                        {idx === 0 ? "⭐ Best Option: " : ""}
                        {option.method}
                      </p>
                      <p>Cost: ₹{option.cost}</p>
                      <p>Risk Reduction: {option.riskReduction}%</p>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}

      </div>
    </div>
  );
}