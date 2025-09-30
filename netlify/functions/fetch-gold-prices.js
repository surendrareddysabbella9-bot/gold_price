import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export const handler = async () => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-2.5-flash" });

    const prompt = `What are the current 22 carat and 24 carat gold prices per gram in India today in INR?
Please provide ONLY a JSON response in this exact format with no additional text:
{
  "gold22k": 6248,
  "gold24k": 6819
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const jsonMatch = text.match(/\{[\s\S]*?\}/);
    const prices = JSON.parse(jsonMatch[0]);

    const filePath = path.join(process.cwd(), "public/gold-prices.json");
    fs.writeFileSync(filePath, JSON.stringify({
      lastUpdated: new Date().toISOString(),
      gold22k: prices.gold22k,
      gold24k: prices.gold24k
    }, null, 2));

    return { statusCode: 200, body: JSON.stringify({ message: "Gold prices updated" }) };
  } catch (error) {
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
