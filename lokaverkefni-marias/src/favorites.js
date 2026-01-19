const KEY = "favorites_v1";

export function getFavoriteIds() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setFavoriteIds(ids) {
  localStorage.setItem(KEY, JSON.stringify(ids));
}

export function isFavorite(id) {
  const ids = getFavoriteIds();
  return ids.includes(id);
}

export function toggleFavorite(id) {
  const ids = getFavoriteIds();
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
  setFavoriteIds(next);
  return next;
}

export function removeFavorite(id) {
  const ids = getFavoriteIds();
  const next = ids.filter((x) => x !== id);
  setFavoriteIds(next);
  return next;
}
