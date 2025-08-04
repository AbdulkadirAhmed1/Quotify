// /frontend/js/features/search.js

import { getQuotes } from '../data/quotesStore.js';

export function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const tagFilter = document.getElementById('tag-filter');

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim();
    const tag = tagFilter?.value || '';
    performSearch(query, tag);
  });

  tagFilter?.addEventListener('change', () => {
    const query = searchInput?.value.trim() || '';
    const tag = tagFilter?.value || '';
    performSearch(query, tag);
  });
}

export async function performSearch(query, tag) {
  const quoteList = document.getElementById('quote-list');
  const quoteListContainer = document.querySelector('.quote-list');

  if (!quoteList || !quoteListContainer) return;

  if ((!query || query.length < 3) && !tag) {
    quoteList.innerHTML = `<div class="quote-empty">Type at least 3 characters to search.</div>`;
    quoteListContainer.classList.remove('hidden');
    return;
  }

  const allQuotes = getQuotes();

  const filtered = allQuotes.filter(q => {
    const matchText =
      !query ||
      q.text.toLowerCase().includes(query.toLowerCase()) ||
      q.author.toLowerCase().includes(query.toLowerCase());

    const matchTag = !tag || (q.tags && q.tags.includes(tag));
    return matchText && matchTag;
  });

  quoteList.innerHTML = '';

  if (filtered.length === 0) {
    quoteList.innerHTML = `<div class="quote-empty">No quotes found.</div>`;
  } else {
filtered.forEach(q => {
  quoteList.innerHTML += `
    <div class="quote-card">
      <div class="quote-display">
        <div class="quote-message">"${q.text}"</div>
        <div class="quote-writer">— ${q.author || 'Unknown'}</div>
      </div>
      <button class="quote-remove-btn">🗑️ Delete</button>
    </div>
  `;
});
  }

  quoteListContainer.classList.remove('hidden');
}