/**
 * server/config/ai.js
 * Initializes the Google Gemini AI client (server-side only).
 * The API key is NEVER sent to the frontend.
 */

import { GoogleGenAI } from '@google/genai';

/** Singleton Gemini client instance */
let _client = null;

/**
 * Returns the initialized GoogleGenAI client.
 * Lazily initialized on first call.
 * @returns {GoogleGenAI}
 */
export function getAIClient() {
  if (!_client) {
    _client = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return _client;
}

/** The Gemini model to use for all advisory generations */
export const GEMINI_MODEL = 'gemini-2.5-flash';

/**
 * System instruction injected into every Gemini request.
 * Constrains the model to agronomic advice only.
 */
export const AGRONOMY_SYSTEM_INSTRUCTION =
  'You are an expert Agronomist and Agricultural AI Assistant. Your primary function is to analyze soil and climate data to provide optimal crop recommendations, fertilizer schedules, and pest management strategies. You must prioritize sustainable farming practices, water conservation, and high-yield efficiency. Never provide advice outside the scope of agriculture.';
