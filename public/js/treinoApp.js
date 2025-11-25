// src/js/treinoApp.js
import { load, save, formatDateKey } from './utils.js';
import { createTimer } from './timer.js';

const DATA_PATH = '/data/treinos.json';
const STORAGE_KEY_PREFIX = 'fitapp:treino:';

async function fetchData() {
  const res = await fetch(DATA_PATH);
  return res.json();
}

function getTodayDayKey() {
  const n = new Date().getDay(); // 0..6
  return n;
}

function renderNoTreino(container, diaNome) {
  container.innerHTML = `
    <div class="bg-zinc-900 p-6 rounded-2xl text-center">
      <p class="text-zinc-400 mb-3">Hoje (${diaNome}) não há treino programado.</p>
      <p class="text-sm text-zinc-500">Você pode escolher um treino A/B/C/D/E no menu.</p>
    </div>
  `;
}

function createExerciseCard(ex, checked=false) {
  const li = document.createElement('div');
  li.className = 'bg-zinc-900 p-4 rounded-xl border border-zinc-800 flex justify-between items-center';
  li.innerHTML = `
    <div>
      <div class="font-bold text-white">${ex.nome}</div>
      <div class="text-zinc-400 text-sm">${ex.series} x ${ex.reps}</div>
    </div>
    <div class="flex gap-3 items-center">
      <button class="px-3 py-1 bg-zinc-800 rounded-md text-sm timer-btn">⏱️</button>
      <label class="flex items-center gap-2">
        <input type="checkbox" class="chk-ex" ${checked ? 'checked' : ''} />
        <span class="text-sm text-zinc-400">Feito</span>
      </label>
    </div>
  `;
  return li;
}

function buildProgress(total, done) {
  const pct = total === 0 ? 0 : Math.round((done/total)*100);
  return `
    <div class="w-full bg-zinc-800 rounded-full h-2 overflow-hidden">
      <div style="width:${pct}%" class="h-2 bg-green-500 transition-all"></div>
    </div>
    <div class="text-xs text-zinc-400 mt-2">${done} de ${total} • ${pct}%</div>
  `;
}

