/* ============================================================
   Pixel&Games — Control Room
   js/app.js — boot sequence, auth, navigation, palette, theming
   ============================================================ */

const pageLoaders = {
  dashboard: Pages.dashboard,
  analytics: Pages.analytics,
  users: () => Pages.users(),
  games: Pages.games,
  news: Pages.news,
  broadcast: () => {},
  exchanges: () => Pages.exchanges(),
  settings: Pages.settings,
  profile: Pages.profile,
};

const PALETTE_PAGES = [
  { page: "dashboard", label: "Dashboard", hint: "Overview" },
  { page: "analytics", label: "Analytics", hint: "Overview" },
  { page: "users", label: "Users", hint: "Manage" },
  { page: "games", label: "Games", hint: "Manage" },
  { page: "news", label: "News", hint: "Manage" },
  { page: "broadcast", label: "Broadcast", hint: "Manage" },
  { page: "exchanges", label: "Exchange Requests", hint: "Manage" },
  { page: "settings", label: "Settings", hint: "System" },
  { page: "profile", label: "Profile", hint: "System" },
];
const PALETTE_ACTIONS = [
  {
    label: "Add a game",
    hint: "Games",
    run: () => {
      goToPage("games");
      setTimeout(() => document.getElementById("addGameBtn")?.click(), 150);
    },
  },
  {
    label: "Publish news",
    hint: "News",
    run: () => {
      goToPage("news");
      setTimeout(() => document.getElementById("addNewsBtn")?.click(), 150);
    },
  },
  {
    label: "Send a broadcast",
    hint: "Broadcast",
    run: () => {
      goToPage("broadcast");
      setTimeout(() => document.getElementById("broadcastText")?.focus(), 150);
    },
  },
  {
    label: "Search users",
    hint: "Users",
    run: () => {
      goToPage("users");
      setTimeout(
        () => document.getElementById("userSearchInput")?.focus(),
        150,
      );
    },
  },
  {
    label: "Review exchange requests",
    hint: "Exchange Requests",
    run: () => goToPage("exchanges"),
  },
  { label: "Log out", hint: "Session", run: () => doLogout() },
];

let currentPage = "dashboard";

/* ------------------------------------------------------------
   Auth gate <-> app shell
   ------------------------------------------------------------ */
function showLogin(errorMsg) {
  document.getElementById("appShell").classList.remove("show");
  document.getElementById("authGate").style.display = "flex";
  const errBox = document.getElementById("authError");
  if (errorMsg) {
    errBox.textContent = errorMsg;
    errBox.classList.add("show");
  } else {
    errBox.classList.remove("show");
  }
}

function showApp(admin) {
  currentAdmin = admin;
  sessionSignedInAt = Date.now();
  document.getElementById("authGate").style.display = "none";
  document.getElementById("appShell").classList.add("show");

  const name = admin.name || "Admin";
  const initialsStr = initials(name);
  document.getElementById("footAvatar").textContent = initialsStr;
  document.getElementById("footName").textContent = name;
  document.getElementById("topAvatar").textContent = initialsStr;

  goToPage("dashboard", { silent: true });
  pageLoaders.dashboard();
}

