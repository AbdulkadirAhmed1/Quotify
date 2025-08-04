// /frontend/js/data/favoritesStore.js
export const favorites = [];

export function addFavorite(text, author) {
  favorites.push({ text, author });
}

export function getFavorites() {
  return favorites;
}

export function removeFavorite(index) {
  favorites.splice(index, 1);
}