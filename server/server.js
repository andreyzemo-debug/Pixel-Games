/* ============================================================
   Pixel&Games — Telegram Registration Notification Server
   ------------------------------------------------------------
   A tiny, single-purpose backend. Its only job is to receive a
   POST request from the frontend after a successful registration
   and forward a formatted message to a Telegram chat via the
   official Bot API, WITHOUT ever exposing the Bot Token to the
   browser.
   ============================================================ */

const express = require('express');
const cors = require('cors');
const https = require('https');
const config = require('./config');

const app = express();

app.use(cors());
app.use(express.json());

/* ------------------------------------------------------------
   Helpers
   ------------------------------------------------------------ */
function getClientIp(req){
  const fwd = req.headers['x-forwarded-for'];
  if(fwd) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || '';
}

function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function getJson(url){
  return new Promise((resolve, reject) => {
    https.get(url, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch(e){ reject(e); }
      });
    }).on('error', reject);
  });
}

function sendTelegramMessage(text){
  return new Promise((resolve, reject) => {
    if(!config.BOT_TOKEN || !config.CHAT_ID){
      reject(new Error('Telegram BOT_TOKEN or CHAT_ID is not configured. Check server/.env'));
      return;
    }
    const body = JSON.stringify({
      chat_id: config.CHAT_ID,
      text,
      parse_mode: 'HTML',
      disable_web_page_preview: true,
    });
    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${config.BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(body),
      },
    };
    const req = https.request(options, res => {
      let data = '';
      res.on('data', chunk => { data += chunk; });
      res.on('end', () => {
        if(res.statusCode >= 200 && res.statusCode < 300) resolve(data);
        else reject(new Error(`Telegram API responded ${res.statusCode}: ${data}`));
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

/* ------------------------------------------------------------
   Route
   ------------------------------------------------------------ */
app.post('/api/notify-registration', async (req, res) => {
  try{
    const {
      username, email, country, registeredAt,
      userId, browser, os, accountType,
    } = req.body || {};

    const ip = getClientIp(req);

    const lines = [
      '👤 <b>New User Registered</b>',
      `Username: ${escapeHtml(username || 'N/A')}`,
      `Email: ${escapeHtml(email || 'N/A')}`,
      `Country: ${escapeHtml(country || 'Not set')}`,
      `Date: ${escapeHtml(registeredAt || 'N/A')}`,
      `User ID: ${escapeHtml(userId != null && userId !== '' ? String(userId) : 'N/A')}`,
      `Browser: ${escapeHtml(browser || 'Unknown')}`,
      `OS: ${escapeHtml(os || 'Unknown')}`,
      `IP: ${escapeHtml(ip || 'N/A')}`,
      `Account: ${escapeHtml(accountType || 'Free')}`,
    ];

    await sendTelegramMessage(lines.join('\n'));
    res.json({ ok: true });
  }catch(err){
    // Registration on the frontend has already completed by the
    // time this runs, so we just log and report — nothing here
    // should ever cause the client to think registration failed.
    console.error('Telegram notify error:', err.message);
    res.status(200).json({ ok: false, error: 'notification_failed' });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

/* ------------------------------------------------------------
   Route: visit notification (mirrors api/notify-visit.js so the
   standalone server supports the same endpoints the frontend
   calls when NOT deployed on a serverless platform).
   ------------------------------------------------------------ */
app.post('/api/notify-visit', async (req, res) => {
  try{
    const ip = getClientIp(req);
    let geo = {};
    try { geo = await getJson(`https://ipwho.is/${ip}`); }
    catch(e){ geo = {}; }

    const message = [
      '👀 New Visitor',
      '',
      `🌍 Country: ${geo.country || 'Unknown'}`,
      `🏙 City: ${geo.city || 'Unknown'}`,
      `📍 Region: ${geo.region || 'Unknown'}`,
      '',
      `🌐 IP: ${ip || 'Unknown'}`,
      '',
      `💻 Browser: ${(req.body && req.body.browser) || 'Unknown'}`,
      `🖥 Platform: ${(req.body && req.body.platform) || 'Unknown'}`,
      '',
      `🕒 ${new Date().toLocaleString()}`,
    ].join('\n');
    await fetch("https://script.google.com/macros/s/AKfycbwGhPqhVsBM94TbBK5KDclFzGxW-3sALt_udomHgmXW1EeBvlDoR_OJTB8FyTGfu9Gs/exec", {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({
    type: "visitor",
    country: geo.country || "",
    city: geo.city || "",
    ip: ip || "",
    browser: (req.body && req.body.browser) || "",
    os: (req.body && req.body.platform) || "",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString()
  })
});
    await sendTelegramMessage(message);
    res.json({ ok: true });
  }catch(err){
    // Same fire-and-forget contract as /api/notify-registration:
    // never let a notification failure look like a site error.
    console.error('Visit notify error:', err.message);
    res.status(200).json({ ok: false, error: 'notification_failed' });
  }
});

app.listen(config.PORT, () => {
  console.log(`Telegram notification server listening on port ${config.PORT}`);
});
