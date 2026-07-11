/* ============================================================
   Pixel&Games — Admin Panel frontend
   Vanilla JS, no build step, no dependencies — matches the
   rest of the project's stack. Talks only to /api/admin/*.
   ============================================================ */

const API = {
  session: "/api/admin/session",
  login: "/api/admin/login",
  logout: "/api/admin/logout",
  botInfo: "/api/admin/bot-info",
  stats: "/api/admin/stats",
  users: "/api/admin/users",
  broadcast: "/api/admin/broadcast",
  games: "/api/admin/games",
  news: "/api/admin/news",
  settings: "/api/admin/settings",
};

/* ------------------------------------------------------------
   Fetch helper
   ------------------------------------------------------------ */
async function api(url, options = {}) {
  const res = await fetch(url, {
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }
  if (res.status === 401) {
    showLogin("Your session expired. Please sign in again.");
    throw new Error("unauthorized");
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

/* ------------------------------------------------------------
   Toasts
   ------------------------------------------------------------ */
function toast(message, type = "success") {
  const host = document.getElementById("toastHost");
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => el.remove(), 4200);
}

/* ------------------------------------------------------------
   Modal (confirm dialogs + forms)
   ------------------------------------------------------------ */
const overlay = document.getElementById("modalOverlay");
const modalBox = document.getElementById("modalBox");

function closeModal() {
  overlay.classList.remove("show");
  modalBox.innerHTML = "";
}
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) closeModal();
});

function confirmDialog({ title, message, confirmLabel = "Confirm", danger = false, onConfirm }) {
  modalBox.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(message)}</p>
    <div class="modal-actions">
      <button class="btn" id="modalCancel">Cancel</button>
      <button class="btn ${danger ? "danger" : "primary"}" id="modalConfirm">${escapeHtml(confirmLabel)}</button>
    </div>
  `;
  overlay.classList.add("show");
  document.getElementById("modalCancel").onclick = closeModal;
  document.getElementById("modalConfirm").onclick = async () => {
    const btn = document.getElementById("modalConfirm");
    btn.disabled = true;
    try {
      await onConfirm();
      closeModal();
    } catch (err) {
      toast(err.message, "error");
      btn.disabled = false;
    }
  };
}

function formDialog({ title, fields, submitLabel = "Save", onSubmit }) {
  const fieldsHtml = fields
    .map((f) => {
      if (f.type === "textarea") {
        return `<div class="field"><label>${escapeHtml(f.label)}</label><textarea id="f_${f.name}" rows="${f.rows || 3}" placeholder="${escapeHtml(f.placeholder || "")}">${escapeHtml(f.value || "")}</textarea></div>`;
      }
      if (f.type === "select") {
        const opts = f.options.map((o) => `<option value="${escapeHtml(o)}" ${o === f.value ? "selected" : ""}>${escapeHtml(o)}</option>`).join("");
        return `<div class="field"><label>${escapeHtml(f.label)}</label><select id="f_${f.name}">${opts}</select></div>`;
      }
      return `<div class="field"><label>${escapeHtml(f.label)}</label><input type="${f.type || "text"}" id="f_${f.name}" value="${escapeHtml(f.value == null ? "" : f.value)}" placeholder="${escapeHtml(f.placeholder || "")}"></div>`;
    })
    .join("");

  modalBox.innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <div>${fieldsHtml}</div>
    <div class="modal-actions">
      <button class="btn" id="modalCancel">Cancel</button>
      <button class="btn primary" id="modalConfirm">${escapeHtml(submitLabel)}</button>
    </div>
  `;
  overlay.classList.add("show");
  document.getElementById("modalCancel").onclick = closeModal;
  document.getElementById("modalConfirm").onclick = async () => {
    const values = {};
    fields.forEach((f) => {
      values[f.name] = document.getElementById(`f_${f.name}`).value;
    });
    const btn = document.getElementById("modalConfirm");
    btn.disabled = true;
    try {
      await onSubmit(values);
      closeModal();
    } catch (err) {
      toast(err.message, "error");
      btn.disabled = false;
    }
  };
}

function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* ------------------------------------------------------------
   Auth / login flow
   ------------------------------------------------------------ */
function showLogin(errorMsg) {
  document.getElementById("app").classList.remove("show");
  document.getElementById("loginScreen").style.display = "flex";
  const errBox = document.getElementById("loginError");
  if (errorMsg) {
    errBox.textContent = errorMsg;
    errBox.classList.add("show");
  } else {
    errBox.classList.remove("show");
  }
}

function showApp(admin) {
  document.getElementById("loginScreen").style.display = "none";
  document.getElementById("app").classList.add("show");
  document.getElementById("adminName").textContent = admin.name || "Admin";
  loadDashboard();
}

