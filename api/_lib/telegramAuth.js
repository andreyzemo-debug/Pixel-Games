const crypto = require("crypto");

function verifyTelegramLogin(data) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!botToken) return false;
  if (!data || !data.hash) return false;

  const receivedHash = data.hash;

  const checkString = Object.keys(data)
    .filter((key) => key !== "hash" && data[key] !== undefined)
    .sort()
    .map((key) => `${key}=${data[key]}`)
    .join("\n");

  const secretKey = crypto
    .createHash("sha256")
    .update(botToken)
    .digest();

  const calculatedHash = crypto
    .createHmac("sha256", secretKey)
    .update(checkString)
    .digest("hex");

  return calculatedHash === receivedHash;
}

module.exports = {
  verifyTelegramLogin,
};