async function onUnauthorized() {
  // A 401 from some OTHER request (stats, users, whatever) does not by
  // itself mean the admin session is invalid — it could be a transient
  // error, a race, or a bug specific to that one endpoint. The session
  // endpoint is the single source of truth for "am I logged in," so
  // always re-confirm there before tearing down a working Control Room.
  try {
    const res = await fetch(API.session, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json().catch(() => ({}));
    if (data && data.authenticated) {
      // Session is still good — ignore the unrelated 401, stay logged in.
      return;
    }
  } catch (e) {
    // Couldn't even reach the session endpoint — fall through and log out below.
  }
  showLogin("Your session expired. Please sign in again.");
  initBotLoginButton();
}

/* ------------------------------------------------------------
   Telegram-bot login
   The admin taps this button -> opens the bot chat -> sends
   /admin there -> the bot replies with a one-time link back to
   admin-panel/login.html?token=..., which does the actual
   session exchange and redirects here already signed in.
   ------------------------------------------------------------ */
async function initBotLoginButton() {
  const host = document.getElementById("telegramWidgetHost");
  const hint = document.getElementById("authBotLoginHint");
  const statusDot = document.getElementById("authApiStatus");
  const statusLabel = document.getElementById("authApiStatusLabel");
  hint.style.display = "none";
  try {
    const info = await api(API.botInfo);
    statusDot.dataset.state = "ok";
    statusLabel.textContent = "Backend connected";

    host.innerHTML = `<a class="btn primary full auth-bot-login-btn" href="https://t.me/${encodeURIComponent(info.username)}" target="_blank" rel="noopener noreferrer">🛠 Login via Telegram Bot</a>`;
    hint.style.display = "block";
  } catch (err) {
    statusDot.dataset.state = "error";
    statusLabel.textContent = "Backend unreachable";
    host.innerHTML = `<div class="empty-state">Couldn't reach the bot (${escapeHtml(err.message)}). Check TELEGRAM_BOT_TOKEN and that this panel is deployed on the same domain as the Site backend.</div>`;
  }
}

async function doLogout() {
  try {
    await api(API.logout, { method: "POST" });
  } catch {}
  currentAdmin = null;
  location.reload();
}

async function checkSession() {
  try {
    const data = await api(API.session);

    console.log("SESSION RESULT:", data);

    if (data.authenticated === true && data.admin) {
      showApp(data.admin);
      return;
    }

    console.warn("Session is not authenticated:", data);

    // Не показываем login сразу.
    // Сначала ещё раз проверяем сессию через 1 секунду.
    setTimeout(async () => {
      try {
        const retry = await api(API.session);

        console.log("SESSION RETRY RESULT:", retry);

        if (retry.authenticated === true && retry.admin) {
          showApp(retry.admin);
          return;
        }

        showLogin("Your session is not valid. Please sign in again.");
        initBotLoginButton();
      } catch (err) {
        console.error("Session retry failed:", err);

        // ВАЖНО:
        // Не сбрасываем интерфейс, если приложение уже показано.
        if (!document.getElementById("appShell").classList.contains("show")) {
          showLogin("Could not verify your session.");
          initBotLoginButton();
        }
      }
    }, 1000);
  } catch (err) {
    console.error("Initial session check failed:", err);

    // Если приложение уже открыто — не выбрасываем пользователя.
    if (!document.getElementById("appShell").classList.contains("show")) {
      showLogin("Could not verify your session.");
      initBotLoginButton();
    }
  }
}

/* ------------------------------------------------------------
   Navigation
   ------------------------------------------------------------ */
function goToPage(page, opts = {}) {
  if (!document.getElementById(`page-${page}`)) return;
  currentPage = page;

  document
    .querySelectorAll(".nav-item")
    .forEach((n) => n.classList.toggle("active", n.dataset.page === page));
  document
    .querySelectorAll(".page")
    .forEach((p) => p.classList.toggle("active", p.id === `page-${page}`));

  const section = document.getElementById(`page-${page}`);
  document.getElementById("crumbPage").textContent =
    section.dataset.title || page;

  document.getElementById("appShell").classList.remove("mobile-nav-open");
  positionNavIndicator();

  if (!opts.silent && pageLoaders[page]) pageLoaders[page]();
}

function positionNavIndicator() {
  const indicator = document.getElementById("navIndicator");
  const active = document.querySelector(".nav-item.active");
  const nav = document.getElementById("sidebarNav");
  if (!indicator || !active || !nav) return;
  const navRect = nav.getBoundingClientRect();
  const itemRect = active.getBoundingClientRect();
  indicator.style.height = `${itemRect.height}px`;
  indicator.style.transform = `translateY(${itemRect.top - navRect.top + nav.scrollTop}px)`;
}

document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", () => goToPage(item.dataset.page));
});
document
  .getElementById("footProfileBtn")
  .addEventListener("click", () => goToPage("profile"));
document
  .getElementById("topbarAvatarBtn")
  .addEventListener("click", () => goToPage("profile"));
window.addEventListener("resize", positionNavIndicator);

/* ------------------------------------------------------------
   Sidebar: mobile toggle + collapse
   ------------------------------------------------------------ */
document.getElementById("hamburgerBtn").addEventListener("click", () => {
  document.getElementById("appShell").classList.toggle("mobile-nav-open");
});
document.getElementById("sidebarScrim").addEventListener("click", () => {
  document.getElementById("appShell").classList.remove("mobile-nav-open");
});
document.getElementById("sidebarCollapseBtn").addEventListener("click", () => {
  document.getElementById("appShell").classList.toggle("sidebar-collapsed");
  localStorage.setItem(
    "cr_sidebar_collapsed",
    document.getElementById("appShell").classList.contains("sidebar-collapsed")
      ? "1"
      : "0",
  );
  setTimeout(positionNavIndicator, 260);
});
if (localStorage.getItem("cr_sidebar_collapsed") === "1") {
  document.getElementById("appShell").classList.add("sidebar-collapsed");
}
document.getElementById("profileSidebarBtn")?.addEventListener("click", () => {
  document.getElementById("sidebarCollapseBtn").click();
});

