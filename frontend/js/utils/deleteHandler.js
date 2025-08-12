// /frontend/js/utils/deleteHandler.js

import { API_BASE_URL } from '../config.js';
import { setQuotes, getQuotes } from '../data/quotesStore.js';
import { populateTags } from './tag.js';
import { performSearch } from '../features/search.js';
import { removeFavoritesForQuote } from '../data/favoritesStore.js';
import { renderFavorites } from '../features/favorites.js';

export function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll('.quote-remove-btn');
  const tagFilter = document.getElementById('tag-filter');
  const searchInput = document.getElementById('search-input');

  deleteButtons.forEach(btn => {
    btn.removeEventListener('click', handleDelete);
    btn.addEventListener('click', handleDelete);
  });

  async function handleDelete(event) {
    const card = event.target.closest('.quote-card');
    const quoteId = card?.dataset?.id;
    if (!quoteId) {
      alert('Quote ID not found.');
      return;
    }

    // Pull text/author from the rendered card and normalize
    const rawText = card?.querySelector('.quote-message')?.textContent || '';
    const rawAuthor = card?.querySelector('.quote-writer')?.textContent || '';
    const quoteText = rawText.replace(/["“”]/g, '').trim();     // strip decorative quotes
    const quoteAuthor = rawAuthor.replace(/^—\s*/, '').trim();  // strip leading em dash

    // ---- optimistic UI update ----
    const allQuotes = getQuotes();
    const updated = allQuotes.filter(q => (q.id || q._id) !== quoteId);
    setQuotes(updated);

    // Remove the card immediately
    card?.parentElement?.removeChild(card);

    // ---- Remove any favorites for this quote (by id first, then text+author) ----
    const favsChanged = removeFavoritesForQuote({ id: quoteId, text: quoteText, author: quoteAuthor });
    if (favsChanged) renderFavorites();

    // ---- Manage tag selection + list visibility ----
    const currentTag = tagFilter?.value || '';
    const currentQuery = (searchInput?.value || '').trim();

    const tagNowEmpty = currentTag && updated.every(q => !q.tags?.includes(currentTag));
    if (tagNowEmpty) tagFilter.value = '';

    populateTags(tagFilter, updated, true);
    performSearch(currentQuery, tagFilter.value || '');

    const listContainer = document.querySelector('.quote-list');
    const hasQuery = currentQuery.length >= 3;
    const hasTag = !!tagFilter.value;
    if (!hasQuery && !hasTag) {
      const list = document.getElementById('quote-list');
      if (list) list.innerHTML = '';
      listContainer?.classList.add('hidden');
    }

    // Auto-trigger the "New Quote" button so a fresh random quote appears after delete
    const newQuoteBtn = document.getElementById('new-quote');
    if (newQuoteBtn) {
      // Let DOM updates settle first, then invoke the existing click handler
      setTimeout(() => newQuoteBtn.click(), 300);
    }

    // Rebind for any newly rendered buttons
    attachDeleteHandlers();

    // ---- fire-and-forget API call (idempotent) ----
    try {
      const res = await fetch(`${API_BASE_URL}/quotes/${quoteId}`, { method: 'DELETE' });
      // tolerate non-OK statuses; UI is already reconciled
      if (!res.ok && res.status !== 204) {
        // Optional: console.debug('Delete non-ok (ignored):', res.status);
      }
    } catch {
      // Optional: console.debug('Delete network error (ignored)');
    }
  }
}