/* ============================================================
   Pixel&Games — Control Room
   js/charts.js — small dependency-free SVG chart helpers
   ============================================================ */

const Charts = {};

/* ------------------------------------------------------------
   Donut chart. segments: [{ label, value, color }]
   Returns an HTML string: SVG donut + a legend list.
   ------------------------------------------------------------ */
Charts.donut = function (segments, { size = 148, thickness = 20, centerLabel = "", centerValue = "" } = {}) {
  const total = segments.reduce((sum, s) => sum + Math.max(0, Number(s.value) || 0), 0);
  const r = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;

  let offset = 0;
  const arcs = segments
    .map((s) => {
      const value = Math.max(0, Number(s.value) || 0);
      const frac = total > 0 ? value / total : 0;
      const dash = frac * circumference;
      const gap = circumference - dash;
      const rotation = (offset / total) * 360 - 90;
      offset += value;
      if (frac <= 0) return "";
      return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${thickness}"
        stroke-dasharray="${dash} ${gap}" transform="rotate(${rotation} ${cx} ${cy})" stroke-linecap="butt"
        style="transition: stroke-dasharray .8s cubic-bezier(.22,.9,.28,1);"></circle>`;
    })
    .join("");

  const svg = `
    <svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Donut chart">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--surface-3)" stroke-width="${thickness}"></circle>
      ${arcs}
      <text x="${cx}" y="${cy - 3}" text-anchor="middle" font-family="JetBrains Mono, monospace" font-size="20" font-weight="700" fill="var(--text)">${escapeHtml(centerValue)}</text>
      <text x="${cx}" y="${cy + 16}" text-anchor="middle" font-family="Inter, sans-serif" font-size="9.5" fill="var(--text-faint)">${escapeHtml(centerLabel)}</text>
    </svg>`;

  const legend = `
    <div class="legend">
      ${segments
        .map(
          (s) => `
        <div class="legend-row">
          <span class="legend-swatch" style="background:${s.color}"></span>
          <span>${escapeHtml(s.label)}</span>
          <b>${escapeHtml(formatNumber(s.value))}</b>
        </div>`
        )
        .join("")}
    </div>`;

  return `<div class="analytics-donut-row">${svg}${legend}</div>`;
};

/* ------------------------------------------------------------
   Horizontal bar list. rows: [{ label, value, max, color }]
   ------------------------------------------------------------ */
Charts.barList = function (rows) {
  const max = Math.max(1, ...rows.map((r) => Number(r.max ?? r.value) || 0));
  return `
    <div class="bar-list">
      ${rows
        .map((r) => {
          const value = Number(r.value) || 0;
          const pct = Math.min(100, (value / max) * 100);
          return `
          <div class="bar-row">
            <div class="bar-row-top"><span>${escapeHtml(r.label)}</span><b>${escapeHtml(formatNumber(value))}</b></div>
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%; ${r.color ? `background:${r.color}` : ""}"></div></div>
          </div>`;
        })
        .join("")}
    </div>`;
};

/* ------------------------------------------------------------
   Sparkline path (unused directly on dashboard today since the
   API doesn't expose a time series yet, kept ready for when
   Sheets.stats() grows a `history` field).
   ------------------------------------------------------------ */
Charts.sparkline = function (values, { width = 220, height = 54, color = "var(--accent)" } = {}) {
  if (!values || values.length === 0) return "";
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1 || 1);
  const points = values.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(" ");
  return `
    <svg viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" preserveAspectRatio="none">
      <polyline points="${points}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></polyline>
    </svg>`;
};

/* ------------------------------------------------------------
   Number formatting
   ------------------------------------------------------------ */
function formatNumber(n) {
  const num = Number(n);
  if (!isFinite(num)) return String(n ?? "0");
  return num.toLocaleString("en-US");
}
