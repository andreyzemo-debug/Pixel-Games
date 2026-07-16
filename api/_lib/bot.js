/* ============================================================
   Pixel&Games — Telegram bot logic
   Imported by api/telegram-webhook.js. Handles every incoming
   message/callback_query and talks to Telegram + the Sheet
   through the two sibling modules in this folder.
   ============================================================ */

const crypto = require("crypto");
const TG = require("./telegram");
const Sheets = require("./sheets");

const ADMIN_ID = String(process.env.TELEGRAM_ADMIN_ID || "");
const SITE_URL = process.env.SITE_URL || "https://pixelandgames.example.com";
const SITE_PUBLIC_URL = process.env.SITE_PUBLIC_URL || SITE_URL;
const SUPPORT_CONTACT = process.env.SUPPORT_TELEGRAM_USERNAME || "";
const ADMIN_LOGIN_TOKEN_TTL_MS = 60 * 1000; // 60 seconds, single use

/* ------------------------------------------------------------
   News — edit this array to publish new posts. Newest first.
   ------------------------------------------------------------ */
const NEWS = [
  {
    date: "2026-07-01",
    title: "🎉 Welcome to the Pixel&Games bot!",
    body: "The official assistant is live — check your profile, claim daily coins, and track achievements right here in Telegram.",
  },
  {
    date: "2026-06-15",
    title: "🛍 Store updates rolling out",
    body: "New titles are being added to the Pixel&Games library regularly. Open the website to browse the latest arrivals.",
  },
];

/* ------------------------------------------------------------
   i18n — small set of user-facing strings. Falls back to EN.
   ------------------------------------------------------------ */
