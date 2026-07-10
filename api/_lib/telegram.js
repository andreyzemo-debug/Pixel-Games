/* ============================================================
   Pixel&Games — Telegram Bot API wrapper
   Small fetch-based helper around the official Bot API. No
   external dependencies, works in Vercel's Node runtime.
   ============================================================ */

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const API_BASE = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function callTelegram(method, payload) {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN is not configured");
  }
  const res = await fetch(`${API_BASE}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!data.ok) {
    console.error(`Telegram API ${method} failed:`, data);
  }
  return data;
}

function sendMessage(chatId, text, options = {}) {
  return callTelegram("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...options,
  });
}

function editMessageText(chatId, messageId, text, options = {}) {
  return callTelegram("editMessageText", {
    chat_id: chatId,
    message_id: messageId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
    ...options,
  });
}

function answerCallbackQuery(callbackQueryId, options = {}) {
  return callTelegram("answerCallbackQuery", {
    callback_query_id: callbackQueryId,
    ...options,
  });
}

function setWebhook(url, secretToken) {
  return callTelegram("setWebhook", {
    url,
    secret_token: secretToken,
    allowed_updates: ["message", "callback_query"],
  });
}

function getWebhookInfo() {
  return callTelegram("getWebhookInfo", {});
}

module.exports = {
  callTelegram,
  sendMessage,
  editMessageText,
  answerCallbackQuery,
  setWebhook,
  getWebhookInfo,
};