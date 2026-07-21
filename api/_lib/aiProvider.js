/* ============================================================
   Pixel&Games — Gemini AI provider
   api/_lib/aiProvider.js
   ============================================================ */

const AI_API_KEY = process.env.AI_API_KEY || "";

const AI_MODEL =
  process.env.AI_MODEL || "gemini-2.5-flash";

function isConfigured() {
  return Boolean(AI_API_KEY);
}

/* ---- Google Gemini API ---- */
async function callGemini(systemPrompt, messages, maxTokens) {
  const url =
    `https://generativelanguage.googleapis.com/v1beta/models/` +
    `${AI_MODEL}:generateContent?key=${encodeURIComponent(AI_API_KEY)}`;

  const contents = messages.map((message) => ({
    role: message.role === "assistant" ? "model" : "user",
    parts: [{ text: String(message.content || "") }],
  }));

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      systemInstruction: {
        parts: [{ text: systemPrompt }],
      },
      contents,
      generationConfig: {
        maxOutputTokens: maxTokens || 400,
        temperature: 0.7,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => "");
    throw new Error(
      `Gemini API error ${res.status}: ${errText.slice(0, 300)}`
    );
  }

  const data = await res.json();

  const text = data?.candidates?.[0]?.content?.parts
    ?.map((part) => part.text || "")
    .join("")
    .trim();

  return text || "";
}

/**
 * complete({ systemPrompt, messages, maxTokens })
 *
 * messages:
 * [
 *   { role: "user", content: "..." },
 *   { role: "assistant", content: "..." }
 * ]
 */
async function complete({ systemPrompt, messages, maxTokens }) {
  if (!isConfigured()) {
    const err = new Error("AI_API_KEY is not configured on the server");
    err.code = "not_configured";
    throw err;
  }

  return callGemini(systemPrompt, messages, maxTokens);
}

module.exports = {
  complete,
  isConfigured,
  AI_PROVIDER: "gemini",
  AI_MODEL,
};