// Called by the Telegram Login Widget after a successful login.
window.onTelegramAuth = async function (user) {
  try {
    const data = await api(API.login, { method: "POST", body: JSON.stringify(user) });
    toast(`Welcome, ${data.admin.name}.`);
    showApp(data.admin);
  } catch (err) {
    showLogin(err.message || "Login failed.");
  }
};

async function initTelegramWidget() {
  try {
    const info = await api(API.botInfo);
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.async = true;
    script.setAttribute("data-telegram-login", info.username);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "8");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    document.getElementById("telegramWidgetHost").appendChild(script);
  } catch (err) {
    document.getElementById("telegramWidgetHost").innerHTML =
      `<div class="sub">Couldn't load Telegram login (${escapeHtml(err.message)}). Check TELEGRAM_BOT_TOKEN.</div>`;
  }
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await api(API.logout, { method: "POST" });
  } catch {}
  location.reload();
});

async function checkSession() {
  try {
    const data = await api(API.session);
    if (data.authenticated) {
      showApp(data.admin);
    } else {
      showLogin();
      initTelegramWidget();
    }
  } catch {
    showLogin();
    initTelegramWidget();
  }
}

/* ------------------------------------------------------------
   Sidebar navigation
   ------------------------------------------------------------ */
const pageLoaders = {
  dashboard: loadDashboard,
  users: () => loadUsers(),
  broadcast: () => {},
  games: loadGames,
  news: loadNews,
  settings: loadSettings,
};

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => {
    const page = item.dataset.page;
    document.querySelectorAll(".nav-item").forEach((n) => n.classList.remove("active"));
    item.classList.add("active");
    document.querySelectorAll(".page").forEach((p) => p.classList.remove("active"));
    document.getElementById(`page-${page}`).classList.add("active");
    document.getElementById("sidebar").classList.remove("open");
    if (pageLoaders[page]) pageLoaders[page]();
  });
});

const hamburgerBtn = document.getElementById("hamburgerBtn");
if (hamburgerBtn) {
  hamburgerBtn.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });
}

/* ------------------------------------------------------------
   Dashboard
   ------------------------------------------------------------ */
async function loadDashboard() {
  const cardsHost = document.getElementById("statCards");
  const botHost = document.getElementById("botStatusBox");
  const activityHost = document.getElementById("activityList");
  cardsHost.innerHTML = `<div class="loading-state">Loading statistics…</div>`;
  botHost.innerHTML = `<div class="loading-state">Checking…</div>`;
  activityHost.innerHTML = `<div class="loading-state">Loading…</div>`;

  try {
    const data = await api(API.stats);
    renderStatCards(data.stats, data.statsError);
    renderBotStatus(data.bot);
    renderActivity(data.activity);
  } catch (err) {
    cardsHost.innerHTML = `<div class="empty-state">Couldn't load statistics: ${escapeHtml(err.message)}</div>`;
    botHost.innerHTML = "";
    activityHost.innerHTML = "";
  }
}

function renderStatCards(s, error) {
  const host = document.getElementById("statCards");
  if (!s) {
    host.innerHTML = `<div class="empty-state">Stats unavailable (${escapeHtml(error || "unknown error")}). Check GOOGLE_SHEETS_WEBAPP_URL.</div>`;
    return;
  }
  const cards = [
    ["Total users", s.totalUsers],
    ["Premium users", s.premiumUsers],
    ["Total visits", s.totalVisitors],
    ["Registrations today", s.todayUsers],
    ["Visits today", s.todayVisitors],
    ["Online now", s.onlineNow],
    ["Linked to bot", s.linkedUsers],
    ["Top country", s.topCountry || "—"],
  ];
  host.innerHTML = cards
    .map(
      ([label, value]) => `
      <div class="stat-card">
        <div class="label">${escapeHtml(label)}</div>
        <div class="value">${escapeHtml(value == null ? "—" : value)}</div>
      </div>`
    )
    .join("");
}

function renderBotStatus(bot) {
  const host = document.getElementById("botStatusBox");
  if (!bot) {
    host.innerHTML = `<div class="empty-state">Couldn't load bot status.</div>`;
    return;
  }
  const rows = [
    ["Bot token configured", bot.configured],
    ["Webhook registered", bot.webhookSet],
  ];
  host.innerHTML = `
    <div>
      ${rows
        .map(
          ([label, ok]) => `
        <div class="settings-row">
          <div class="key">${escapeHtml(label)}</div>
          <div class="val ${ok ? "on" : "off"}"><span class="status-dot ${ok ? "ok" : "bad"}"></span>${ok ? "Yes" : "No"}</div>
        </div>`
        )
        .join("")}
      ${bot.pendingUpdateCount !== null ? `<div class="settings-row"><div class="key">Pending updates</div><div class="val">${escapeHtml(bot.pendingUpdateCount)}</div></div>` : ""}
      ${bot.lastErrorMessage ? `<div class="settings-row"><div class="key">Last webhook error</div><div class="val off">${escapeHtml(bot.lastErrorMessage)}</div></div>` : ""}
    </div>`;
}

