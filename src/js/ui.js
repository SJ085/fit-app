function renderExerciseList() {
  const container = document.getElementById("exerciseList");

  container.innerHTML = exercises
    .map(
      ex => `
      <div class="bg-gray-900 p-4 rounded-xl flex gap-4 items-center">
        <img src="${ex.img}" class="w-16 h-16 rounded-lg object-cover">
        <div class="flex flex-col">
          <span class="font-bold">${ex.name}</span>
          <span class="text-green-500">${ex.muscle}</span>
          <span class="text-gray-400 text-sm">${ex.series}</span>
        </div>
      </div>
    `
    )
    .join("");
}