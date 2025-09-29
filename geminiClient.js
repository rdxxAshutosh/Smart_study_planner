import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey:"AIzaSyBghfcxp5KCRVaHUMUDoSLnWEfiTJlBCBw",   // 👈 force API key auth
});

export async function generateWithGemini(prompt, model = "gemini-2.5-pro", thinkingBudget = 0) {
  const res = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      thinkingConfig: { thinkingBudget },
    },
  });
  return res?.text ?? "";
}
