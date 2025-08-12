// /frontend/js/data/favoritesStore.js

// Helpers to normalize text/author for reliable matching
function normText(s) {
  return String(s ?? "")
    .replace(/["“”]/g, "")       // remove straight/smart quotes
    .trim()
    .toLowerCase();
}

function normAuthor(s) {
  return String(s ?? "Unknown")
    .replace(/^[—\-–]\s*/u, "")  // remove leading em/en dash or hyphen + space
    .trim()
    .toLowerCase();
}

// Simple in-memory store
export const favorites = [];

/**
 * Add a favorite. id is optional for backward-compat.
 * We also store normalized copies for fast reliable comparisons.
 */
export function addFavorite(text, author, id = null) {
  const rawText = String(text ?? "").trim();
  const rawAuthor = String(author ?? "Unknown").trim();

  favorites.push({
    id: id ?? null,
    text: rawText,
    author: rawAuthor,
    _keyText: normText(rawText),       // normalized fields used for matching
    _keyAuthor: normAuthor(rawAuthor),
  });
}

export function getFavorites() {
  return favorites;
}

export function removeFavorite(index) {
  favorites.splice(Number(index), 1);
}

/** Remove by ID. Returns the number removed. */
export function removeFavoritesById(id) {
  if (!id) return 0;
  let removed = 0;
  for (let i = favorites.length - 1; i >= 0; i--) {
    if (favorites[i].id && String(favorites[i].id) === String(id)) {
      favorites.splice(i, 1);
      removed++;
    }
  }
  return removed;
}

/** Remove by text + author (case-insensitive, tolerant). Returns the number removed. */
export function removeFavoritesByQuote(text, author) {
  const keyT = normText(text);
  const keyA = normAuthor(author);
  let removed = 0;

  for (let i = favorites.length - 1; i >= 0; i--) {
    // Use precomputed normalized keys if present; fall back to on-the-fly normalize
    const ft = favorites[i]._keyText ?? normText(favorites[i].text);
    const fa = favorites[i]._keyAuthor ?? normAuthor(favorites[i].author);
    if (ft === keyT && fa === keyA) {
      favorites.splice(i, 1);
      removed++;
    }
  }
  return removed;
}

/**
 * Robust removal for a deleted quote.
 * 1) Prefer removing by id (if present in favorites)
 * 2) Fallback to removing by normalized text+author
 * Returns true if anything was removed.
 */
export function removeFavoritesForQuote({ id, text, author }) {
  const byId = removeFavoritesById(id);
  const byText = removeFavoritesByQuote(text, author);
  return (byId + byText) > 0;
}