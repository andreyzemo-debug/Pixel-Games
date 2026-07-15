/* ============================================================
   Pixel&Games — Control Room
   js/pages.js — per-page data loading + rendering
   ============================================================ */

const Pages = {};
let currentAdmin = null;
let sessionSignedInAt = null;

/* ============================================================
   DASHBOARD
   ============================================================ */
Pages.dashboard = async function loadDashboard() {
  const statGrid = document.getElementById("statGrid");
  const audienceHost = document.getElementById("audienceChartHost");
  const botHost = document.getElementById("botStatusBox");
  const activityHost = document.getElementById("activityList");
  const signalsHost = document.getElementById("topSignalsBox");

  try {
    const data = await api(API.stats);
    renderStatCards(statGrid, data.stats, data.statsError);
    renderAudienceChart(audienceHost, data.stats);
    renderBotStatus(botHost, data.bot);
    renderActivity(activityHost, data.activity || []);
    renderTopSignals(signalsHost, data.stats);
    updateBotPulseChip(data.bot);
    stampLastUpdated();
  } catch (err) {
    statGrid.innerHTML = `<div class="empty-state">Couldn't load the dashboard: ${escapeHtml(err.message)}</div>`;
    botHost.innerHTML = `<div class="empty-state">Unavailable.</div>`;
    activityHost.innerHTML = `<div class="empty-state">Unavailable.</div>`;
    signalsHost.innerHTML = `<div class="empty-state">Unavailable.</div>`;
  }
};

function stampLastUpdated() {
  const chip = document.getElementById("lastUpdatedChip");
  if (!chip) return;
  const now = new Date();
  chip.textContent = `Live · updated ${now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

const STAT_CARD_DEFS = [
  { key: "totalUsers", label: "Total players", icon: "users" },
  { key: "premiumUsers", label: "Premium players", icon: "crown", cls: "cyan" },
  { key: "onlineNow", label: "Online right now", icon: "bolt", cls: "success" },
  { key: "totalVisitors", label: "Total visitors", icon: "eye" },
  { key: "todayUsers", label: "New today", icon: "spark", cls: "warning" },
  { key: "todayVisitors", label: "Visits today", icon: "trend" },
];

const CARD_ICONS = {
  users: '<path d="M4 20c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="10" cy="8" r="3.4" fill="none" stroke="currentColor" stroke-width="2"/>',
  crown: '<path d="M4 17h16l-1.4-8-4 3.2L12 6l-2.6 6.2-4-3.2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  bolt: '<path d="M13 3L5 13h5l-1 8 9-11h-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
  eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" fill="none" stroke="currentColor" stroke-width="1.8"/><circle cx="12" cy="12" r="2.8" fill="none" stroke="currentColor" stroke-width="1.8"/>',
  spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
  trend: '<path d="M4 16l5-5 4 4 7-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>',
};

function renderStatCards(host, stats, statsError) {
  if (!stats) {
    host.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">Stats unavailable${statsError ? `: ${escapeHtml(statsError)}` : ""}. Check GOOGLE_SHEETS_WEBAPP_URL.</div>`;
    return;
  }
  host.innerHTML = STAT_CARD_DEFS.map((def) => {
    const value = stats[def.key];
    return `
    <div class="stat-card ${def.cls || ""}">
      <div class="stat-card-top">
        <div class="stat-card-icon"><svg viewBox="0 0 24 24">${CARD_ICONS[def.icon]}</svg></div>
      </div>
      <div class="stat-card-value">${value == null ? "—" : formatNumber(value)}</div>
      <div class="stat-card-label">${escapeHtml(def.label)}</div>
    </div>`;
  }).join("");
}

