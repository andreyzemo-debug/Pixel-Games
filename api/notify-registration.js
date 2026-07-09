const https = require("https");

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const {
      username,
      email,
      country,
      registeredAt,
      userId,
      browser,
      os,
      accountType,
    } = req.body || {};

    const body = JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      text: [
        "👤 <b>New User Registered</b>",
        `Username: ${escapeHtml(username || "N/A")}`,
        `Email: ${escapeHtml(email || "N/A")}`,
        `Country: ${escapeHtml(country || "Not set")}`,
        `Date: ${escapeHtml(registeredAt || "N/A")}`,
        `User ID: ${escapeHtml(userId || "N/A")}`,
        `Browser: ${escapeHtml(browser || "Unknown")}`,
        `OS: ${escapeHtml(os || "Unknown")}`,
        `Account: ${escapeHtml(accountType || "Free")}`,
      ].join("\n"),
    });

    const options = {
      hostname: "api.telegram.org",
      path: `/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const response = await new Promise((resolve, reject) => {
      const request = https.request(options, (telegramRes) => {
        let data = "";

        telegramRes.on("data", (chunk) => (data += chunk));

        telegramRes.on("end", () => {
          if (telegramRes.statusCode >= 200 && telegramRes.statusCode < 300) {
            resolve(data);
          } else {
            reject(data);
          }
        });
      });

      request.on("error", reject);
      request.write(body);
      request.end();
    });

    res.status(200).json({
      ok: true,
      telegram: JSON.parse(response),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      ok: false,
      error: err.toString(),
    });
  }
};