function drawViz(data, config) {
  const container = document.getElementById('viz-container');
  container.innerHTML = '';

  if (!data || data.rows.length === 0) {
    container.innerHTML = "<p>Aucune donnée disponible</p>";
    return;
  }

  // Récupération des données
  const current = data.rows[0].values[0];
  const previous = data.rows[0].values[1];
  const trendValues = data.rows.map(row => row.values[2]);
  const trendLabels = data.rows.map(row => row.dimensions[0]);

  // Calcul variation %
  let change = null;
  if (previous !== 0 && previous !== null) {
    change = ((current - previous) / previous) * 100;
  }

  const changeClass = change >= 0 ? 'up' : 'down';
  const arrow = change >= 0 ? '▲' : '▼';

  // HTML principal
  const html = `
    <div class="card">
      <div class="value">${current.toLocaleString()}</div>
      <div class="previous">Mois précédent : ${previous.toLocaleString()}</div>
      <div class="change ${changeClass}">${arrow} ${Math.abs(change).toFixed(1)}%</div>
      <div class="chart-container"><canvas id="trendChart"></canvas></div>
    </div>
  `;
  container.innerHTML = html;

  // Chart.js sparkline
  const ctx = document.getElementById('trendChart').getContext('2d');
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: trendLabels,
      datasets: [{
        data: trendValues,
        borderColor: change >= 0 ? 'green' : 'red',
        fill: false,
        tension: 0.3,
        pointRadius: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { display: false },
        y: { display: false }
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function() {
  const root = document.createElement('div');
  root.id = "viz-container";
  document.body.appendChild(root);
});
