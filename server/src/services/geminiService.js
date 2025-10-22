import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function callGemini(prompt, model = "gemini-2.0-flash") {
  try {
    const generativeModel = genAI.getGenerativeModel({ model });
    const result = await generativeModel.generateContent(prompt);
    const text = result.response.text();

    return text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error(`Gemini API call failed: ${error.message}`);
  }
}

export async function callGeminiWithRetry(prompt, model = "gemini-2.0-flash", maxRetries = 3) {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await callGemini(prompt, model);
    } catch (error) {
      lastError = error;
      console.log(`Retry ${i + 1}/${maxRetries} after error:`, error.message);

      await new Promise((resolve) => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }

  throw lastError;
}