function renderAudienceChart(host, stats) {
  if (!stats) { host.innerHTML = `<div class="empty-state">No data.</div>`; return; }
  const premium = Number(stats.premiumUsers) || 0;
  const free = Number(stats.freeUsers) || 0;
  const total = premium + free;
  host.innerHTML = Charts.donut(
    [
      { label: "Premium", value: premium, color: "var(--accent)" },
      { label: "Free", value: free, color: "var(--cyan)" },
    ],
    { centerValue: formatNumber(total), centerLabel: "players" }
  );
}

function renderBotStatus(host, bot) {
  if (!bot) { host.innerHTML = `<div class="empty-state">Unavailable.</div>`; return; }
  host.innerHTML = `
    <div class="bot-line ${bot.configured ? "ok" : "bad"}"><span class="b-dot"></span> Bot token ${bot.configured ? "configured" : "missing"}</div>
    <div class="bot-line ${bot.webhookSet ? "ok" : "bad"}"><span class="b-dot"></span> Webhook ${bot.webhookSet ? "connected" : "not set"} ${bot.webhookUrl ? `<code title="${escapeHtml(bot.webhookUrl)}">${escapeHtml(bot.webhookUrl)}</code>` : ""}</div>
    <div class="bot-line ${bot.pendingUpdateCount ? "bad" : "ok"}"><span class="b-dot"></span> Pending updates: ${bot.pendingUpdateCount ?? 0}</div>
    ${bot.lastErrorMessage ? `<div class="bot-line bad"><span class="b-dot"></span> Last error: <code title="${escapeHtml(bot.lastErrorMessage)}">${escapeHtml(bot.lastErrorMessage)}</code></div>` : ""}
  `;
}

function updateBotPulseChip(bot) {
  const chip = document.getElementById("botPulseChip");
  if (!chip) return;
  const label = chip.querySelector(".pulse-label");
  if (!bot) { chip.dataset.state = "unknown"; label.textContent = "Bot status"; return; }
  const online = bot.configured && bot.webhookSet;
  chip.dataset.state = online ? "online" : "offline";
  label.textContent = online ? "Bot online" : "Bot needs attention";
}

const ACTIVITY_ICON = { registration: "🎮", visit: "👣" };

function renderActivity(host, activity) {
  if (!activity.length) { host.innerHTML = `<div class="empty-state">Nothing yet.</div>`; return; }
  host.innerHTML = activity
    .map(
      (a) => `
    <div class="activity-row" data-type="${a.type}">
      <div class="activity-icon">${ACTIVITY_ICON[a.type] || "•"}</div>
      <div class="activity-text">
        <div class="activity-label">${escapeHtml(a.label || "—")}</div>
        <div class="activity-detail">${escapeHtml(a.detail || "")}</div>
      </div>
      <div class="activity-date">${escapeHtml(a.date || "")}</div>
    </div>`
    )
    .join("");
}

function renderTopSignals(host, stats) {
  if (!stats) { host.innerHTML = `<div class="empty-state">No data.</div>`; return; }
  const rows = [
    ["Top country", stats.topCountry],
    ["Top browser", stats.topBrowser],
    ["Top OS", stats.topOS],
    ["Linked to bot", stats.linkedUsers],
  ];
  host.innerHTML = rows
    .map(
      ([key, val]) => `
    <div class="signal-row">
      <span class="signal-key">${escapeHtml(key)}</span>
      <span class="signal-val">${val == null || val === "" ? "—" : escapeHtml(String(val))}</span>
    </div>`
    )
    .join("");
}

/* ============================================================
   ANALYTICS
   ============================================================ */
Pages.analytics = async function loadAnalytics() {
  const host = document.getElementById("analyticsGrid");
  host.innerHTML = `<div class="loading-state">Loading analytics…</div>`;
  try {
    const data = await api(API.stats);
    renderAnalytics(host, data.stats, data.bot, data.activity || []);
  } catch (err) {
    host.innerHTML = `<div class="empty-state">Couldn't load analytics: ${escapeHtml(err.message)}</div>`;
  }
};