function renderActivity(items) {
  const host = document.getElementById("activityList");
  if (!items || items.length === 0) {
    host.innerHTML = `<div class="empty-state">No recent activity yet.</div>`;
    return;
  }
  host.innerHTML = items
    .map(
      (a) => `
      <div class="activity-row">
        <span class="badge ${a.type}">${a.type === "registration" ? "New user" : "Visit"}</span>
        <span class="main-label">${escapeHtml(a.label)}</span>
        <span class="detail">${escapeHtml(a.detail || "")}</span>
        <span class="date">${escapeHtml(a.date || "")}</span>
      </div>`
    )
    .join("");
}

document.getElementById("refreshDashboardBtn").addEventListener("click", loadDashboard);

/* ------------------------------------------------------------
   Users
   ------------------------------------------------------------ */
async function loadUsers(search) {
  search = search || "";
  const body = document.getElementById("usersTableBody");
  body.innerHTML = `<tr><td colspan="7" class="loading-state">Loading users…</td></tr>`;
  try {
    const url = search ? `${API.users}?search=${encodeURIComponent(search)}` : API.users;
    const data = await api(url);
    renderUsers(data.users || []);
  } catch (err) {
    body.innerHTML = `<tr><td colspan="7" class="empty-state">Couldn't load users: ${escapeHtml(err.message)}</td></tr>`;
  }
}

function renderUsers(users) {
  const body = document.getElementById("usersTableBody");
  if (users.length === 0) {
    body.innerHTML = `<tr><td colspan="7" class="empty-state">No users found.</td></tr>`;
    return;
  }
  body.innerHTML = users
    .map((u) => {
      const identifier = u.email || u.userId || u.username;
      const banned = Boolean(u.banned);
      const accountPill = String(u.account).toLowerCase() === "premium" ? "premium" : "free";
      return `
      <tr>
        <td>${escapeHtml(u.username || "—")}</td>
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
      const action = btn.dataset.action;
      const id = btn.dataset.id;
      if (action === "delete") {
        confirmDialog({
          title: "Delete user",
          message: `Permanently delete ${btn.dataset.name}? This cannot be undone.`,
          confirmLabel: "Delete",
          danger: true,
          onConfirm: async () => {
            await api(API.users, { method: "POST", body: JSON.stringify({ action: "delete", identifier: id }) });
            toast("User deleted.");
            loadUsers(document.getElementById("userSearchInput").value.trim());
          },
        });
      } else {
        confirmDialog({
          title: action === "ban" ? "Ban user" : "Unban user",
          message: action === "ban" ? "This user will be blocked from the site/bot." : "This user will regain access.",
          confirmLabel: action === "ban" ? "Ban" : "Unban",
          danger: action === "ban",
          onConfirm: async () => {
            await api(API.users, { method: "POST", body: JSON.stringify({ action, identifier: id }) });
            toast(action === "ban" ? "User banned." : "User unbanned.");
            loadUsers(document.getElementById("userSearchInput").value.trim());
          },
        });
      }
    });
  });
}

document.getElementById("userSearchBtn").addEventListener("click", () => {
  loadUsers(document.getElementById("userSearchInput").value.trim());
});
document.getElementById("userSearchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") loadUsers(e.target.value.trim());
});
document.getElementById("userClearBtn").addEventListener("click", () => {
  document.getElementById("userSearchInput").value = "";
  loadUsers();
});

/* ------------------------------------------------------------
   Broadcast
   ------------------------------------------------------------ */
const broadcastText = document.getElementById("broadcastText");
broadcastText.addEventListener("input", () => {
  document.getElementById("broadcastCharCount").textContent = `${broadcastText.value.length} / 3500 characters`;
});

document.getElementById("broadcastSendBtn").addEventListener("click", () => {
  const message = broadcastText.value.trim();
  if (!message) {
    toast("Write a message first.", "error");
    return;
  }

  confirmDialog({
    title: "Send broadcast",
    message: "This sends the message to every player linked to the Telegram bot. Continue?",
    confirmLabel: "Send",
    onConfirm: async () => {
      const data = await api(API.broadcast, { method: "POST", body: JSON.stringify({ message }) });
      const panel = document.getElementById("broadcastResultPanel");
      panel.style.display = "block";
      document.getElementById("broadcastResult").innerHTML = `
        <div class="settings-row"><div class="key">Sent</div><div class="val on">${data.sent}</div></div>
        <div class="settings-row"><div class="key">Failed</div><div class="val ${data.failed ? "off" : ""}">${data.failed}</div></div>
        <div class="settings-row"><div class="key">Total recipients</div><div class="val">${data.total}</div></div>
        ${data.capped ? `<div class="settings-row"><div class="key">Note</div><div class="val off">Capped at 200 — run again for the rest.</div></div>` : ""}
      `;
      toast(`Broadcast sent to ${data.sent}/${data.total} player(s).`);
      broadcastText.value = "";
      document.getElementById("broadcastCharCount").textContent = "0 / 3500 characters";
    },
  });
});

/* ------------------------------------------------------------
   Games
   ------------------------------------------------------------ */
async function loadGames() {
  const grid = document.getElementById("gamesGrid");
  grid.innerHTML = `<div class="loading-state">Loading games…</div>`;
  try {
    const data = await api(API.games);
    renderGames(data.games || []);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load games: ${escapeHtml(err.message)}</div>`;
  }
}

function renderGames(games) {
  const grid = document.getElementById("gamesGrid");
  if (games.length === 0) {
    grid.innerHTML = `<div class="empty-state">No games yet. Add your first one.</div>`;
    return;
  }
  grid.innerHTML = games
    .map(
      (g) => `
      <div class="item-card">
        <h4>${escapeHtml(g.title)}</h4>
        <div class="meta">${escapeHtml(g.genre || "—")} · ${g.price ? `$${escapeHtml(g.price)}` : "Free"}</div>
        <p>${escapeHtml(g.description || "")}</p>
        <div class="row-actions">
          <button class="btn small" data-edit="${escapeHtml(g.id)}">Edit</button>
          <button class="btn small danger" data-delete="${escapeHtml(g.id)}" data-name="${escapeHtml(g.title)}">Delete</button>
        </div>
      </div>`
    )
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
          await api(`${API.games}?id=${encodeURIComponent(btn.dataset.delete)}`, { method: "DELETE" });
          toast("Game deleted.");
          loadGames();
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
      { name: "imageUrl", label: "Image URL", value: existing ? existing.imageUrl : "" },
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
      loadGames();
    },
  });
}

