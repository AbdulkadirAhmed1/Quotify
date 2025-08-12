// /frontend/js/features/search.js

import { getQuotes } from '../data/quotesStore.js';
import { attachDeleteHandlers } from '../utils/deleteHandler.js';

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

export function performSearch(query, tag) {
  const quoteList = document.getElementById('quote-list');
  const quoteListContainer = document.querySelector('.quote-list');
  if (!quoteList || !quoteListContainer) return;

  const hasQuery = !!query && query.length >= 3;
  const hasTag = !!tag;

  // If nothing active, hide container entirely
  if (!hasQuery && !hasTag) {
    quoteList.innerHTML = '';
    quoteListContainer.classList.add('hidden');
    return;
  }

  const allQuotes = getQuotes();
  const filtered = allQuotes.filter(q => {
    const t = (q.text || '').toLowerCase();
    const a = (q.author || '').toLowerCase();
    const matchText = !hasQuery || t.includes(query.toLowerCase()) || a.includes(query.toLowerCase());
    const matchTag = !hasTag || (q.tags && q.tags.includes(tag));
    return matchText && matchTag;
  });

  quoteList.innerHTML = '';

  if (filtered.length === 0) {
    // show "no results" only when user is actually filtering/searching
    quoteList.innerHTML = `<div class="quote-empty">No quotes found.</div>`;
    quoteListContainer.classList.remove('hidden');
  } else {
    filtered.forEach(q => {
      const id = q.id || q._id; // handle both shapes
      quoteList.innerHTML += `
        <div class="quote-card" data-id="${id}">
          <div class="quote-display">
            <div class="quote-message">"${q.text}"</div>
            <div class="quote-writer">— ${q.author || 'Unknown'}</div>
          </div>
          <button class="quote-remove-btn">🗑️ Delete</button>
        </div>
      `;
    });
    quoteListContainer.classList.remove('hidden');
    attachDeleteHandlers(); // rebind
  }
}