/* ------------------------------------------------------------
   Theme toggle (dark / light) — persisted
   ------------------------------------------------------------ */
function applyTheme(theme) {
  document.body.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  localStorage.setItem("cr_theme", theme);
}
function toggleTheme() {
  applyTheme(document.body.dataset.theme === "dark" ? "light" : "dark");
}
document
  .getElementById("themeToggleBtn")
  .addEventListener("click", toggleTheme);
document
  .getElementById("profileThemeBtn")
  ?.addEventListener("click", toggleTheme);
applyTheme(localStorage.getItem("cr_theme") || "dark");

/* ------------------------------------------------------------
   Refresh button
   ------------------------------------------------------------ */
document.getElementById("refreshBtn").addEventListener("click", (e) => {
  e.currentTarget.classList.add("spin");
  setTimeout(() => e.currentTarget.classList.remove("spin"), 600);
  if (pageLoaders[currentPage]) pageLoaders[currentPage]();
});

/* ------------------------------------------------------------
   Command palette
   ------------------------------------------------------------ */
const paletteOverlay = document.getElementById("paletteOverlay");
const paletteInput = document.getElementById("paletteInput");
const paletteResults = document.getElementById("paletteResults");
let paletteSelIndex = 0;
let paletteFlatItems = [];

function openPalette() {
  paletteOverlay.classList.add("show");
  paletteInput.value = "";
  renderPaletteResults("");
  setTimeout(() => paletteInput.focus(), 30);
}
function closePalette() {
  paletteOverlay.classList.remove("show");
}
function renderPaletteResults(query) {
  const q = query.trim().toLowerCase();
  const pages = PALETTE_PAGES.filter((p) => p.label.toLowerCase().includes(q));
  const actions = PALETTE_ACTIONS.filter((a) =>
    a.label.toLowerCase().includes(q),
  );

  paletteFlatItems = [];
  let html = "";

  if (pages.length) {
    html += `<div class="palette-group-label">Pages</div>`;
    pages.forEach((p) => {
      paletteFlatItems.push({ type: "page", ...p });
      html += `<div class="palette-item" data-idx="${paletteFlatItems.length - 1}"><svg class="ic" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" stroke-width="2"/></svg><span>${escapeHtml(p.label)}</span><span class="hint">${escapeHtml(p.hint)}</span></div>`;
    });
  }
  if (actions.length) {
    html += `<div class="palette-group-label">Actions</div>`;
    actions.forEach((a) => {
      paletteFlatItems.push({ type: "action", ...a });
      html += `<div class="palette-item" data-idx="${paletteFlatItems.length - 1}"><svg class="ic" viewBox="0 0 24 24"><path d="M13 3L5 13h5l-1 8 9-11h-6z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span>${escapeHtml(a.label)}</span><span class="hint">${escapeHtml(a.hint)}</span></div>`;
    });
  }
  if (!pages.length && !actions.length) {
    html = `<div class="empty-state">No matches.</div>`;
  }
  paletteResults.innerHTML = html;
  paletteSelIndex = 0;
  highlightPaletteSel();

  paletteResults.querySelectorAll(".palette-item").forEach((el) => {
    el.addEventListener("click", () => runPaletteItem(Number(el.dataset.idx)));
    el.addEventListener("mouseenter", () => {
      paletteSelIndex = Number(el.dataset.idx);
      highlightPaletteSel();
    });
  });
}
function highlightPaletteSel() {
  paletteResults.querySelectorAll(".palette-item").forEach((el) => {
    el.classList.toggle("sel", Number(el.dataset.idx) === paletteSelIndex);
  });
  const sel = paletteResults.querySelector(".palette-item.sel");
  if (sel) sel.scrollIntoView({ block: "nearest" });
}
function runPaletteItem(idx) {
  const item = paletteFlatItems[idx];
  if (!item) return;
  closePalette();
  if (item.type === "page") goToPage(item.page);
  if (item.type === "action") item.run();
}

document
  .getElementById("openPaletteBtn")
  .addEventListener("click", openPalette);
document
  .getElementById("openPaletteBtnTop")
  .addEventListener("click", openPalette);
