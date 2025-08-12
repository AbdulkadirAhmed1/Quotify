// /frontend/js/features/favorites.js
import { getFavorites, removeFavorite } from '../data/favoritesStore.js';

let favContainer;

export function setupFavoritesUI() {
  const toggleFormBtn = document.getElementById('toggle-quote-form');
  const viewFavoritesBtn = document.getElementById('view-favorites-btn');
  const formContainer = document.getElementById('quote-form-container');

  favContainer = document.getElementById('favorites-container');
  if (!favContainer) {
    favContainer = document.createElement('div');
    favContainer.id = 'favorites-container';
    favContainer.classList.add('favorites-box', 'hidden');
    document.getElementById('add-quote-toggle-wrapper')?.appendChild(favContainer);
  }

  viewFavoritesBtn?.addEventListener('click', () => {
    const isVisible = !favContainer.classList.contains('hidden');
    favContainer.classList.toggle('hidden', isVisible);
    formContainer?.classList.add('hidden');
    if (!isVisible) renderFavorites();
  });

  toggleFormBtn?.addEventListener('click', () => {
    favContainer.classList.add('hidden');
  });
}

export function renderFavorites() {
  const favorites = getFavorites();
  if (!favContainer) return;

  if (favorites.length === 0) {
    favContainer.innerHTML = `<p class="empty">No favorites saved yet.</p>`;
    return;
  }

  favContainer.innerHTML = favorites
    .map((fav, index) => `
      <div class="favorite-item" data-id="${fav.id ?? ''}">
        <div class="text">❝ ${fav.text} ❞</div>
        <div class="author">— ${fav.author}</div>
        <button class="fav-delete-btn" data-index="${index}">🗑️</button>
      </div>
    `)
    .join('');

  // Per-item delete
  const deleteButtons = favContainer.querySelectorAll('.fav-delete-btn');
  deleteButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const index = btn.getAttribute('data-index');
      removeFavorite(index);
      renderFavorites();
    });
  });
}