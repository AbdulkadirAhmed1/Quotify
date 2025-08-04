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
      setQuotes(allQuotes);                    // store quotes globally
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

    const filtered = allQuotes.filter(q => {
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
        const card = document.createElement('div');
        card.className = 'quote-card';

        const display = document.createElement('div');
        display.className = 'quote-display';

        const message = document.createElement('div');
        message.className = 'quote-message';
        message.textContent = `"${q.text}"`;

        const author = document.createElement('div');
        author.className = 'quote-writer';
        author.textContent = `— ${q.author || 'Unknown'}`;

        display.appendChild(message);
        display.appendChild(author);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'quote-remove-btn';
        deleteBtn.textContent = '🗑️ Delete';

        // DELETE HANDLER
        deleteBtn.addEventListener('click', async () => {
          try {
            const res = await fetch(`${API_BASE_URL}/quotes/${q.id}`, {
              method: 'DELETE'
            });

            if (!res.ok) throw new Error('Delete failed');

            const updatedQuotes = getQuotes().filter(q2 => q2.id !== q.id);
            setQuotes(updatedQuotes);
            populateTags(tagFilter, updatedQuotes);
            applyFilters();  
            
            const quoteListContainer = document.querySelector('.quote-list');
            quoteListContainer?.classList.add('hidden');
          } catch (err) {
            console.error('Error deleting quote:', err);
            alert('Failed to delete quote.');
          }
        });

        card.appendChild(display);
        card.appendChild(deleteBtn);
        quoteList.appendChild(card);
      });
    }

    quoteListContainer.classList.remove('hidden');
  }
}