const STR = {
  en: {
    welcomeGuest:
      "🎮 <b>Welcome to Pixel&Games!</b>\n\nHello!\n\nWe're happy to welcome you to the Pixel&Games community.\n\nThis bot lets you:\n🎮 Play\n📰 Read news\n🎁 Receive rewards\n🏆 View achievements\n💬 Contact support\n🌐 Visit our website\n\nAlready have an account on the site? Send:\n<code>/link your@email.com</code>\n(the email or ID you registered with) to unlock your Profile, Daily Gift and Achievements here.\n\nHave fun!",
    welcomeBack: (u) =>
      `👋 <b>Welcome back, ${esc(u.username || "player")}!</b>\n\n` +
      `Account Type: ${esc(u.account || "Free")}\n` +
      `🪙 Coins: ${u.coins}\n` +
      `🏆 Achievements: ${countAchievements(u)}/4\n` +
      `📅 Registered: ${esc(u.date || "N/A")}\n` +
      `🌍 Country: ${esc(u.country || "N/A")}`,
    welcomeAdmin:
      "🛠 <b>Welcome back, Administrator.</b>\n\nUse the menu below, or tap 🛠 Admin Panel for statistics, user data and broadcast tools.",
    notLinked:
      "This section is for linked accounts. Send:\n<code>/link your@email.com</code>\n(the email or ID you used to register on the site) to connect your Pixel&Games account.",
    linkUsage: "Usage: <code>/link your@email.com</code> — send the email or numeric ID you used to register on the site.",
    linkNotFound: "I couldn't find a Pixel&Games account matching that. Double-check the email or ID you registered with.",
    linkSuccess: (u) => `✅ Linked! Welcome, <b>${esc(u.username || "player")}</b>. Your Profile, Daily Gift and Achievements are now unlocked.`,
    profileTitle: "👤 <b>Profile</b>",
    giftAlready: "🎁 You've already claimed today's gift. Come back tomorrow!",
    giftClaimed: (r) => `🎁 <b>+${r.reward} coins!</b>${r.bonus ? ` (includes a ${r.bonus} streak bonus 🔥)` : ""}\n\nTotal balance: <b>${r.totalCoins}</b> coins\nClaims so far: ${r.claims}`,
    supportUsage: "Usage: <code>/support your message here</code> — it goes straight to our team.",
    supportSent: "✅ Your message was sent to our support team. We'll get back to you as soon as we can.",
    settingsTitle: "⚙️ <b>Settings</b>",
  },
  ru: {
    welcomeGuest:
      "🎮 <b>Добро пожаловать в Pixel&Games!</b>\n\nПривет!\n\nМы рады видеть вас в сообществе Pixel&Games.\n\nЭтот бот позволяет:\n🎮 Играть\n📰 Читать новости\n🎁 Получать награды\n🏆 Смотреть достижения\n💬 Связаться с поддержкой\n🌐 Перейти на сайт\n\nУже есть аккаунт на сайте? Отправьте:\n<code>/link your@email.com</code>\n(почта или ID, указанные при регистрации), чтобы открыть Профиль, Ежедневный подарок и Достижения здесь.\n\nПриятной игры!",
    welcomeBack: (u) =>
      `👋 <b>С возвращением, ${esc(u.username || "игрок")}!</b>\n\n` +
      `Тип аккаунта: ${esc(u.account || "Free")}\n` +
      `🪙 Монеты: ${u.coins}\n` +
      `🏆 Достижения: ${countAchievements(u)}/4\n` +
      `📅 Регистрация: ${esc(u.date || "N/A")}\n` +
      `🌍 Страна: ${esc(u.country || "N/A")}`,
    welcomeAdmin:
      "🛠 <b>С возвращением, администратор.</b>\n\nИспользуйте меню ниже или откройте 🛠 Admin Panel для статистики и рассылок.",
    notLinked:
      "Этот раздел доступен только для привязанных аккаунтов. Отправьте:\n<code>/link your@email.com</code>\n(почта или ID при регистрации на сайте), чтобы привязать аккаунт.",
    linkUsage: "Использование: <code>/link your@email.com</code> — укажите почту или числовой ID, указанные при регистрации на сайте.",
    linkNotFound: "Не удалось найти аккаунт Pixel&Games с такими данными. Проверьте почту или ID.",
    linkSuccess: (u) => `✅ Аккаунт привязан! Добро пожаловать, <b>${esc(u.username || "игрок")}</b>. Профиль, Подарок и Достижения открыты.`,
    profileTitle: "👤 <b>Профиль</b>",
    giftAlready: "🎁 Вы уже получили подарок сегодня. Возвращайтесь завтра!",
    giftClaimed: (r) => `🎁 <b>+${r.reward} монет!</b>${r.bonus ? ` (включая бонус серии +${r.bonus} 🔥)` : ""}\n\nБаланс: <b>${r.totalCoins}</b> монет\nВсего получено: ${r.claims}`,
    supportUsage: "Использование: <code>/support ваш вопрос</code> — сообщение уйдёт напрямую нашей команде.",
    supportSent: "✅ Сообщение отправлено в поддержку. Мы ответим как можно скорее.",
    settingsTitle: "⚙️ <b>Настройки</b>",
  },
  uz: {
    welcomeGuest:
      "🎮 <b>Pixel&Games'ga xush kelibsiz!</b>\n\nSalom!\n\nPixel&Games jamoasiga xush kelibsiz.\n\nBu bot orqali siz:\n🎮 O'ynashingiz\n📰 Yangiliklarni o'qishingiz\n🎁 Sovg'a olishingiz\n🏆 Yutuqlaringizni ko'rishingiz\n💬 Qo'llab-quvvatlash bilan bog'lanishingiz\n🌐 Saytga o'tishingiz mumkin\n\nSaytda akkountingiz bormi? Yuboring:\n<code>/link your@email.com</code>\n(ro'yxatdan o'tgan email yoki ID), Profil, Kunlik sovg'a va Yutuqlarni ochish uchun.\n\nYaxshi o'yin!",
    welcomeBack: (u) =>
      `👋 <b>Xush kelibsiz, ${esc(u.username || "o'yinchi")}!</b>\n\n` +
      `Akkount turi: ${esc(u.account || "Free")}\n` +
      `🪙 Tangalar: ${u.coins}\n` +
      `🏆 Yutuqlar: ${countAchievements(u)}/4\n` +
      `📅 Ro'yxatdan o'tgan: ${esc(u.date || "N/A")}\n` +
      `🌍 Davlat: ${esc(u.country || "N/A")}`,
    welcomeAdmin:
      "🛠 <b>Xush kelibsiz, Administrator.</b>\n\nPastdagi menyudan foydalaning yoki statistikalar uchun 🛠 Admin Panel tugmasini bosing.",
    notLinked:
      "Bu bo'lim faqat bog'langan akkountlar uchun. Yuboring:\n<code>/link your@email.com</code>\n(saytda ro'yxatdan o'tgan email yoki ID) akkountingizni bog'lash uchun.",
    linkUsage: "Foydalanish: <code>/link your@email.com</code> — saytda ro'yxatdan o'tgan email yoki raqamli ID yuboring.",
    linkNotFound: "Bunday ma'lumotlar bilan Pixel&Games akkounti topilmadi. Email yoki ID'ni tekshiring.",
    linkSuccess: (u) => `✅ Bog'landi! Xush kelibsiz, <b>${esc(u.username || "o'yinchi")}</b>. Profil, Sovg'a va Yutuqlar endi ochiq.`,
    profileTitle: "👤 <b>Profil</b>",
    giftAlready: "🎁 Bugungi sovg'ani allaqachon oldingiz. Ertaga qayting!",
    giftClaimed: (r) => `🎁 <b>+${r.reward} tanga!</b>${r.bonus ? ` (${r.bonus} seriya bonusi bilan 🔥)` : ""}\n\nJami balans: <b>${r.totalCoins}</b> tanga\nOlingan sovg'alar: ${r.claims}`,
    supportUsage: "Foydalanish: <code>/support xabaringiz</code> — bu to'g'ridan-to'g'ri jamoamizga yuboriladi.",
    supportSent: "✅ Xabaringiz qo'llab-quvvatlash jamoasiga yuborildi. Tez orada javob beramiz.",
    settingsTitle: "⚙️ <b>Sozlamalar</b>",
  },
};

