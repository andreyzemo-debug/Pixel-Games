/* ============================================================
   Telegram config — loaded from environment variables only.
   Never hardcode the Bot Token or Chat ID anywhere else.
   Create a `.env` file (copy from .env.example) next to this
   file and fill in your real values there.
   ============================================================ */
require('dotenv').config();

module.exports = {
  BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN || '',
  CHAT_ID: process.env.TELEGRAM_CHAT_ID || '',
  PORT: process.env.PORT || 3001,
};
