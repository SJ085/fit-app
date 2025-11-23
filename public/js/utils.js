// src/js/utils.js
export function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function load(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function formatDateKey(date = new Date()) {
  return date.toISOString().slice(0,10); // YYYY-MM-DD
}