function lang(from) {
  const code = (from && from.language_code) || "en";
  if (code.startsWith("ru")) return "ru";
  if (code.startsWith("uz")) return "uz";
  return "en";
}
function t(from) {
  return STR[lang(from)];
}

function esc(str) {
  return String(str == null ? "" : str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

function countAchievements(u) {
  let n = 1; // "Welcome Aboard" — granted the moment an account is linked
  if (String(u.account).toLowerCase() === "premium") n++;
  if (u.giftClaims >= 3) n++;
  if (u.giftClaims >= 7) n++;
  return n;
}

/* ------------------------------------------------------------
   Keyboards
   ------------------------------------------------------------ */
function mainKeyboard(isAdmin) {
  const rows = [
    ["🎮 Play", "📰 News"],
    ["🎁 Daily Gift", "👤 Profile"],
    ["🏆 Achievements", "💬 Support"],
    ["🌐 Website", "⚙️ Settings"],
  ];
  if (isAdmin) rows.push(["🛠 Admin Panel"]);
  return { keyboard: rows, resize_keyboard: true };
}

function adminInlineKeyboard() {
  return {
    inline_keyboard: [
      [{ text: "📊 Statistics", callback_data: "admin:stats" }, { text: "👥 Users", callback_data: "admin:users" }],
      [{ text: "👀 Visitors", callback_data: "admin:visitors" }, { text: "🟢 Online", callback_data: "admin:online" }],
      [{ text: "💰 Economy", callback_data: "admin:economy" }, { text: "🎮 Games", callback_data: "admin:games" }],
      [{ text: "🌍 Countries", callback_data: "admin:countries" }, { text: "📢 Broadcast", callback_data: "admin:broadcast" }],
      [{ text: "⚙️ Server Status", callback_data: "admin:server" }, { text: "🔄 Refresh", callback_data: "admin:refresh" }],
    ],
  };
}

function websiteInlineKeyboard(label) {
  return { inline_keyboard: [[{ text: label || "🌐 Open Website", url: SITE_URL }]] };
}

/* ------------------------------------------------------------
   Role / identity resolution
   ------------------------------------------------------------ */
async function resolveIdentity(from) {
  const id = String(from.id);
  if (ADMIN_ID && id === ADMIN_ID) {
    return { role: "Administrator", user: null };
  }
  const profile = await Sheets.telegramProfile(id);
  if (profile.ok) {
    const role = String(profile.user.account).toLowerCase() === "premium" ? "Premium" : "Player";
    return { role, user: profile.user };
  }
  return { role: "Guest", user: null };
}

/* ------------------------------------------------------------
   Command / button handlers
   ------------------------------------------------------------ */
async function handleStart(chatId, from) {
  const { role, user } = await resolveIdentity(from);
  const s = t(from);

  if (role === "Administrator") {
    await TG.sendMessage(chatId, s.welcomeAdmin, { reply_markup: mainKeyboard(true) });
    return;
  }
  if (user) {
    await TG.sendMessage(chatId, s.welcomeBack(user), { reply_markup: mainKeyboard(false) });
    return;
  }
  await TG.sendMessage(chatId, s.welcomeGuest, { reply_markup: mainKeyboard(false) });
}

async function handleLink(chatId, from, query) {
  const s = t(from);
  if (!query) {
    await TG.sendMessage(chatId, s.linkUsage);
    return;
  }
  const result = await Sheets.linkTelegram(String(from.id), query.trim());
  if (!result.ok) {
    await TG.sendMessage(chatId, s.linkNotFound);
    return;
  }
  await TG.sendMessage(chatId, s.linkSuccess(result.user), { reply_markup: mainKeyboard(String(from.id) === ADMIN_ID) });
}

async function handleProfile(chatId, from) {
  const s = t(from);
  const { role, user } = await resolveIdentity(from);
  if (role === "Guest") {
    await TG.sendMessage(chatId, s.notLinked);
    return;
  }
  const lines = [
    s.profileTitle,
    "",
    `Username: ${esc(user.username)}`,
    `Email: ${esc(user.email)}`,
    `Country: ${esc(user.country || "N/A")}`,
    `🪙 Coins: ${user.coins}`,
    `🏆 Achievements: ${countAchievements(user)}/4`,
    `📅 Registered: ${esc(user.date || "N/A")}`,
    `Account Type: ${esc(user.account || "Free")}`,
  ];
  await TG.sendMessage(chatId, lines.join("\n"));
}

async function handleAchievements(chatId, from) {
  const s = t(from);
  const { role, user } = await resolveIdentity(from);
  if (role === "Guest") {
    await TG.sendMessage(chatId, s.notLinked);
    return;
  }
  const items = [
    { name: "🎉 Welcome Aboard", unlocked: true },
    { name: "💎 Premium Member", unlocked: String(user.account).toLowerCase() === "premium" },
    { name: "🔥 Gift Streak (3 claims)", unlocked: user.giftClaims >= 3 },
    { name: "🕹️ Regular Player (7 claims)", unlocked: user.giftClaims >= 7 },
  ];
  const lines = ["🏆 <b>Achievements</b>", ""].concat(
    items.map((i) => `${i.unlocked ? "✅" : "⬜"} ${i.name}`)
  );
  await TG.sendMessage(chatId, lines.join("\n"));
}

async function handleDailyGift(chatId, from) {
  const s = t(from);
  const { role } = await resolveIdentity(from);
  if (role === "Guest") {
    await TG.sendMessage(chatId, s.notLinked);
    return;
  }
  const result = await Sheets.claimGift(String(from.id));
  if (!result.ok) {
    await TG.sendMessage(chatId, s.giftAlready);
    return;
  }
  await TG.sendMessage(chatId, s.giftClaimed(result));
}

async function handleNews(chatId, from) {
  const lines = ["📰 <b>Pixel&Games News</b>", ""];
  for (const item of NEWS.slice(0, 5)) {
    lines.push(`<b>${esc(item.title)}</b>`, `<i>${esc(item.date)}</i>`, esc(item.body), "");
  }
  await TG.sendMessage(chatId, lines.join("\n"));
}

async function handlePlay(chatId) {
  await TG.sendMessage(chatId, "🎮 Ready to play? Jump into the Pixel&Games library below.", {
    reply_markup: websiteInlineKeyboard("🎮 Open Store"),
  });
}

async function handleWebsite(chatId) {
  await TG.sendMessage(chatId, "🌐 Here's our website:", { reply_markup: websiteInlineKeyboard() });
}

async function handleSupportButton(chatId, from) {
  const s = t(from);
  const contactLine = SUPPORT_CONTACT ? `\n\nYou can also message ${esc(SUPPORT_CONTACT)} directly.` : "";
  await TG.sendMessage(chatId, `💬 ${s.supportUsage}${contactLine}`);
}

async function handleSupportCommand(chatId, from, message) {
  const s = t(from);
  if (!message) {
    await TG.sendMessage(chatId, s.supportUsage);
    return;
  }
  if (ADMIN_ID) {
    const who = from.username ? `@${from.username}` : from.first_name || "user";
    await TG.sendMessage(
      ADMIN_ID,
      `💬 <b>Support message</b>\nFrom: ${esc(who)} (ID: ${from.id})\n\n${esc(message)}`
    );
  }
  await TG.sendMessage(chatId, s.supportSent);
}

async function handleSettings(chatId, from) {
  const s = t(from);
  const { role, user } = await resolveIdentity(from);
  const linkLine = role === "Guest" ? "🔓 Not linked to a site account." : `🔗 Linked as ${esc(user.username)}`;
  const langNames = { en: "English", ru: "Русский", uz: "O'zbek" };
  const lines = [
    s.settingsTitle,
    "",
    `Language: ${langNames[lang(from)]} (auto-detected from Telegram)`,
    linkLine,
  ];
  const keyboard = { inline_keyboard: [[{ text: "🌐 Open Website", url: SITE_URL }]] };
  if (role === "Guest") {
    lines.push("", s.linkUsage);
  }
  await TG.sendMessage(chatId, lines.join("\n"), { reply_markup: keyboard });
}

/* ------------------------------------------------------------
   Admin panel
   ------------------------------------------------------------ */
async function requireAdmin(from) {
  return ADMIN_ID && String(from.id) === ADMIN_ID;
}

async function handleAdminPanelButton(chatId, from) {
  if (!(await requireAdmin(from))) return;
  await TG.sendMessage(chatId, "🛠 <b>Admin Panel</b>", { reply_markup: adminInlineKeyboard() });
}

/* ------------------------------------------------------------
   /admin — one-time Admin Panel login link
   ------------------------------------------------------------ */
async function handleAdminLoginCommand(chatId, from) {
  if (!(await requireAdmin(from))) {
    await TG.sendMessage(chatId, "⛔ Access denied.");
    return;
  }

  const token = crypto.randomBytes(32).toString("hex"); // 256-bit, single use
  const expiresAt = Date.now() + ADMIN_LOGIN_TOKEN_TTL_MS;

  const result = await Sheets.createAdminLoginToken(token, String(from.id), expiresAt, {
    name: from.first_name || from.username || "Admin",
    username: from.username || "",
  });

  if (!result.ok) {
    await TG.sendMessage(chatId, "⚠️ Couldn't generate a login link right now. Please try again in a moment.");
    return;
  }

  const loginUrl = `${SITE_PUBLIC_URL.replace(/\/$/, "")}/admin-panel/login.html?token=${token}`;

  await TG.sendMessage(
    chatId,
    "🛠 <b>Admin login link ready.</b>\n\nExpires in 60 seconds and works only once.",
    { reply_markup: { inline_keyboard: [[{ text: "🛠 Open Admin Panel", url: loginUrl }]] } }
  );
}

async function renderAdminSection(section) {
  switch (section) {
    case "stats": {
      const s = await Sheets.stats();
      if (!s.ok) return "⚠️ Couldn't load statistics right now.";
      return [
        "📊 <b>Statistics</b>",
        "",
        `Users: ${s.totalUsers} (Premium: ${s.premiumUsers}, Free: ${s.freeUsers})`,
        `Linked to bot: ${s.linkedUsers}`,
        `Visitors (all time): ${s.totalVisitors}`,
        `Today's users: ${s.todayUsers}`,
        `Today's visitors: ${s.todayVisitors}`,
        `Online now (~15 min): ${s.onlineNow}`,
        `Top country: ${esc(s.topCountry)}`,
        `Top browser: ${esc(s.topBrowser)}`,
        `Top OS: ${esc(s.topOS)}`,
      ].join("\n");
    }
    case "users": {
      const r = await Sheets.recentUsers(10);
      if (!r.ok) return "⚠️ Couldn't load users right now.";
      const lines = ["👥 <b>Recent Users</b>", ""];
      r.users.forEach((u) =>
        lines.push(`• ${esc(u.username)} (${esc(u.account)}) — ${esc(u.country || "?")} — ${esc(u.date)}`)
      );
      return lines.join("\n") || "No users yet.";
    }
    case "visitors": {
      const r = await Sheets.recentVisitors(10);
      if (!r.ok) return "⚠️ Couldn't load visitors right now.";
      const lines = ["👀 <b>Recent Visitors</b>", ""];
      r.visitors.forEach((v) =>
        lines.push(`• ${esc(v.country || "?")}, ${esc(v.city || "?")} — ${esc(v.browser)}/${esc(v.os)} — ${esc(v.date)} ${esc(v.time)}`)
      );
      return lines.join("\n") || "No visitors logged yet.";
    }
    case "online": {
      const s = await Sheets.stats();
      if (!s.ok) return "⚠️ Couldn't load stats right now.";
      return `🟢 <b>Online now</b>\n\n~${s.onlineNow} visitor(s) active in the last 15 minutes.\n\n<i>Approximate — based on visit timestamps, not live sessions.</i>`;
    }
    case "economy": {
      const e = await Sheets.economy();
      if (!e.ok) return "⚠️ Couldn't load economy stats right now.";
      return [
        "💰 <b>Bot Economy</b>",
        "",
        `Linked players: ${e.linkedUsers}`,
        `Total coins in circulation: ${e.totalCoins}`,
        `Total gifts claimed: ${e.totalClaims}`,
        `Average balance: ${e.avgCoins} coins`,
      ].join("\n");
    }
    case "games": {
      const s = await Sheets.stats();
      if (!s.ok) return "⚠️ Couldn't load account data right now.";
      const rate = s.totalUsers > 0 ? ((s.premiumUsers / s.totalUsers) * 100).toFixed(1) : "0.0";
      return [
        "🎮 <b>Games & Accounts</b>",
        "",
        `Free accounts: ${s.freeUsers}`,
        `Premium accounts: ${s.premiumUsers}`,
        `Premium conversion rate: ${rate}%`,
        "",
        "<i>Per-game analytics aren't tracked server-side yet — this reflects account data only.</i>",
      ].join("\n");
    }
    case "countries": {
      const c = await Sheets.countries();
      if (!c.ok) return "⚠️ Couldn't load country data right now.";
      const lines = ["🌍 <b>Top Countries</b>", ""];
      c.countries.forEach((row, i) => lines.push(`${i + 1}. ${esc(row.country)} — ${row.count}`));
      return lines.join("\n") || "No visitor data yet.";
    }
    case "server": {
      const [sheetsPing, siteOk] = await Promise.all([Sheets.ping(), pingSite()]);
      return [
        "⚙️ <b>Server Status</b>",
        "",
        "Telegram: ✅ Online",
        `Google Sheets: ${sheetsPing.ok ? "✅ Online" : "❌ Unreachable"}`,
        `Website: ${siteOk ? "✅ Online" : "❌ Unreachable"}`,
        "API: ✅ Online",
      ].join("\n");
    }
    default:
      return "Unknown section.";
  }
}

async function pingSite() {
  try {
    const res = await fetch(SITE_URL, { method: "HEAD" });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

async function handleAdminCallback(chatId, messageId, from, action) {
  if (!(await requireAdmin(from))) return;

  if (action === "broadcast") {
    const pending = await Sheets.getPendingBroadcast();
    let data = null;
    if (pending.ok) {
      try {
        data = JSON.parse(pending.value);
      } catch {
        data = null;
      }
    }
    if (data) {
      await TG.editMessageText(
        chatId,
        messageId,
        `📢 <b>Pending broadcast</b>\n\n${esc(data.text)}\n\nSend it to all linked players?`,
        {
          reply_markup: {
            inline_keyboard: [
              [{ text: "✅ Confirm", callback_data: "bc:confirm" }, { text: "❌ Cancel", callback_data: "bc:cancel" }],
              [{ text: "⬅️ Back", callback_data: "admin:back" }],
            ],
          },
        }
      );
    } else {
      await TG.editMessageText(
        chatId,
        messageId,
        "📢 <b>Broadcast</b>\n\nTo send a message to every linked player, use:\n<code>/broadcast Your message here</code>\n\nYou'll get a confirmation step before anything is sent.",
        { reply_markup: { inline_keyboard: [[{ text: "⬅️ Back", callback_data: "admin:back" }]] } }
      );
    }
    return;
  }

  if (action === "back") {
    await TG.editMessageText(chatId, messageId, "🛠 <b>Admin Panel</b>", { reply_markup: adminInlineKeyboard() });
    return;
  }

  if (action === "refresh") {
    const text = await renderAdminSection("stats");
    await TG.editMessageText(chatId, messageId, text, {
      reply_markup: { inline_keyboard: [[{ text: "⬅️ Back", callback_data: "admin:back" }]] },
    });
    return;
  }

  const text = await renderAdminSection(action);
  await TG.editMessageText(chatId, messageId, text, {
    reply_markup: { inline_keyboard: [[{ text: "⬅️ Back", callback_data: "admin:back" }]] },
  });
}

async function handleBroadcastCommand(chatId, from, message) {
  if (!(await requireAdmin(from))) return;
  if (!message) {
    await TG.sendMessage(chatId, "Usage: <code>/broadcast Your message here</code>");
    return;
  }
  await Sheets.setPendingBroadcast(String(from.id), message);
  await TG.sendMessage(chatId, `📢 <b>Preview</b>\n\n${esc(message)}\n\nSend it to all linked players?`, {
    reply_markup: {
      inline_keyboard: [[{ text: "✅ Confirm", callback_data: "bc:confirm" }, { text: "❌ Cancel", callback_data: "bc:cancel" }]],
    },
  });
}

async function handleBroadcastCallback(chatId, messageId, from, decision) {
  if (!(await requireAdmin(from))) return;

  const pending = await Sheets.getPendingBroadcast();
  if (!pending.ok) {
    await TG.editMessageText(chatId, messageId, "⚠️ No pending broadcast found (it may have expired).");
    return;
  }
  let data;
  try {
    data = JSON.parse(pending.value);
  } catch {
    await TG.editMessageText(chatId, messageId, "⚠️ The pending broadcast was corrupted. Please start a new one with /broadcast.");
    await Sheets.clearPendingBroadcast();
    return;
  }

  if (decision === "cancel") {
    await Sheets.clearPendingBroadcast();
    await TG.editMessageText(chatId, messageId, "❌ Broadcast cancelled.");
    return;
  }

  const idsRes = await Sheets.allTelegramIds();
  const ids = idsRes.ok ? idsRes.ids : [];
  await Sheets.clearPendingBroadcast();

  let sent = 0;
  const cap = 200; // stay well within a single serverless invocation
  for (const id of ids.slice(0, cap)) {
    try {
      await TG.sendMessage(id, `📢 <b>Pixel&Games</b>\n\n${esc(data.text)}`);
      sent++;
    } catch {
      // skip failures (blocked bot, invalid chat, etc.)
    }
  }
  await TG.editMessageText(
    chatId,
    messageId,
    `✅ Broadcast sent to ${sent}/${ids.length} linked player(s).${ids.length > cap ? `\n\n(Capped at ${cap} per send — run it again to reach the rest.)` : ""}`
  );
}

/* ------------------------------------------------------------
   Router
   ------------------------------------------------------------ */
async function handleUpdate(update) {
  if (update.callback_query) {
    return handleCallbackQuery(update.callback_query);
  }
  if (update.message) {
    return handleMessage(update.message);
  }
}

async function handleCallbackQuery(cq) {
  const chatId = cq.message.chat.id;
  const messageId = cq.message.message_id;
  const from = cq.from;
  const data = cq.data || "";

  await TG.answerCallbackQuery(cq.id);

  if (data.startsWith("admin:")) {
    await handleAdminCallback(chatId, messageId, from, data.slice("admin:".length));
    return;
  }
  if (data === "bc:confirm") return handleBroadcastCallback(chatId, messageId, from, "confirm");
  if (data === "bc:cancel") return handleBroadcastCallback(chatId, messageId, from, "cancel");
}

async function handleMessage(message) {
  const chatId = message.chat.id;
  const from = message.from;
  const text = (message.text || "").trim();
  if (!text) return;

  if (text.startsWith("/start")) return handleStart(chatId, from);
  if (text.startsWith("/admin")) return handleAdminLoginCommand(chatId, from);
  if (text.startsWith("/link")) return handleLink(chatId, from, text.slice(5).trim());
  if (text.startsWith("/support")) return handleSupportCommand(chatId, from, text.slice(8).trim());
  if (text.startsWith("/broadcast")) return handleBroadcastCommand(chatId, from, text.slice(10).trim());

  switch (text) {
    case "🎮 Play":
      return handlePlay(chatId);
    case "📰 News":
      return handleNews(chatId, from);
    case "🎁 Daily Gift":
      return handleDailyGift(chatId, from);
    case "👤 Profile":
      return handleProfile(chatId, from);
    case "🏆 Achievements":
      return handleAchievements(chatId, from);
    case "💬 Support":
      return handleSupportButton(chatId, from);
    case "🌐 Website":
      return handleWebsite(chatId);
    case "⚙️ Settings":
      return handleSettings(chatId, from);
    case "🛠 Admin Panel":
      return handleAdminPanelButton(chatId, from);
    default:
      return; // unrecognized free text — stay quiet rather than guess
  }
}

module.exports = { handleUpdate };