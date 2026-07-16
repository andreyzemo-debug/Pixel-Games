/* ============================================================
   Pixel&Games — Control Room
   js/pages.js — page renderers

   REWRITE NOTE: every page here previously either did nothing
   (dashboard/analytics/settings/profile just console.log'd) or
   rendered a static "waiting for API" placeholder that never
   called the API (users/games/news), and the Games/News "Add"
   buttons in app.js called openGameForm()/openNewsForm() which
   didn't exist anywhere in the project (hard crash on click).
   This file now actually wires every page to /api/admin.

   Field-name note: the exact column names Google Sheets returns
   for games/news/users beyond what admin.js/bot.js already
   reference (username, email, account, country, date, coins,
   giftClaims for users; title/price for games; title/body for
   news) aren't visible from this repo (they live in your Code.gs
   / Apps Script, which isn't part of this project). The rendering
   below reads a few sensible fallback field names (e.g. game.image
   || game.cover) so it degrades gracefully if a field is missing,
   but double-check the form field names below against your actual
   Sheet columns.
   ============================================================ */

function statusPill(text, cls) {
  return `<span class="pill ${cls}">${escapeHtml(text)}</span>`;
}

function fmtDate(value) {
  if (!value) return "—";
  return escapeHtml(String(value));
}

const Pages = {
  /* ------------------------------------------------------------
     Dashboard
     ------------------------------------------------------------ */
  async dashboard() {
    const statGrid = document.getElementById("statGrid");
    const chartHost = document.getElementById("audienceChartHost");
    const botBox = document.getElementById("botStatusBox");
    const activityList = document.getElementById("activityList");
    const signalsBox = document.getElementById("topSignalsBox");
    const pulseChip = document.getElementById("botPulseChip");
    const updatedChip = document.getElementById("lastUpdatedChip");

    try {
      const data = await api(API.stats);
      const s = data.stats;

      if (!s) {
        statGrid.innerHTML = `<div class="empty-state">${escapeHtml(data.statsError || "Stats unavailable.")}</div>`;
      } else {
        statGrid.innerHTML = [
          { label: "Total users", value: s.totalUsers, cls: "" },
          { label: "Online now", value: s.onlineNow, cls: "success" },
          { label: "Today's visitors", value: s.todayVisitors, cls: "cyan" },
          { label: "Premium users", value: s.premiumUsers, cls: "warning" },
        ]
          .map(
            (c) => `
          <div class="stat-card ${c.cls}">
            <div class="stat-card-top">
              <span class="stat-card-label">${escapeHtml(c.label)}</span>
            </div>
            <div class="stat-card-value">${c.value ?? "—"}</div>
          </div>`
          )
          .join("");

        Charts.audience(chartHost, { premium: s.premiumUsers || 0, free: s.freeUsers || 0 });

        signalsBox.innerHTML = [
          ["Top country", s.topCountry],
          ["Top browser", s.topBrowser],
          ["Top OS", s.topOS],
          ["Linked to bot", s.linkedUsers],
        ]
          .map(
            ([key, val]) =>
              `<div class="signal-row"><span class="signal-key">${escapeHtml(key)}</span><span class="signal-val">${escapeHtml(val ?? "—")}</span></div>`
          )
          .join("");
      }

      const bot = data.bot || {};
      botBox.classList.remove("loading-state");
      botBox.innerHTML = [
        ["Configured", bot.configured ? "Yes" : "No"],
        ["Webhook set", bot.webhookSet ? "Yes" : "No"],
        ["Pending updates", bot.pendingUpdateCount ?? "—"],
        ["Last error", bot.lastErrorMessage || "None"],
      ]
        .map(
          ([key, val]) =>
            `<div class="settings-row"><div class="key">${escapeHtml(key)}</div><div class="val ${key === "Webhook set" && bot.webhookSet ? "on" : ""}">${escapeHtml(String(val))}</div></div>`
        )
        .join("");

      if (pulseChip) {
        pulseChip.dataset.state = bot.webhookSet ? "online" : "offline";
        const label = pulseChip.querySelector(".pulse-label");
        if (label) label.textContent = bot.webhookSet ? "Bot online" : "Webhook not set";
      }

      const activity = data.activity || [];
      activityList.innerHTML = activity.length
        ? activity
            .map(
              (a) => `
          <div class="activity-row" data-type="${escapeHtml(a.type)}">
            <span class="activity-icon">${a.type === "visit" ? "👀" : "👤"}</span>
            <div class="activity-text">
              <div class="activity-label">${escapeHtml(a.label)}</div>
              <div class="activity-detail">${escapeHtml(a.detail || "")}</div>
            </div>
            <span class="activity-date">${escapeHtml(a.date || "")}</span>
          </div>`
            )
            .join("")
        : `<div class="empty-state">No recent activity yet.</div>`;

      if (updatedChip) updatedChip.textContent = `Updated ${new Date().toLocaleTimeString()}`;
    } catch (err) {
      statGrid.innerHTML = `<div class="empty-state">Couldn't load the dashboard (${escapeHtml(err.message)}).</div>`;
      botBox.innerHTML = `<div class="empty-state">Unavailable.</div>`;
      activityList.innerHTML = `<div class="empty-state">Unavailable.</div>`;
      signalsBox.innerHTML = `<div class="empty-state">Unavailable.</div>`;
    }
  },

  /* ------------------------------------------------------------
     Analytics — reuses the stats payload for a deeper breakdown
     ------------------------------------------------------------ */
  async analytics() {
    const grid = document.getElementById("analyticsGrid");
    try {
      const data = await api(API.stats);
      const s = data.stats;
      if (!s) {
        grid.innerHTML = `<div class="empty-state">${escapeHtml(data.statsError || "Analytics unavailable.")}</div>`;
        return;
      }
      const rows = [
        ["Total users", s.totalUsers],
        ["Premium users", s.premiumUsers],
        ["Free users", s.freeUsers],
        ["Linked to bot", s.linkedUsers],
        ["Total visitors (all time)", s.totalVisitors],
        ["Today's users", s.todayUsers],
        ["Today's visitors", s.todayVisitors],
        ["Online now (~15 min)", s.onlineNow],
        ["Top country", s.topCountry],
        ["Top browser", s.topBrowser],
        ["Top OS", s.topOS],
      ];
      grid.innerHTML = `
        <div class="panel full">
          <div class="panel-head"><h3>All stats</h3><span class="panel-sub">Snapshot as of now</span></div>
          ${rows
            .map(
              ([key, val]) =>
                `<div class="settings-row"><div class="key">${escapeHtml(key)}</div><div class="val">${escapeHtml(val ?? "—")}</div></div>`
            )
            .join("")}
        </div>`;
    } catch (err) {
      grid.innerHTML = `<div class="empty-state">Couldn't load analytics (${escapeHtml(err.message)}).</div>`;
    }
  },

  /* ------------------------------------------------------------
     Users
     ------------------------------------------------------------ */
  async users(search = "") {
    const body = document.getElementById("usersTableBody");
    const countEl = document.getElementById("userCount");
    const limit = document.getElementById("userLimitSelect")?.value || "200";
    if (!body) return;

    body.innerHTML = `<tr><td colspan="7" class="loading-state">Loading users…</td></tr>`;

    try {
      const url = `${API.users}&search=${encodeURIComponent(search)}&limit=${encodeURIComponent(limit)}`;
      const data = await api(url);
      const users = data.users || [];

      if (countEl) countEl.textContent = `${users.length} user${users.length === 1 ? "" : "s"}`;

      if (!users.length) {
        body.innerHTML = `<tr><td colspan="7" class="empty-state">No users found.</td></tr>`;
        return;
      }

      body.innerHTML = users
        .map((u) => {
          const identifier = u.email || u.username || String(u.id ?? "");
          const isBanned = Boolean(u.banned) || String(u.status || "").toLowerCase() === "banned";
          const isPremium = String(u.account || "").toLowerCase() === "premium";
          const initial = (u.username || u.email || "?").charAt(0).toUpperCase();
          return `
          <tr data-identifier="${escapeHtml(identifier)}">
            <td><div class="user-cell"><span class="user-avatar">${escapeHtml(initial)}</span>${escapeHtml(u.username || "—")}</div></td>
            <td>${escapeHtml(u.email || "—")}</td>
            <td>${statusPill(isPremium ? "Premium" : "Free", isPremium ? "premium" : "free")}</td>
            <td>${escapeHtml(u.country || "—")}</td>
            <td>${fmtDate(u.date)}</td>
            <td>${statusPill(isBanned ? "Banned" : "Active", isBanned ? "banned" : "active")}</td>
            <td>
              <div class="row-actions">
                <button class="icon-btn" data-action="${isBanned ? "unban" : "ban"}" title="${isBanned ? "Unban" : "Ban"}">
                  ${isBanned ? "✅" : "⛔"}
                </button>
                <button class="icon-btn" data-action="delete" title="Delete">🗑️</button>
              </div>
            </td>
          </tr>`;
        })
        .join("");

      body.querySelectorAll("tr[data-identifier]").forEach((row) => {
        const identifier = row.dataset.identifier;
        row.querySelectorAll("[data-action]").forEach((btn) => {
          btn.addEventListener("click", () => {
            const userAction = btn.dataset.action;
            const isDanger = userAction === "delete" || userAction === "ban";
            confirmDialog({
              title: userAction === "delete" ? "Delete user" : userAction === "ban" ? "Ban user" : "Unban user",
              message: `This will ${userAction} ${identifier}. Continue?`,
              confirmLabel: userAction === "delete" ? "Delete" : userAction === "ban" ? "Ban" : "Unban",
              danger: isDanger,
              onConfirm: async () => {
                await api(API.users, { method: "POST", body: JSON.stringify({ userAction, identifier }) });
                toast(`User ${userAction === "delete" ? "deleted" : userAction === "ban" ? "banned" : "unbanned"}.`);
                Pages.users(search);
              },
            });
          });
        });
      });
    } catch (err) {
      body.innerHTML = `<tr><td colspan="7" class="empty-state">Couldn't load users (${escapeHtml(err.message)}).</td></tr>`;
    }
  },

  /* ------------------------------------------------------------
     Games
     ------------------------------------------------------------ */
  async games() {
    const grid = document.getElementById("gamesGrid");
    if (!grid) return;
    grid.innerHTML = `<div class="loading-state">Loading games…</div>`;

    try {
      const data = await api(API.games);
      const games = data.games || [];

      if (!games.length) {
        grid.innerHTML = `<div class="empty-state">No games yet. Add your first one.</div>`;
        return;
      }

      grid.innerHTML = games
        .map((g) => {
          const image = g.image || g.cover || "";
          const price = g.price === undefined || g.price === null || g.price === "" ? "Free" : `$${g.price}`;
          return `
          <div class="item-card" data-id="${escapeHtml(String(g.id))}">
            <div class="item-cover" style="${image ? `background-image:url('${escapeHtml(image)}')` : ""}">
              <span class="item-cover-title">${escapeHtml(g.title || "Untitled")}</span>
            </div>
            <div class="item-body">
              <h4>${escapeHtml(g.title || "Untitled")}</h4>
              ${g.genre || g.tag ? `<div class="item-meta">${escapeHtml(g.genre || g.tag)}</div>` : ""}
              <div class="item-desc">${escapeHtml(g.description || "")}</div>
              <div class="item-foot">
                <span class="price-tag">${escapeHtml(price)}</span>
                <div class="row-actions">
                  <button class="icon-btn" data-action="edit" title="Edit">✏️</button>
                  <button class="icon-btn" data-action="delete" title="Delete">🗑️</button>
                </div>
              </div>
            </div>
          </div>`;
        })
        .join("");

      grid.querySelectorAll(".item-card").forEach((card) => {
        const id = card.dataset.id;
        const game = games.find((g) => String(g.id) === id);
        card.querySelector('[data-action="edit"]').addEventListener("click", () => openGameForm(game));
        card.querySelector('[data-action="delete"]').addEventListener("click", () => {
          confirmDialog({
            title: "Delete game",
            message: `Delete "${game.title}"? This can't be undone.`,
            confirmLabel: "Delete",
            danger: true,
            onConfirm: async () => {
              await api(`${API.games}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
              toast("Game deleted.");
              Pages.games();
            },
          });
        });
      });
    } catch (err) {
      grid.innerHTML = `<div class="empty-state">Couldn't load games (${escapeHtml(err.message)}).</div>`;
    }
  },

  /* ------------------------------------------------------------
     News
     ------------------------------------------------------------ */
  async news() {
    const grid = document.getElementById("newsGrid");
    if (!grid) return;
    grid.innerHTML = `<div class="loading-state">Loading news…</div>`;

    try {
      const data = await api(API.news);
      const items = data.news || [];

      if (!items.length) {
        grid.innerHTML = `<div class="empty-state">No news posted yet.</div>`;
        return;
      }

      grid.innerHTML = items
        .map((n) => {
          const image = n.image || n.cover || "";
          return `
          <div class="item-card" data-id="${escapeHtml(String(n.id))}">
            <div class="item-cover" style="${image ? `background-image:url('${escapeHtml(image)}')` : ""}">
              <span class="item-cover-title">${escapeHtml(n.title || "Untitled")}</span>
            </div>
            <div class="item-body">
              <h4>${escapeHtml(n.title || "Untitled")}</h4>
              <div class="item-meta">${fmtDate(n.date)}</div>
              <div class="item-desc">${escapeHtml(n.body || "")}</div>
              <div class="item-foot">
                <span></span>
                <div class="row-actions">
                  <button class="icon-btn" data-action="edit" title="Edit">✏️</button>
                  <button class="icon-btn" data-action="delete" title="Delete">🗑️</button>
                </div>
              </div>
            </div>
          </div>`;
        })
        .join("");

      grid.querySelectorAll(".item-card").forEach((card) => {
        const id = card.dataset.id;
        const item = items.find((n) => String(n.id) === id);
        card.querySelector('[data-action="edit"]').addEventListener("click", () => openNewsForm(item));
        card.querySelector('[data-action="delete"]').addEventListener("click", () => {
          confirmDialog({
            title: "Delete news item",
            message: `Delete "${item.title}"? This can't be undone.`,
            confirmLabel: "Delete",
            danger: true,
            onConfirm: async () => {
              await api(`${API.news}&id=${encodeURIComponent(id)}`, { method: "DELETE" });
              toast("News item deleted.");
              Pages.news();
            },
          });
        });
      });
    } catch (err) {
      grid.innerHTML = `<div class="empty-state">Couldn't load news (${escapeHtml(err.message)}).</div>`;
    }
  },

  /* ------------------------------------------------------------
     Settings — masked env viewer
     ------------------------------------------------------------ */
  async settings() {
    const box = document.getElementById("settingsBox");
    if (!box) return;
    box.innerHTML = `<div class="loading-state">Loading configuration…</div>`;

    try {
      const data = await api(API.settings);
      const groups = [
        ["Bot", data.bot],
        ["Website", data.website],
        ["Integrations", data.integrations],
        ["Admin panel", data.adminPanel],
      ];
      box.innerHTML = groups
        .map(([label, group]) => {
          if (!group) return "";
          const rows = Object.entries(group)
            .map(([key, info]) => {
              const val = info.configured ? info.preview || info.value || "Set" : "Not set";
              return `<div class="settings-row"><div class="key">${escapeHtml(key)}</div><div class="val ${info.configured ? "on" : "off"}">${escapeHtml(String(val))}</div></div>`;
            })
            .join("");
          return `<div class="settings-group"><h3>${escapeHtml(label)}</h3>${rows}</div>`;
        })
        .join("");
    } catch (err) {
      box.innerHTML = `<div class="empty-state">Couldn't load settings (${escapeHtml(err.message)}).</div>`;
    }
  },

  /* ------------------------------------------------------------
     Profile
     ------------------------------------------------------------ */
  profile() {
    if (!currentAdmin) return;
    const initialsStr = initials(currentAdmin.name || "Admin");
    const avatar = document.getElementById("profileAvatar");
    const name = document.getElementById("profileName");
    const username = document.getElementById("profileUsername");
    const id = document.getElementById("profileId");
    const signedIn = document.getElementById("sessionSignedIn");
    const expires = document.getElementById("sessionExpires");

    if (avatar) avatar.textContent = initialsStr;
    if (name) name.textContent = currentAdmin.name || "Admin";
    if (username) username.textContent = currentAdmin.username ? `@${currentAdmin.username}` : "@—";
    if (id) id.textContent = currentAdmin.id != null ? String(currentAdmin.id) : "—";

    if (sessionSignedInAt) {
      const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // matches api/_lib/adminAuth.js SESSION_TTL_SECONDS
      if (signedIn) signedIn.textContent = new Date(sessionSignedInAt).toLocaleString();
      if (expires) expires.textContent = new Date(sessionSignedInAt + SESSION_TTL_MS).toLocaleString();
    }
  },
};

function initials(name) {
  return (
    String(name || "A")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((p) => p.charAt(0).toUpperCase())
      .join("") || "A"
  );
}

/* ------------------------------------------------------------
   Game / News forms — called from app.js's "Add game"/"Add news"
   buttons and from the edit buttons rendered above.
   ------------------------------------------------------------ */
function openGameForm(game) {
  const isEdit = Boolean(game && game.id);
  formDialog({
    title: isEdit ? "Edit game" : "Add game",
    submitLabel: isEdit ? "Save" : "Add",
    fields: [
      { name: "title", label: "Title", value: game?.title, placeholder: "Game title" },
      { name: "image", label: "Cover image URL", value: game?.image || game?.cover, placeholder: "https://…" },
      { name: "genre", label: "Genre / tag", value: game?.genre || game?.tag, placeholder: "e.g. Action" },
      { name: "price", label: "Price (USD, blank = free)", type: "number", value: game?.price, placeholder: "0.00" },
      { name: "description", label: "Description", type: "textarea", rows: 4, value: game?.description },
    ],
    onSubmit: async (values) => {
      const payload = {
        title: values.title.trim(),
        image: values.image.trim(),
        genre: values.genre.trim(),
        price: values.price === "" ? null : Number(values.price),
        description: values.description.trim(),
      };
      if (!payload.title) throw new Error("Title is required.");

      if (isEdit) {
        await api(API.games, { method: "PUT", body: JSON.stringify({ id: game.id, game: payload }) });
        toast("Game updated.");
      } else {
        await api(API.games, { method: "POST", body: JSON.stringify({ game: payload }) });
        toast("Game added.");
      }
      Pages.games();
    },
  });
}

function openNewsForm(item) {
  const isEdit = Boolean(item && item.id);
  formDialog({
    title: isEdit ? "Edit news item" : "Add news",
    submitLabel: isEdit ? "Save" : "Publish",
    fields: [
      { name: "title", label: "Title", value: item?.title, placeholder: "Headline" },
      { name: "image", label: "Cover image URL", value: item?.image || item?.cover, placeholder: "https://… (optional)" },
      { name: "body", label: "Body", type: "textarea", rows: 6, value: item?.body },
    ],
    onSubmit: async (values) => {
      const payload = {
        title: values.title.trim(),
        image: values.image.trim(),
        body: values.body.trim(),
      };
      if (!payload.title) throw new Error("Title is required.");
      if (!payload.body) throw new Error("Body is required.");

      if (isEdit) {
        await api(API.news, { method: "PUT", body: JSON.stringify({ id: item.id, item: payload }) });
        toast("News item updated.");
      } else {
        await api(API.news, { method: "POST", body: JSON.stringify({ item: payload }) });
        toast("News published.");
      }
      Pages.news();
    },
  });
}