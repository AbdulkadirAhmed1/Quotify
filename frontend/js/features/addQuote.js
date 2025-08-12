// /frontend/js/features/addQuote.js

import { API_BASE_URL } from '../config.js';
import { populateTags } from '../utils/tag.js';
import { performSearch } from './search.js';
import { setQuotes } from '../data/quotesStore.js';
import { attachDeleteHandlers } from '../utils/deleteHandler.js'; // added

export function setupAddQuoteForm() {
  const toggleBtn = document.getElementById('toggle-quote-form');
  const formContainer = document.getElementById('quote-form-container');
  const form = document.getElementById('quote-form');
  const quoteInput = document.getElementById('quote-input');
  const authorInput = document.getElementById('author-input');
  const tagsInput = document.getElementById('tags-input');
  const formMessage = document.getElementById('form-message');
  const loader = document.getElementById('form-loader');

  toggleBtn?.addEventListener('click', () => {
    formContainer.classList.toggle('hidden');
    if (!formContainer.classList.contains('hidden')) {
      quoteInput.focus();
    }
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newQuote = quoteInput.value.trim();
    const rawAuthor = authorInput.value.trim();
    const rawTags = tagsInput.value.trim();

    const newAuthor = rawAuthor || 'Anonymous';
    const tags = rawTags ? rawTags.split(',').map(tag => tag.trim()).filter(Boolean) : [];

    if (!newQuote) {
      formMessage.textContent = 'Quote text cannot be empty.';
      return;
    }

    loader?.classList.remove('hidden');
    formMessage.textContent = '';

    try {
      const res = await fetch(`${API_BASE_URL}/quotes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newQuote, author: newAuthor, tags }),
      });

      await new Promise(resolve => setTimeout(resolve, 1500));
      const result = await res.json();

      if (res.ok && result.success) {
        form.reset();

        const tagFilter = document.getElementById('tag-filter');
        const searchInput = document.getElementById('search-input');
        const currentSearch = searchInput?.value?.trim() || '';
        const currentTag = tagFilter?.value || '';

        const updatedQuotesRes = await fetch(`${API_BASE_URL}/quotes`);
        const updatedQuotesData = await updatedQuotesRes.json();
        const updatedQuotes = updatedQuotesData.data || [];

        setQuotes(updatedQuotes);
        populateTags(tagFilter, updatedQuotes, true);

        if ((currentSearch.length >= 3) || currentTag) {
          performSearch(currentSearch, currentTag);
          attachDeleteHandlers(); // cleaner, centralized binding
        }

        // Auto-trigger the "New Quote" button so a fresh random quote appears
        const newQuoteBtn = document.getElementById('new-quote');
        if (newQuoteBtn) {
          // Let the UI settle first, then click
          setTimeout(() => newQuoteBtn.click(), 300);
        }
      } else {
        formMessage.textContent = result.message || 'Failed to add quote.';
      }
    } catch (err) {
      console.error('Error submitting quote:', err);
      formMessage.textContent = 'Error submitting quote.';
    } finally {
      loader?.classList.add('hidden');
      setTimeout(() => { formMessage.textContent = ''; }, 3000);
    }
  });
}