function renderAnalytics(host, stats, bot, activity) {
  if (!stats) { host.innerHTML = `<div class="empty-state">Analytics unavailable.</div>`; return; }

  const premium = Number(stats.premiumUsers) || 0;
  const free = Number(stats.freeUsers) || 0;
  const registrations = activity.filter((a) => a.type === "registration").length;
  const visits = activity.filter((a) => a.type === "visit").length;

  host.innerHTML = `
    <div class="panel">
      <div class="panel-head"><h3>Plan mix</h3><span class="panel-sub">Premium vs. free players</span></div>
      ${Charts.donut(
        [
          { label: "Premium", value: premium, color: "var(--accent)" },
          { label: "Free", value: free, color: "var(--cyan)" },
        ],
        { centerValue: formatNumber(premium + free), centerLabel: "players" }
      )}
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Today vs. all-time</h3><span class="panel-sub">Growth pace</span></div>
      ${Charts.barList([
        { label: "New players today", value: stats.todayUsers || 0, max: stats.totalUsers || 1, color: "var(--accent)" },
        { label: "Visits today", value: stats.todayVisitors || 0, max: stats.totalVisitors || 1, color: "var(--cyan)" },
        { label: "Online right now", value: stats.onlineNow || 0, max: stats.totalUsers || 1, color: "var(--success)" },
      ])}
    </div>

    <div class="panel full">
      <div class="panel-head"><h3>Snapshot</h3><span class="panel-sub">Everything Google Sheets is reporting right now</span></div>
      <div class="chip-row">
        <div class="metric-chip"><div class="mc-label">Total players</div><div class="mc-value accent">${formatNumber(stats.totalUsers)}</div></div>
        <div class="metric-chip"><div class="mc-label">Total visitors</div><div class="mc-value cyan">${formatNumber(stats.totalVisitors)}</div></div>
        <div class="metric-chip"><div class="mc-label">Linked to bot</div><div class="mc-value">${formatNumber(stats.linkedUsers)}</div></div>
        <div class="metric-chip"><div class="mc-label">Online now</div><div class="mc-value accent">${formatNumber(stats.onlineNow)}</div></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Where they're from</h3><span class="panel-sub">Leading signals</span></div>
      <div class="bar-list">
        <div class="signal-row"><span class="signal-key">Top country</span><span class="signal-val">${escapeHtml(stats.topCountry || "—")}</span></div>
        <div class="signal-row"><span class="signal-key">Top browser</span><span class="signal-val">${escapeHtml(stats.topBrowser || "—")}</span></div>
        <div class="signal-row"><span class="signal-key">Top OS</span><span class="signal-val">${escapeHtml(stats.topOS || "—")}</span></div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-head"><h3>Recent activity mix</h3><span class="panel-sub">Last ${activity.length} events</span></div>
      ${Charts.barList([
        { label: "Registrations", value: registrations, max: Math.max(registrations, visits, 1), color: "var(--accent)" },
        { label: "Visits", value: visits, max: Math.max(registrations, visits, 1), color: "var(--cyan)" },
      ])}
    </div>
  `;
}

/* ============================================================
   USERS
   ============================================================ */
Pages.users = async function loadUsers(search) {
  search = search != null ? search : (document.getElementById("userSearchInput")?.value.trim() || "");
  const body = document.getElementById("usersTableBody");
  body.innerHTML = `<tr><td colspan="7" class="loading-state">Loading users…</td></tr>`;
  try {
    const limit = document.getElementById("userLimitSelect")?.value || "200";
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    params.set("limit", limit);
    const url = `${API.users}&${params.toString()}`;
    const data = await api(url);
    renderUsers(data.users || []);
  } catch (err) {
    body.innerHTML = `<tr><td colspan="7" class="empty-state">Couldn't load users: ${escapeHtml(err.message)}</td></tr>`;
  }
};

