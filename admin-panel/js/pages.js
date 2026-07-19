/* ============================================================
   Pixel&Games — Control Room
   js/pages.js — page renderers
   ============================================================ */

const Pages = {

  dashboard() {
    console.log("Dashboard loaded");
  },

  analytics() {
    console.log("Analytics loaded");
  },

  async users(search = "") {
    console.log("Users loaded", search);

    const container = document.getElementById("usersTable");
    if (!container) return;

    container.innerHTML = `
      <div class="empty-state">
        Users page ready. Waiting for API.
      </div>
    `;
  },

  games() {
    console.log("Games loaded");

    const container = document.getElementById("gamesList");
    if (!container) return;

    container.innerHTML = `
      <div class="empty-state">
        Games page ready.
      </div>
    `;
  },

  news() {
    console.log("News loaded");

    const container = document.getElementById("newsList");
    if (!container) return;

    container.innerHTML = `
      <div class="empty-state">
        News page ready.
      </div>
    `;
  },

  settings() {
    console.log("Settings loaded");
  },

  profile() {
    console.log("Profile loaded");
  },

  // ADDED — Currency Exchange admin review queue
  async exchanges(search) {
    const body = document.getElementById("exchangesTableBody");
    const countEl = document.getElementById("exchangeCount");
    if (!body) return;

    const searchTerm = search != null ? search : (document.getElementById("exchangeSearchInput")?.value.trim() || "");
    const status = document.getElementById("exchangeStatusSelect")?.value || "";

    body.innerHTML = `<tr><td colspan="9" class="loading-state">Loading exchange requests…</td></tr>`;

    let data;
    try {
      const url = `${API.exchanges}&status=${encodeURIComponent(status)}&search=${encodeURIComponent(searchTerm)}`;
      data = await api(url);
    } catch (err) {
      body.innerHTML = `<tr><td colspan="9" class="empty-state">${escapeHtml(err.message || "Could not load exchange requests.")}</td></tr>`;
      return;
    }

    const requests = data.requests || [];
    if (countEl) countEl.textContent = `${requests.length} request${requests.length === 1 ? "" : "s"}`;

    if (!requests.length) {
      body.innerHTML = `<tr><td colspan="9" class="empty-state">No exchange requests match this filter.</td></tr>`;
      return;
    }

    body.innerHTML = requests.map((r) => renderExchangeRow(r)).join("");

    requests.forEach((r) => {
      if (r.status !== "pending") return;
      document.getElementById(`exApprove_${r.requestId}`)?.addEventListener("click", () => confirmExchangeAction(r, "approve"));
      document.getElementById(`exReject_${r.requestId}`)?.addEventListener("click", () => confirmExchangeAction(r, "reject"));
    });
  }

};

// ADDED — Currency Exchange row + action helpers
function renderExchangeRow(r) {
  const usd = Number(r.usdAmount || 0).toFixed(2);
  const date = String(r.createdAt || "").slice(0, 16).replace("T", " ");
  const statusClass = { pending: "banned", approved: "active", completed: "active", rejected: "banned" }[r.status] || "free";
  // reuses the existing .pill classes (premium/free/active/banned) from users — approved/completed
  // read as "good" (active look), pending/rejected as attention-needed (banned look).
  const pillClass = r.status === "pending" ? "premium" : statusClass;

  const actions = r.status === "pending"
    ? `
      <button class="btn small" id="exApprove_${escapeHtml(r.requestId)}">Approve</button>
      <button class="btn small danger" id="exReject_${escapeHtml(r.requestId)}">Reject</button>
    `
    : "";

  return `
    <tr>
      <td><code>${escapeHtml(r.requestId)}</code></td>
      <td>${escapeHtml(r.username || r.email || r.userId || "—")}</td>
      <td>🪙 ${Number(r.coins || 0).toLocaleString()}</td>
      <td>$${usd}</td>
      <td>${escapeHtml(r.paymentMethod || "—")}</td>
      <td>${escapeHtml(r.payoutDetails || "—")}</td>
      <td>${escapeHtml(date)}</td>
      <td><span class="pill ${pillClass}">${escapeHtml(r.status)}</span></td>
      <td style="white-space:nowrap;">${actions}</td>
    </tr>
  `;
}

function confirmExchangeAction(request, exchangeAction) {
  const verb = exchangeAction === "approve" ? "Approve" : "Reject";
  const extra = exchangeAction === "reject"
    ? " The player's coins will be refunded automatically."
    : " Make sure the payout has been sent before approving.";
  confirmDialog({
    title: `${verb} exchange request`,
    message: `${verb} the request for $${Number(request.usdAmount || 0).toFixed(2)} (${request.coins} coins) from ${request.username || request.email || request.userId}?${extra}`,
    confirmLabel: verb,
    danger: exchangeAction === "reject",
    onConfirm: async () => {
      await api(API.exchanges, {
        method: "POST",
        body: JSON.stringify({ requestId: request.requestId, exchangeAction }),
      });
      toast(`Request ${exchangeAction === "approve" ? "approved" : "rejected"}.`);
      Pages.exchanges();
    },
  });
}