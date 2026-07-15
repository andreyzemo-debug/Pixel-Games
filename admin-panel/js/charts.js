/* Pixel&Games — charts.js */

const Charts = {

  audience(host, data = {}) {
    if (!host) return;

    const premium = data.premium || 0;
    const free = data.free || 0;
    const total = premium + free || 1;

    host.innerHTML = `
      <div class="chart-bars">
        <div>
          <span>Premium</span>
          <div class="bar">
            <i style="width:${premium / total * 100}%"></i>
          </div>
          <b>${premium}</b>
        </div>

        <div>
          <span>Free</span>
          <div class="bar">
            <i style="width:${free / total * 100}%"></i>
          </div>
          <b>${free}</b>
        </div>
      </div>
    `;
  }

};