function initials(str) {
  const clean = String(str || "").trim();
  if (!clean) return "?";
  const parts = clean.replace(/[^a-zA-Z0-9 ]/g, " ").trim().split(/\s+/);
  return (parts[0]?.[0] || "?").toUpperCase() + (parts[1]?.[0] || "");
}

function renderUsers(users) {
  const body = document.getElementById("usersTableBody");
  const countEl = document.getElementById("userCount");
  if (countEl) countEl.textContent = `${users.length} shown`;

  if (users.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="empty-state">No users found.</td></tr>`;
    return;
  }
  body.innerHTML = users
    .map((u) => {
      const identifier = u.email || u.userId || u.username;
      const banned = Boolean(u.banned);
      const accountPill = String(u.account || "").toLowerCase() === "premium" ? "premium" : "free";
      return `
      <tr>
        <td><div class="user-cell"><span class="user-avatar">${escapeHtml(initials(u.username || u.email))}</span> ${escapeHtml(u.username || "—")}</div></td>
        <td>${escapeHtml(u.email || "—")}</td>
        <td><span class="pill ${accountPill}">${escapeHtml(u.account || "Free")}</span></td>
        <td>${escapeHtml(u.country || "—")}</td>
        <td>${escapeHtml(u.date || "—")}</td>
        <td><span class="pill ${banned ? "banned" : "active"}">${banned ? "Banned" : "Active"}</span></td>
        <td>
          <div class="row-actions">
            <button class="btn small" data-action="${banned ? "unban" : "ban"}" data-id="${escapeHtml(identifier)}">${banned ? "Unban" : "Ban"}</button>
            <button class="btn small danger" data-action="delete" data-id="${escapeHtml(identifier)}" data-name="${escapeHtml(u.username || u.email || identifier)}">Delete</button>
          </div>
        </td>
      </tr>`;
    })
    .join("");

  body.querySelectorAll("button[data-action]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const userAction = btn.dataset.action;
      const id = btn.dataset.id;
      if (userAction === "delete") {
        confirmDialog({
          title: "Delete user",
          message: `Permanently delete ${btn.dataset.name}? This cannot be undone.`,
          confirmLabel: "Delete",
          danger: true,
          onConfirm: async () => {
            await api(API.users, { method: "POST", body: JSON.stringify({ userAction: "delete", identifier: id }) });
            toast("User deleted.");
            Pages.users();
          },
        });
      } else {
        confirmDialog({
          title: userAction === "ban" ? "Ban user" : "Unban user",
          message: userAction === "ban" ? "This user will be blocked from the site and bot." : "This user will regain access.",
          confirmLabel: userAction === "ban" ? "Ban" : "Unban",
          danger: userAction === "ban",
          onConfirm: async () => {
            await api(API.users, { method: "POST", body: JSON.stringify({ userAction, identifier: id }) });
            toast(userAction === "ban" ? "User banned." : "User unbanned.");
            Pages.users();
          },
        });
      }
    });
  });
}

/* ============================================================
   GAMES
   ============================================================ */
Pages.games = async function loadGames() {
  const grid = document.getElementById("gamesGrid");
  grid.innerHTML = `<div class="loading-state">Loading games…</div>`;
  try {
    const data = await api(API.games);
    renderGames(data.games || []);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load games: ${escapeHtml(err.message)}</div>`;
  }
};

const COVER_GRADIENTS = [
  "linear-gradient(135deg,#7C6CFF,#29D8C8)",
  "linear-gradient(135deg,#FB5A6E,#F5B94D)",
  "linear-gradient(135deg,#29D8C8,#5C4EE6)",
  "linear-gradient(135deg,#35D07F,#29D8C8)",
  "linear-gradient(135deg,#5C4EE6,#FB5A6E)",
];
function gradientFor(seed) {
  const s = String(seed || "");
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return COVER_GRADIENTS[h % COVER_GRADIENTS.length];
}

