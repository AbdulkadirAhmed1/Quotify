// /frontend/js/features/filter.js 

import { API_BASE_URL } from '../config.js';
import { populateTags } from '../utils/tag.js';
import { setQuotes, getQuotes } from '../data/quotesStore.js';

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
      setQuotes(allQuotes);                    // ✅ store quotes globally
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
    const quotes = getQuotes();

    const filtered = quotes.filter(q => {
      const matchesText =
        !currentQuery ||
        q.text.toLowerCase().includes(currentQuery) ||
        q.author.toLowerCase().includes(currentQuery);
      const matchesTag =
        !currentTag || (q.tags && q.tags.includes(currentTag));
      return matchesText && matchesTag;
    });

    quoteList.innerHTML = '';

    if (!currentQuery && !currentTag) {
      quoteListContainer.classList.add('hidden');
      return;
    }

    if (filtered.length === 0) {
      quoteList.innerHTML = `<div class="quote-empty">No matching quotes found.</div>`;
    } else {
      filtered.forEach(q => {
        quoteList.innerHTML += `
          <div class="quote-item">
            <div class="quote-text">"${q.text}"</div>
            <div class="quote-author">— ${q.author || 'Unknown'}</div>
          </div>
        `;
      });
    }

    quoteListContainer.classList.remove('hidden');
  }
}