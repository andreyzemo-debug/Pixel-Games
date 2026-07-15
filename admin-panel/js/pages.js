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
  }

};