document.getElementById("addGameBtn").addEventListener("click", () => openGameForm(null));

/* ------------------------------------------------------------
   News
   ------------------------------------------------------------ */
async function loadNews() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = `<div class="loading-state">Loading news…</div>`;
  try {
    const data = await api(API.news);
    renderNews(data.news || []);
  } catch (err) {
    grid.innerHTML = `<div class="empty-state">Couldn't load news: ${escapeHtml(err.message)}</div>`;
  }
}

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
        <h4>${escapeHtml(n.title)}</h4>
        <div class="meta">${escapeHtml(n.date || "")}</div>
        <p>${escapeHtml(n.body || "")}</p>
        <div class="row-actions">
          <button class="btn small" data-edit="${escapeHtml(n.id)}">Edit</button>
          <button class="btn small danger" data-delete="${escapeHtml(n.id)}" data-name="${escapeHtml(n.title)}">Delete</button>
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
          await api(`${API.news}?id=${encodeURIComponent(btn.dataset.delete)}`, { method: "DELETE" });
          toast("News item deleted.");
          loadNews();
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
      loadNews();
    },
  });
}

document.getElementById("addNewsBtn").addEventListener("click", () => openNewsForm(null));

/* ------------------------------------------------------------
   Settings
   ------------------------------------------------------------ */
async function loadSettings() {
  const host = document.getElementById("settingsBox");
  host.innerHTML = `<div class="loading-state">Loading configuration…</div>`;
  try {
    const data = await api(API.settings);
    renderSettings(data);
  } catch (err) {
    host.innerHTML = `<div class="empty-state">Couldn't load settings: ${escapeHtml(err.message)}</div>`;
  }
}

function renderSettings(data) {
  const groups = [
    ["Bot configuration", data.bot],
    ["Website configuration", data.website],
    ["Integrations", data.integrations],
    ["Admin panel", data.adminPanel],
  ];
  document.getElementById("settingsBox").innerHTML = groups
    .map(
      ([title, entries]) => `
      <div class="settings-group">
        <h3>${escapeHtml(title)}</h3>
        <div class="panel" style="padding:6px 16px;">
          ${Object.entries(entries)
            .map(([key, info]) => {
              const shown = info.value !== undefined ? (info.value == null ? "not set" : info.value) : (info.preview || (info.configured ? "configured" : "not set"));
              return `
              <div class="settings-row">
                <div class="key">${escapeHtml(key)}</div>
                <div class="val ${info.configured ? "on" : "off"}">${escapeHtml(shown)}</div>
              </div>`;
            })
            .join("")}
        </div>
      </div>`
    )
    .join("");
}

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
checkSession();