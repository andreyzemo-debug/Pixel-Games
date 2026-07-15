/* ============================================================
   Pixel&Games — Control Room
   js/api.js — API layer, toasts, modal/form dialogs
   Talks only to /api/admin?action=... on the SAME origin as
   the Site project. This panel must be deployed alongside the
   Site backend for the admin_session cookie (SameSite=Lax) to
   be sent — it does not, and cannot, run cross-origin.
   ============================================================ */

const API = {
  session: "/api/admin?action=session",
  logout: "/api/admin?action=logout",
  botInfo: "/api/admin?action=bot-info",
  stats: "/api/admin?action=stats",
  users: "/api/admin?action=users",
  broadcast: "/api/admin?action=broadcast",
  games: "/api/admin?action=games",
  news: "/api/admin?action=news",
  settings: "/api/admin?action=settings",
};

/* ------------------------------------------------------------
   Fetch helper — mirrors the site's own admin fetch contract:
   same-origin credentials, JSON in/out, 401 -> bounce to login.
   ------------------------------------------------------------ */
async function api(url, options = {}) {
  let res;
  try {
    res = await fetch(url, {
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch (err) {
    throw new Error("Network error — could not reach the API.");
  }

  let data = {};
  try {
    data = await res.json();
  } catch {
    data = {};
  }

  if (res.status === 401) {
    if (typeof onUnauthorized === "function") onUnauthorized();
    throw new Error("unauthorized");
  }
  if (!res.ok || data.ok === false) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

/* ------------------------------------------------------------
   HTML escaping
   ------------------------------------------------------------ */
function escapeHtml(str) {
  return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]));
}

/* ------------------------------------------------------------
   Toasts
   ------------------------------------------------------------ */
function toast(message, type = "success") {
  const host = document.getElementById("toastHost");
  if (!host) return;
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => {
    el.classList.add("out");
    setTimeout(() => el.remove(), 260);
  }, 4000);
}

/* ------------------------------------------------------------
   Modal — confirm dialogs + generic forms
   ------------------------------------------------------------ */
const modalOverlay = () => document.getElementById("modalOverlay");
const modalBox = () => document.getElementById("modalBox");

function closeModal() {
  const overlay = modalOverlay();
  if (!overlay) return;
  overlay.classList.remove("show");
  modalBox().innerHTML = "";
}

(function initModalBackdrop() {
  document.addEventListener("DOMContentLoaded", () => {
    const overlay = modalOverlay();
    if (overlay) {
      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) closeModal();
      });
    }
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeModal();
    });
  });
})();

function confirmDialog({ title, message, confirmLabel = "Confirm", danger = false, onConfirm }) {
  modalBox().innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <p>${escapeHtml(message)}</p>
    <div class="modal-actions">
      <button class="btn" id="modalCancel">Cancel</button>
      <button class="btn ${danger ? "danger" : "primary"}" id="modalConfirm">${escapeHtml(confirmLabel)}</button>
    </div>
  `;
  modalOverlay().classList.add("show");
  document.getElementById("modalCancel").onclick = closeModal;
  document.getElementById("modalConfirm").onclick = async () => {
    const btn = document.getElementById("modalConfirm");
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>`;
    try {
      await onConfirm();
      closeModal();
    } catch (err) {
      toast(err.message, "error");
      btn.disabled = false;
      btn.textContent = confirmLabel;
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

  modalBox().innerHTML = `
    <h3>${escapeHtml(title)}</h3>
    <div>${fieldsHtml}</div>
    <div class="modal-actions">
      <button class="btn" id="modalCancel">Cancel</button>
      <button class="btn primary" id="modalConfirm">${escapeHtml(submitLabel)}</button>
    </div>
  `;
  modalOverlay().classList.add("show");
  document.getElementById("modalCancel").onclick = closeModal;
  const firstInput = modalBox().querySelector("input,textarea,select");
  if (firstInput) setTimeout(() => firstInput.focus(), 60);
  document.getElementById("modalConfirm").onclick = async () => {
    const values = {};
    fields.forEach((f) => {
      values[f.name] = document.getElementById(`f_${f.name}`).value;
    });
    const btn = document.getElementById("modalConfirm");
    const label = btn.textContent;
    btn.disabled = true;
    btn.innerHTML = `<span class="spinner"></span>`;
    try {
      await onSubmit(values);
      closeModal();
    } catch (err) {
      toast(err.message, "error");
      btn.disabled = false;
      btn.textContent = label;
    }
  };
}
