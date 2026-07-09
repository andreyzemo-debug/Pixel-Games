const https = require("https");

function getJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));

        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function sendTelegram(text) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      chat_id: process.env.TELEGRAM_CHAT_ID,
      text,
    });

    const req = https.request(
      {
        hostname: "api.telegram.org",
        path: `/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";

        res.on("data", (chunk) => (data += chunk));

        res.on("end", () => {
          resolve(data);
        });
      },
    );

    req.on("error", reject);

    req.write(body);
    req.end();
  });
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.headers["x-real-ip"] ||
      "Unknown";

    const geo = await getJson(`https://ipwho.is/${ip}`);

    const message = `
👀 New Visitor

🌍 Country: ${geo.country || "Unknown"}
🏙 City: ${geo.city || "Unknown"}
📍 Region: ${geo.region || "Unknown"}

🌐 IP: ${ip}

💻 Browser:
${req.body.browser}

🖥 Platform:
${req.body.platform}

🕒 ${new Date().toLocaleString()}
`;

    await sendTelegram(message);

    return res.status(200).json({
      ok: true,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      ok: false,
      error: err.message,
    });
  }
};
