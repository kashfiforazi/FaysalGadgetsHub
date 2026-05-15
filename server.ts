import dotenv from "dotenv";
dotenv.config();

import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Global logger
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Lazy Gemini Client
let aiClient: GoogleGenAI | null = null;
const getAi = () => {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      console.warn("GEMINI_API_KEY is missing. AI features will use fallbacks.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
};

const geminiModel = "gemini-3-flash-preview"; 

// Fallback data for AI failures
const FALLBACK_RECOMMENDATIONS = [
  { name: "Neural Edge Laptop", reason: "The definitive choice for high-performance computing on the go, often favored by gaming enthusiasts." },
  { name: "Quantum Buds Pro", reason: "Unmatched neural noise cancellation for an immersive audio experience in any environment." },
  { name: "Titan GPU 5090", reason: "The pinnacle of graphical processing for the most demanding rendering and gaming workloads." }
];

// Simple in-memory cache for recommendations to reduce API hits
let recommendationCache: any = null;
let lastCacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

// Cooling down state to avoid hitting API when quota is exhausted
let coolingDownUntil = 0;

// Helper to check for quota or service availability errors
const isOverloadedError = (error: any) => {
  if (!error) return false;

  // Check for status codes in various formats
  const code = error.status || error.code || error.error?.code;
  if (code === 429 || code === 503) return true;
  
  // Check message strings
  const msg = (error.message || (typeof error === 'string' ? error : '')).toLowerCase();
  const apiMsg = (error.error?.message || "").toLowerCase();
  
  const keywords = ["quota", "resource_exhausted", "429", "503", "unavailable", "high demand", "overloaded", "spikes in demand"];
  
  if (keywords.some(k => msg.includes(k) || apiMsg.includes(k))) return true;

  // Deep check in structured error
  try {
    const stringified = JSON.stringify(error).toLowerCase();
    if (keywords.some(k => stringified.includes(k))) return true;
  } catch (e) {
    // ignore stringify errors
  }

  return false;
};

console.log("Starting server process...");

// API Routes
app.get("/api/health", (req, res) => {
  return res.json({ status: "ok", time: new Date().toISOString() });
});

app.post("/api/ai/recommend", async (req, res) => {
  console.log("Received recommendation request");
  try {
    const { history, preferences } = req.body;
    
    // Check if we are in cooling down period
    const now = Date.now();
    if (now < coolingDownUntil) {
      console.log("AI is cooling down due to previous quota hit. Serving fallback.");
      return res.json(recommendationCache || FALLBACK_RECOMMENDATIONS);
    }

    // Check cache
    if (recommendationCache && (now - lastCacheTime < CACHE_TTL)) {
      console.log("Serving recommendations from cache");
      return res.json(recommendationCache);
    }

    const ai = getAi();
    if (!ai) {
      console.warn("AI Client initialization failed. Using fallbacks.");
      return res.json(FALLBACK_RECOMMENDATIONS);
    }

    try {
      console.log("Calling Gemini API with model:", geminiModel);
      const response = await ai.models.generateContent({
        model: geminiModel,
        contents: `User preference: ${preferences}. History: ${JSON.stringify(history)}. Recommend 3 premium gadgets with names and brief reasons. Format: JSON array of objects with 'name' and 'reason'.`,
        config: {
          responseMimeType: "application/json",
        }
      });
      
      const text = response.text || "[]";
      console.log("Gemini response text received");
      try {
        const parsed = JSON.parse(text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          recommendationCache = parsed;
          lastCacheTime = now;
          return res.json(parsed);
        }
        console.warn("Gemini returned empty or invalid array structure");
        return res.json(FALLBACK_RECOMMENDATIONS);
      } catch (parseError) {
        console.error("JSON Parse Error from AI");
        return res.json(FALLBACK_RECOMMENDATIONS);
      }
    } catch (apiError: any) {
      if (isOverloadedError(apiError)) {
        console.warn("AI Recommendation Overloaded. Activating 60s cool-down.");
        coolingDownUntil = Date.now() + 60000; // 1 minute cool-down
        return res.json(recommendationCache || FALLBACK_RECOMMENDATIONS);
      }
      console.error("Gemini API Error:", apiError.message || "Unknown API Error");
      return res.json(recommendationCache || FALLBACK_RECOMMENDATIONS);
    }
  } catch (error: any) {
    console.error("AI Recommendation Global Error:", error);
    return res.json(recommendationCache || FALLBACK_RECOMMENDATIONS);
  }
});

app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history } = req.body;

    const now = Date.now();
    if (now < coolingDownUntil) {
      return res.json({ 
        reply: "System notice: Our neural link is currently cooling down after high usage. Please try again in about a minute!" 
      });
    }

    const ai = getAi();
    if (!ai) {
        return res.json({ reply: "Our neural link is currently offline (Missing API Key). Please try again later." });
    }
    const chat = ai.chats.create({
      model: geminiModel,
      config: {
        systemInstruction: "You are the AI Assistant for Faysal Gadgets Hub, a premium futuristic gadget store. Be helpful, professional, and slightly futuristic in your tone. Help users find products, track orders, or answer specs questions.",
      }
    });

    const result = await chat.sendMessage({ message });
    res.json({ reply: result.text });
  } catch (error: any) {
    if (isOverloadedError(error)) {
      console.warn("AI Chat Overloaded. Activating 60s cool-down.");
      coolingDownUntil = Date.now() + 60000;
      return res.json({ 
        reply: "System notice: Our neural link is currently under heavy load or high demand. I've activated a short protocol cool-down. Please try again in about a minute!" 
      });
    }
    console.error("AI Chat Error:", error.message || "Unknown error");
    res.status(500).json({ error: "Failed to chat" });
  }
});

// Vite middleware for development
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully started and listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("CRITICAL: Server failed to start:", err);
  process.exit(1);
});
