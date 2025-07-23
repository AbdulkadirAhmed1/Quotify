// /frontend/js/features/favorites.js
import { getFavorites } from '../data/favoritesStore.js';

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

  favContainer.innerHTML = favorites.map(fav => `
    <div class="favorite-item">
      <div class="text">❝ ${fav.text} ❞</div>
      <div class="author">— ${fav.author}</div>
    </div>
  `).join('');
}