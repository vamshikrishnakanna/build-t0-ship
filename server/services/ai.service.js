/**
 * server/services/ai.service.js
 * Encapsulates all Google Gemini AI interactions.
 * This is the ONLY file that communicates with the Gemini API.
 * The GEMINI_API_KEY is never exposed to the frontend.
 */

import { getAIClient, GEMINI_MODEL, AGRONOMY_SYSTEM_INSTRUCTION } from '../config/ai.js';

/**
 * The strict JSON schema enforced on every Gemini response.
 * This ensures the model returns structured, predictable data.
 */
const advisoryResponseSchema = {
  type: 'object',
  properties: {
    recommended_crops: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          crop_name: { type: 'string' },
          suitability_score: {
            type: 'integer',
            description: 'Crop suitability score out of 100',
          },
          expected_yield_per_acre: { type: 'string' },
          reasoning: { type: 'string' },
        },
        required: ['crop_name', 'suitability_score', 'expected_yield_per_acre', 'reasoning'],
      },
      minItems: 1,
      maxItems: 3,
    },
    fertilizer_schedule: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          phase: { type: 'string' },
          action: { type: 'string' },
        },
        required: ['phase', 'action'],
      },
      minItems: 1,
    },
    pest_risks: {
      type: 'array',
      items: { type: 'string' },
      minItems: 1,
    },
  },
  required: ['recommended_crops', 'fertilizer_schedule', 'pest_risks'],
};

/**
 * Builds the detailed agronomic prompt from farm data.
 * @param {object} farm - Farm profile from the database.
 * @param {string} season - Target growing season.
 * @param {string} budgetTier - Budget tier: Low, Medium, or High.
 * @returns {string} The full prompt string.
 */
function buildPrompt(farm, season, budgetTier) {
  return `Generate a comprehensive crop advisory for a farm located in ${farm.location}. The soil is ${farm.soil_type} with a pH of ${farm.ph_level}. Irrigation is ${farm.irrigation_type}. The target season is ${season} with a ${budgetTier} budget tier. Provide the top 3 optimal crops, a fertilizer schedule, and pest risks.

**Farm Details:**
- Farm Name: ${farm.name}
- Location: ${farm.location}
- Soil Type: ${farm.soil_type}
- Soil pH Level: ${farm.ph_level}
- Irrigation Method: ${farm.irrigation_type}

**Planting Context:**
- Target Growing Season: ${season}
- Budget Per Acre: ${budgetTier}

**Required Output:**
Please provide exactly the top 3 most optimal crops for these conditions, a detailed fertilizer schedule with specific phases (Pre-planting, Planting, Growth, Harvest), and the primary pest risks and their management strategies.

Base your recommendations on:
1. Soil compatibility with the given pH and type
2. Seasonal suitability for the target region
3. Water requirements matching the irrigation method
4. Economic viability for the specified budget tier
5. Sustainable farming best practices`;
}

/**
 * Calls the Gemini API to generate a structured crop advisory.
 * @param {object} farm - Farm profile from the database.
 * @param {string} season - Target growing season.
 * @param {string} budgetTier - Budget tier.
 * @returns {Promise<object>} Parsed JSON advisory object.
 * @throws {Error} If the Gemini API call fails or returns invalid data.
 */
export async function generateAdvisory(farm, season, budgetTier) {
  const client = getAIClient();
  const prompt = buildPrompt(farm, season, budgetTier);

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: {
        systemInstruction: AGRONOMY_SYSTEM_INSTRUCTION,
        responseMimeType: 'application/json',
        responseSchema: advisoryResponseSchema,
        temperature: 0.4,   // Lower temperature for more consistent, factual output
        topP: 0.9,
        maxOutputTokens: 4096,
      },
    });

    const rawText = typeof response.text === 'function' ? response.text() : response.text;

    if (!rawText) {
      throw new Error('Gemini returned an empty response.');
    }

    // Parse the JSON response (Gemini returns a JSON string when responseMimeType is set)
    const parsed = JSON.parse(rawText);
    return parsed;
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new Error(`Failed to parse Gemini JSON response: ${err.message}`);
    }
    throw new Error(`Gemini API error: ${err.message}`);
  }
}