function renderGames(games) {
  const grid = document.getElementById("gamesGrid");
  if (games.length === 0) {
    grid.innerHTML = `<div class="empty-state">No games yet. Add your first one.</div>`;
    return;
  }
  grid.innerHTML = games
    .map((g) => {
      const cover = g.imageUrl
        ? `background-image:url('${escapeHtml(g.imageUrl)}')`
        : `background-image:${gradientFor(g.title)}`;
      return `
      <div class="item-card">
        <div class="item-cover" style="${cover}"><div class="item-cover-title">${escapeHtml(g.title)}</div></div>
        <div class="item-body">
          <div class="item-meta">${escapeHtml(g.genre || "Uncategorized")}</div>
          <p class="item-desc">${escapeHtml(g.description || "No description yet.")}</p>
          <div class="item-foot">
            <span class="price-tag">${Number(g.price) > 0 ? `$${escapeHtml(g.price)}` : "Free"}</span>
            <div class="row-actions">
              <button class="btn small" data-edit="${escapeHtml(g.id)}">Edit</button>
              <button class="btn small danger" data-delete="${escapeHtml(g.id)}" data-name="${escapeHtml(g.title)}">Delete</button>
            </div>
          </div>
        </div>
      </div>`;
    })
    .join("");

  grid.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const g = games.find((x) => String(x.id) === btn.dataset.edit);
      openGameForm(g);
    });
  });
  grid.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      confirmDialog({
        title: "Delete game",
        message: `Remove "${btn.dataset.name}" from the catalog?`,
        confirmLabel: "Delete",
        danger: true,
        onConfirm: async () => {
          await api(`${API.games}&id=${encodeURIComponent(btn.dataset.delete)}`, { method: "DELETE" });
          toast("Game deleted.");
          Pages.games();
        },
      });
    });
  });
}

function openGameForm(existing) {
  formDialog({
    title: existing ? "Edit game" : "Add game",
    submitLabel: existing ? "Save changes" : "Add game",
    fields: [
      { name: "title", label: "Title", value: existing ? existing.title : "" },
      { name: "genre", label: "Genre", value: existing ? existing.genre : "" },
      { name: "price", label: "Price (0 = free)", type: "number", value: existing && existing.price != null ? existing.price : "0" },
      { name: "description", label: "Description", type: "textarea", value: existing ? existing.description : "" },
      { name: "imageUrl", label: "Cover image URL", value: existing ? existing.imageUrl : "" },
    ],
    onSubmit: async (values) => {
      const game = Object.assign({}, values, { price: Number(values.price) || 0 });
      if (existing) {
        await api(API.games, { method: "PUT", body: JSON.stringify({ id: existing.id, game }) });
        toast("Game updated.");
      } else {
        await api(API.games, { method: "POST", body: JSON.stringify({ game }) });
        toast("Game added.");
      }
      Pages.games();
    },
  });
}

/* ============================================================
   NEWS
   ============================================================ */
