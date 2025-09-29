import express from "express";
import { generateWithGemini } from "../utils/geminiClient.js";
const router = express.Router();

/**
 * POST /api/recommendations
 * body: { todos: [ { _id, title, description, estimatedMinutes, priority, subject, dueDate } ], preferences?: { dailyStudyMinutes: 120 } }
 */
router.post("/", async (req, res) => {
  try {
    const { todos = [], preferences = {} } = req.body;

    // Build a clean prompt that asks Gemini to return JSON only.
    const prompt = buildPrompt(todos, preferences);

    const text = await generateWithGemini(prompt, "gemini-2.5-flash", 0);

    // Try to extract JSON out of the model text (in case model wrapped it)
    const parsed = tryParseJsonFromText(text);

    res.json({ raw: text, parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate recommendations", details: err?.message });
  }
});

/* helper: builds the prompt asking Gemini for a JSON response */
function buildPrompt(todos, preferences) {
  return `
You are a helpful study-planner assistant. Input: a JSON array named "todos" where each item has id, title, description, subject, estimatedMinutes, priority (1-5), dueDate.
Also consider user preferences: ${JSON.stringify(preferences)}.

Produce a JSON array of objects, one per todo, with EXACTLY this schema (no other keys):
[
  {
    "id": "<id>",
    "title": "<title>",
    "recommendedMinutes": 60,
    "priorityScore": 1-5,
    "studyTechnique": "<e.g. Pomodoro / Active Recall / Spaced Repetition>",
    "resources": ["URL or short suggestion"],
    "scheduledSlot": "e.g., Today 6-7pm or Mon 09:00-10:00",
    "notes": "short concise note"
  },
  ...
]

Rules:
- RETURN ONLY JSON (no prose).
- Keep arrays & values valid JSON.
- If you can't estimate, put null for that field.
- Keep results concise.
Input todos:
${JSON.stringify(todos, null, 2)}
  `;
}

/* helper: try to pull a JSON object/array out of free-form text */
function tryParseJsonFromText(text) {
  // find the first `{...}` or `[...]` block and parse it
  const jsonMatch = text.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
  if (!jsonMatch) return null;
  try {
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    return null;
  }
}

export default router;