paletteOverlay.addEventListener("click", (e) => {
  if (e.target === paletteOverlay) closePalette();
});
paletteInput.addEventListener("input", (e) =>
  renderPaletteResults(e.target.value),
);
paletteInput.addEventListener("keydown", (e) => {
  if (e.key === "ArrowDown") {
    e.preventDefault();
    paletteSelIndex = Math.min(
      paletteSelIndex + 1,
      paletteFlatItems.length - 1,
    );
    highlightPaletteSel();
  }
  if (e.key === "ArrowUp") {
    e.preventDefault();
    paletteSelIndex = Math.max(paletteSelIndex - 1, 0);
    highlightPaletteSel();
  }
  if (e.key === "Enter") {
    e.preventDefault();
    runPaletteItem(paletteSelIndex);
  }
  if (e.key === "Escape") closePalette();
});
document.addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (document.getElementById("appShell").classList.contains("show"))
      openPalette();
  }
});

/* ------------------------------------------------------------
   Users page controls
   ------------------------------------------------------------ */
document.getElementById("userSearchInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") Pages.users(e.target.value.trim());
});
document.getElementById("userSearchInput").addEventListener(
  "input",
  debounce((e) => Pages.users(e.target.value.trim()), 400),
);
document
  .getElementById("userLimitSelect")
  .addEventListener("change", () => Pages.users());
document.getElementById("userClearBtn").addEventListener("click", () => {
  document.getElementById("userSearchInput").value = "";
  Pages.users("");
});

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

/* ------------------------------------------------------------
   Exchange Requests page controls (added)
   ------------------------------------------------------------ */
document
  .getElementById("exchangeSearchInput")
  .addEventListener("keydown", (e) => {
    if (e.key === "Enter") Pages.exchanges(e.target.value.trim());
  });
document.getElementById("exchangeSearchInput").addEventListener(
  "input",
  debounce((e) => Pages.exchanges(e.target.value.trim()), 400),
);
document
  .getElementById("exchangeStatusSelect")
  .addEventListener("change", () => Pages.exchanges());
document.getElementById("exchangeClearBtn").addEventListener("click", () => {
  document.getElementById("exchangeSearchInput").value = "";
  document.getElementById("exchangeStatusSelect").value = "";
  Pages.exchanges("");
});

/* ------------------------------------------------------------
   Games / News "add" buttons
   ------------------------------------------------------------ */
document
  .getElementById("addGameBtn")
  .addEventListener("click", () => openGameForm(null));
document
  .getElementById("addNewsBtn")
  .addEventListener("click", () => openNewsForm(null));

/* ------------------------------------------------------------
   Broadcast wiring
   ------------------------------------------------------------ */
const broadcastText = document.getElementById("broadcastText");
const broadcastPreviewBody = document.getElementById("broadcastPreviewBody");
broadcastText.addEventListener("input", () => {
  document.getElementById("broadcastCharCount").textContent =
    `${broadcastText.value.length} / 3500`;
  broadcastPreviewBody.textContent =
    broadcastText.value.trim() || "Your message will appear here.";
});

document.getElementById("broadcastSendBtn").addEventListener("click", () => {
  const message = broadcastText.value.trim();
  if (!message) {
    toast("Write a message first.", "error");
    return;
  }
  confirmDialog({
    title: "Send broadcast",
    message:
      "This sends the message to every player linked to the Telegram bot right now. Continue?",
    confirmLabel: "Send",
    onConfirm: async () => {
      const data = await api(API.broadcast, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      const panel = document.getElementById("broadcastResultPanel");
      panel.style.display = "block";
      document.getElementById("broadcastResult").innerHTML = `
        <div class="settings-row"><div class="key">Sent</div><div class="val on">${data.sent}</div></div>
        <div class="settings-row"><div class="key">Failed</div><div class="val ${data.failed ? "off" : ""}">${data.failed}</div></div>
        <div class="settings-row"><div class="key">Total recipients</div><div class="val">${data.total}</div></div>
        ${data.capped ? `<div class="settings-row"><div class="key">Note</div><div class="val off">Capped at 200 — run it again to reach the rest.</div></div>` : ""}
      `;
      toast(`Broadcast sent to ${data.sent}/${data.total} player(s).`);
      broadcastText.value = "";
      document.getElementById("broadcastCharCount").textContent = "0 / 3500";
      broadcastPreviewBody.textContent = "Your message will appear here.";
    },
  });
});

/* ------------------------------------------------------------
   Profile: logout
   ------------------------------------------------------------ */
document.getElementById("logoutBtn").addEventListener("click", () => {
  confirmDialog({
    title: "Log out",
    message:
      "You'll need to sign in with Telegram again to come back to the Control Room.",
    confirmLabel: "Log out",
    danger: true,
    onConfirm: doLogout,
  });
});

/* ------------------------------------------------------------
   Boot
   ------------------------------------------------------------ */
checkSession();