Pages.news = async function loadNews() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = `<div class="loading-state">Loading news…</div>`;
  try {
    const data = await api(API.news);
    renderNews(data.news || []);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load news: ${escapeHtml(err.message)}</div>`;
  }
};

function renderNews(items) {
  const grid = document.getElementById("newsGrid");
  if (items.length === 0) {
    grid.innerHTML = `<div class="empty-state">No news posted yet.</div>`;
    return;
  }
  grid.innerHTML = items
    .map(
      (n) => `
      <div class="item-card">
        <div class="item-cover" style="background-image:${gradientFor(n.title)}"><div class="item-cover-title">${escapeHtml(n.title)}</div></div>
        <div class="item-body">
          <div class="item-meta">${escapeHtml(n.date || "")}</div>
          <p class="item-desc">${escapeHtml(n.body || "")}</p>
          <div class="item-foot" style="justify-content:flex-end;">
            <div class="row-actions">
              <button class="btn small" data-edit="${escapeHtml(n.id)}">Edit</button>
              <button class="btn small danger" data-delete="${escapeHtml(n.id)}" data-name="${escapeHtml(n.title)}">Delete</button>
            </div>
          </div>
        </div>
      </div>`
    )
    .join("");

  grid.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const n = items.find((x) => String(x.id) === btn.dataset.edit);
      openNewsForm(n);
    });
  });
  grid.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => {
      confirmDialog({
        title: "Delete news item",
        message: `Remove "${btn.dataset.name}"?`,
        confirmLabel: "Delete",
        danger: true,
        onConfirm: async () => {
          await api(`${API.news}&id=${encodeURIComponent(btn.dataset.delete)}`, { method: "DELETE" });
          toast("News item deleted.");
          Pages.news();
        },
      });
    });
  });
}

function openNewsForm(existing) {
  formDialog({
    title: existing ? "Edit news" : "Add news",
    submitLabel: existing ? "Save changes" : "Publish",
    fields: [
      { name: "title", label: "Title", value: existing ? existing.title : "" },
      { name: "body", label: "Body", type: "textarea", rows: 5, value: existing ? existing.body : "" },
    ],
    onSubmit: async (values) => {
      if (existing) {
        await api(API.news, { method: "PUT", body: JSON.stringify({ id: existing.id, item: values }) });
        toast("News updated.");
      } else {
        await api(API.news, { method: "POST", body: JSON.stringify({ item: values }) });
        toast("News published.");
      }
      Pages.news();
    },
  });
}

/* ============================================================
   BROADCAST
   ============================================================ */
Pages.broadcast = function initBroadcast() {
  // Static page — wiring happens once in app.js boot. Nothing to fetch.
};

/* ============================================================
   SETTINGS
   ============================================================ */
Pages.settings = async function loadSettings() {
  const host = document.getElementById("settingsBox");
  host.innerHTML = `<div class="loading-state">Loading configuration…</div>`;
  try {
    const data = await api(API.settings);
    renderSettings(host, data);
  } catch (err) {
    host.innerHTML = `<div class="empty-state">Couldn't load settings: ${escapeHtml(err.message)}</div>`;
  }
};

function renderSettings(host, data) {
  const groups = [
    ["Bot configuration", data.bot],
    ["Website configuration", data.website],
    ["Integrations", data.integrations],
    ["Admin panel", data.adminPanel],
  ];
  host.innerHTML = groups
    .map(
      ([title, entries]) => `
      <div class="settings-group">
        <h3>${escapeHtml(title)}</h3>
        <div class="panel" style="padding:4px 18px;">
          ${Object.entries(entries)
            .map(([key, info]) => {
              const shown = info.value !== undefined ? (info.value == null ? "not set" : info.value) : (info.preview || (info.configured ? "configured" : "not set"));
              return `
              <div class="settings-row">
                <div class="key">${escapeHtml(key)}</div>
                <div class="val ${info.configured ? "on" : "off"}">${escapeHtml(String(shown))}</div>
              </div>`;
            })
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

/* ============================================================
   PROFILE
   ============================================================ */
Pages.profile = function renderProfile() {
  if (!currentAdmin) return;
  const name = currentAdmin.name || "Admin";
  document.getElementById("profileAvatar").textContent = initials(name);
  document.getElementById("profileName").textContent = name;
  document.getElementById("profileUsername").textContent = currentAdmin.username ? `@${currentAdmin.username}` : "no @username";
  document.getElementById("profileId").textContent = currentAdmin.id ?? "—";

  if (sessionSignedInAt) {
    const signedIn = new Date(sessionSignedInAt);
    const expires = new Date(sessionSignedInAt + 12 * 60 * 60 * 1000);
    document.getElementById("sessionSignedIn").textContent = signedIn.toLocaleString();
    document.getElementById("sessionExpires").textContent = expires.toLocaleString();
  }
};
