import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function fetchGoldPrices() {
try {
console.log("Fetching gold prices from Gemini...");

```
// ✅ Use the free/faster model
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const prompt = `What are the current 22 carat and 24 carat gold prices per gram in India today in INR? 
```

Please provide ONLY a JSON response in this exact format with no additional text:
{
"gold22k": 6248,
"gold24k": 6819
}
Just the numbers, no explanations.`;

```
const result = await model.generateContent(prompt);
const response = await result.response;
const text = response.text();

console.log("Gemini response:", text);

// Extract JSON from response
const jsonMatch = text.match(/\{[\s\S]*?\}/);
if (!jsonMatch) {
  throw new Error("Could not parse JSON from Gemini response");
}

const prices = JSON.parse(jsonMatch[0]);

// Path to JSON file
const pricesPath = path.join(__dirname, "../public/gold-prices.json");

// Default structure
let previousPrices = {
  gold22k: { current: prices.gold22k },
  gold24k: { current: prices.gold24k },
};

// Read previous file if exists
if (fs.existsSync(pricesPath)) {
  previousPrices = JSON.parse(fs.readFileSync(pricesPath, "utf8"));
}

// Calculate changes
const gold22kChange = prices.gold22k - previousPrices.gold22k.current;
const gold24kChange = prices.gold24k - previousPrices.gold24k.current;

const newData = {
  lastUpdated: new Date().toISOString(),
  gold22k: {
    current: prices.gold22k,
    previous: previousPrices.gold22k.current,
    change: gold22kChange,
    changePercent: parseFloat(
      ((gold22kChange / previousPrices.gold22k.current) * 100).toFixed(2)
    ),
  },
  gold24k: {
    current: prices.gold24k,
    previous: previousPrices.gold24k.current,
    change: gold24kChange,
    changePercent: parseFloat(
      ((gold24kChange / previousPrices.gold24k.current) * 100).toFixed(2)
    ),
  },
};

// Write to file
fs.writeFileSync(pricesPath, JSON.stringify(newData, null, 2));
console.log("✅ Gold prices updated successfully!");
console.log(newData);
```

} catch (error) {
console.error("⚠️ Error fetching gold prices:", error);

```
// Write a fallback so build continues
const pricesPath = path.join(__dirname, "../public/gold-prices.json");
const fallbackData = {
  lastUpdated: new Date().toISOString(),
  gold22k: { current: 0, previous: 0, change: 0, changePercent: 0 },
  gold24k: { current: 0, previous: 0, change: 0, changePercent: 0 },
};
fs.writeFileSync(pricesPath, JSON.stringify(fallbackData, null, 2));
console.log("👉 Wrote fallback gold-prices.json so build can continue.");
```

}
}

fetchGoldPrices();
