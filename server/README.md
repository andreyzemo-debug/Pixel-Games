# Pixel&Games — Telegram Registration Notifications (Backend)

This is a tiny, single-purpose Node.js/Express server. Its only job is to
receive a request from the site right after someone registers, and forward
a formatted message to your Telegram chat using your Bot Token.

The Bot Token **never** touches the browser — it lives only in this
server's `.env` file.

## 1. Create your Telegram bot

1. Open Telegram and message **@BotFather**.
2. Send `/newbot` and follow the prompts. You'll get a **Bot Token**
   that looks like `123456789:AAExampleTokenReplaceThisWithYourOwn`.
3. Start a chat with your new bot (send it any message, e.g. "hi") so it's
   allowed to message you back.
4. Find your **Chat ID**:
   - Open this URL in your browser (replace `<TOKEN>` with your real token):
     `https://api.telegram.org/bot<TOKEN>/getUpdates`
   - Look for `"chat":{"id": 123456789, ...}` in the response — that number
     is your Chat ID.

## 2. Install and configure

```bash
cd server
npm install
cp .env.example .env
```

Open `.env` and fill in your real `TELEGRAM_BOT_TOKEN` and
`TELEGRAM_CHAT_ID`.

## 3. Run the server

```bash
npm start
```

You should see:

```
Telegram notification server listening on port 3001
```

## 4. Point the frontend at it

In `app.js`, find this near the top:

```js
const TELEGRAM_NOTIFY_CONFIG = {
  endpoint: '/api/notify-registration',
};
```

The frontend currently uses a **relative** path, which works automatically
in two setups:

- **Deployed on Vercel (or similar serverless platform):** the files in
  `/api` (`notify-registration.js`, `notify-visit.js`) are picked up
  automatically as serverless functions at those same relative paths —
  no extra configuration needed, and this `server/` folder isn't required.
- **Served together with this Express server** (e.g. via a reverse proxy,
  or by serving the frontend from this same server/port): the relative
  path will resolve to this server's `/api/notify-registration` and
  `/api/notify-visit` routes automatically.

If you're running the frontend and this server on two **different**
origins/ports without a proxy (e.g. frontend on `http://localhost:5500`
and this server on `http://localhost:3001`), change `endpoint` to an
absolute URL instead, e.g. `http://localhost:3001/api/notify-registration`.

- To turn notifications off entirely, set `endpoint: ''`.

## Notes

- If the server is unreachable or misconfigured, registration on the site
  still completes normally — the notification call is fire-and-forget and
  never blocks or breaks the registration flow.
- The IP address in the notification is read from the incoming request on
  the server, so it will only be meaningful once this server is deployed
  behind a real network path (on `localhost` it will show `127.0.0.1` or
  `::1`).
- CORS is open by default (`cors()` with no options) so the frontend can
  call it from any origin. If you want to restrict it to your real domain,
  pass options to `cors({ origin: 'https://your-site.com' })` in
  `server.js`.