async function init() {
  const data = await fetchData();
  const mapDias = data.mapDias;
  const semana = data.semana;
  const treinos = data.treinos;

  // detect day
  const todayIndex = getTodayDayKey();
  const diaNome = mapDias[todayIndex];
  const diaInfo = semana[diaNome];
  const treinoId = diaInfo?.treino || null;

  const app = document.getElementById('app');
  app.innerHTML = ''; // clean

  // header area
  const header = document.createElement('header');
  header.className = 'flex items-center justify-between mb-4';
  header.innerHTML = `
    <div>
      <h1 id="treinoTitle" class="text-3xl font-bold">Treino de Hoje</h1>
      <p class="text-zinc-400 text-sm mt-1">Dia: <span id="diaNome">${diaNome}</span></p>
    </div>
  `;
  app.appendChild(header);

  if (!treinoId) {
    renderNoTreino(app, diaNome);
    return;
  }

  const treinoDef = treinos[treinoId];
  const treinoTitle = treinoDef.titulo;

  document.getElementById('treinoTitle').textContent = treinoTitle + ' • ' + treinoId;

  // container
  const container = document.createElement('section');
  container.className = 'space-y-4';
  app.appendChild(container);

  // progress placeholder
  const progressWrap = document.createElement('div');
  progressWrap.innerHTML = buildProgress(0,0);
  container.appendChild(progressWrap);

  // lista
  const ul = document.createElement('div');
  ul.id = 'lista';
  ul.className = 'flex flex-col gap-3';
  container.appendChild(ul);

  // load progress from storage
  const dateKey = formatDateKey(new Date());
  const storageKey = STORAGE_KEY_PREFIX + dateKey + ':' + treinoId;
  const saved = load(storageKey, { done: [] });

  // populate exercises
  treinoDef.exercicios.forEach(ex => {
    const isDone = saved.done.includes(ex.id);
    const card = createExerciseCard(ex, isDone);

    // events: checkbox
    const chk = card.querySelector('.chk-ex');
    chk.addEventListener('change', () => {
      const allChecks = Array.from(document.querySelectorAll('.chk-ex'));
      const doneIds = treinoDef.exercicios
        .filter((_, idx) => allChecks[idx].checked)
        .map((e, idx) => treinoDef.exercicios[idx].id);

      save(storageKey, { done: doneIds });

      // update progress
      const done = doneIds.length;
      progressWrap.innerHTML = buildProgress(treinoDef.exercicios.length, done);
    });

    // timer button
    const tbtn = card.querySelector('.timer-btn');
    tbtn.addEventListener('click', () => {
      openTimerModal();
    });

    ul.appendChild(card);
  });

  // set initial progress
  const initialDone = (saved.done || []).length;
  progressWrap.innerHTML = buildProgress(treinoDef.exercicios.length, initialDone);

  // timer modal container
  const timerContainer = document.createElement('div');
  timerContainer.id = 'timerModal';
  timerContainer.className = 'fixed inset-0 hidden items-center justify-center bg-black/60 p-4';
  timerContainer.innerHTML = `
    <div class="bg-zinc-900 p-4 rounded-xl w-full max-w-sm">
      <div class="flex justify-between items-center mb-3">
        <h4 class="font-bold">Timer de Descanso</h4>
        <button id="closeTimer" class="text-zinc-400">Fechar</button>
      </div>
      <div class="flex items-center justify-center mb-3">
        <div id="timerDisplay" class="text-4xl font-bold">00:00</div>
      </div>
      <div class="flex gap-2 justify-center mb-3">
        <button class="preset px-3 py-1 rounded bg-zinc-800" data-sec="30">30s</button>
        <button class="preset px-3 py-1 rounded bg-zinc-800" data-sec="45">45s</button>
        <button class="preset px-3 py-1 rounded bg-zinc-800" data-sec="60">60s</button>
        <button class="preset px-3 py-1 rounded bg-zinc-800" data-sec="90">90s</button>
      </div>
      <div class="flex gap-2 justify-center">
        <button id="startTimer" class="px-4 py-2 rounded bg-green-500 text-black font-bold">Start</button>
        <button id="stopTimer" class="px-4 py-2 rounded bg-zinc-700">Stop</button>
      </div>
    </div>
  `;
  document.body.appendChild(timerContainer);

  // timer logic
  const display = document.getElementById('timerDisplay');
  const timer = createTimer(display);

  function openTimerModal() {
    timerContainer.classList.remove('hidden');
  }
  function closeTimerModal() {
    timerContainer.classList.add('hidden');
    timer.stop && timer.stop();
  }

  document.getElementById('closeTimer').addEventListener('click', closeTimerModal);
  document.getElementById('startTimer').addEventListener('click', () => {
    // default 45s if no preset selected
    timer.start(45);
  });
  document.getElementById('stopTimer').addEventListener('click', () => timer.stop());

  document.querySelectorAll('.preset').forEach(b => {
    b.addEventListener('click', (e) => {
      const sec = Number(e.target.dataset.sec);
      timer.start(sec);
    });
  });

  // theme toggle (simple)
  const btnTheme = document.getElementById('btnTheme');
  const themeKey = 'fitapp:theme';
  const savedTheme = load(themeKey, 'dark');
  if (savedTheme === 'dark') document.documentElement.classList.add('dark');
  btnTheme.addEventListener('click', () => {
    const has = document.documentElement.classList.toggle('dark');
    save(themeKey, has ? 'dark' : 'light');
  });
}

init().catch(err => {
  console.error(err);
  const app = document.getElementById('app');
  app.innerHTML = `<p class="text-red-500">Erro ao carregar treino.</p>`;
});