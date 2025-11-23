async function carregarTreino() {
  try {
    const response = await fetch("../data/treinos.json");
    const data = await response.json();

    const treino = data.treino_do_dia;

    document.getElementById("tituloTreino").textContent = treino.grupo || "Treino do Dia";

    const lista = document.getElementById("listaTreinos");
    lista.innerHTML = "";

    treino.exercicios.forEach(ex => {
      const li = document.createElement("li");
      li.className = "bg-zinc-900 p-4 rounded-xl border border-zinc-800 hover:border-zinc-700 transition";

      li.innerHTML = `
        <h2 class="font-bold">${ex.nome}</h2>
        <p class="text-zinc-400">${ex.series} séries de ${ex.reps} repetições</p>
      `;

      lista.appendChild(li);
    });

  } catch (error) {
    console.error("Erro ao carregar treino:", error);
  }
}

carregarTreino();