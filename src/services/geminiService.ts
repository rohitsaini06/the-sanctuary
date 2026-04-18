import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateReflection(prompt: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a compassionate, insightful mental health companion. 
      The user has shared the following thought: "${prompt}"
      
      Generate a short, reflective journal entry (2-3 sentences) that validates their feelings and offers a gentle, grounding perspective. 
      Keep the tone warm, poetic, and supportive.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating reflection:", error);
    return "The silence holds space for your thoughts. Take a deep breath and be kind to yourself today.";
  }
}
