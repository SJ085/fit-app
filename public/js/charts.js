const ctx = document.getElementById("pesoChart");

new Chart(ctx, {
  type: "line",
  data: {
    labels: ["01", "05", "10", "15", "18"],
    datasets: [
      {
        label: "Peso (kg)",
        data: [52.0, 52.8, 53.2, 54.1, 55.5],
        borderWidth: 3,
        tension: 0.4,
        borderColor: "#22c55e",
        pointRadius: 5,
        pointBackgroundColor: "#22c55e",
        pointBorderColor: "#14532d",
        fill: false,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        ticks: {
          color: "#aaa",
        },
        grid: {
          color: "rgba(255,255,255,0.05)",
        },
      },
      x: {
        ticks: {
          color: "#aaa",
        },
        grid: {
          display: false,
        },
      },
    },
  },
});
