// /frontend/js/features/filter.js

import { API_BASE_URL } from '../config.js';
import { populateTags } from '../utils/tag.js';
import { setQuotes, getQuotes } from '../data/quotesStore.js';
import { attachDeleteHandlers } from '../utils/deleteHandler.js';

let currentQuery = '';
let currentTag = '';

export function setupFiltering() {
  const searchInput = document.getElementById('search-input');
  const tagFilter = document.getElementById('tag-filter');
  const quoteList = document.getElementById('quote-list');
  const quoteListContainer = document.querySelector('.quote-list');

  if (!searchInput || !tagFilter || !quoteList) return;

  fetch(`${API_BASE_URL}/quotes`)
    .then(res => res.json())
    .then(data => {
      const allQuotes = data.data || [];
      setQuotes(allQuotes);
      populateTags(tagFilter, allQuotes);
    })
    .catch(err => console.error('Error loading quotes:', err));

  searchInput.addEventListener('input', e => {
    currentQuery = e.target.value.trim().toLowerCase();
    applyFilters();
  });

  tagFilter.addEventListener('change', e => {
    currentTag = e.target.value;
    applyFilters();
  });

  function applyFilters() {
    const allQuotes = getQuotes();
    const hasQuery = !!currentQuery && currentQuery.length >= 3;
    const hasTag = !!currentTag;

    const filtered = allQuotes.filter(q => {
      const t = (q.text || '').toLowerCase();
      const a = (q.author || '').toLowerCase();
      const matchesText = !hasQuery || t.includes(currentQuery) || a.includes(currentQuery);
      const matchesTag = !hasTag || (q.tags && q.tags.includes(currentTag));
      return matchesText && matchesTag;
    });

    quoteList.innerHTML = '';

    // hide container if no active filters
    if (!hasQuery && !hasTag) {
      quoteListContainer.classList.add('hidden');
      return;
    }

    if (filtered.length === 0) {
      quoteList.innerHTML = `<div class="quote-empty">No matching quotes found.</div>`;
    } else {
      filtered.forEach(q => {
        const id = q.id || q._id; // support both
        const card = document.createElement('div');
        card.className = 'quote-card';
        card.dataset.id = id;

        const display = document.createElement('div');
        display.className = 'quote-display';

        const message = document.createElement('div');
        message.className = 'quote-message';
        message.textContent = `"${q.text}"`;

        const author = document.createElement('div');
        author.className = 'quote-writer';
        author.textContent = `— ${q.author || 'Unknown'}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'quote-remove-btn';
        deleteBtn.textContent = '🗑️ Delete';

        display.appendChild(message);
        display.appendChild(author);
        card.appendChild(display);
        card.appendChild(deleteBtn);
        quoteList.appendChild(card);
      });

      attachDeleteHandlers();
    }

    quoteListContainer.classList.remove('hidden');
  }
}