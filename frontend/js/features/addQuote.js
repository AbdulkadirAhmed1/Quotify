// /frontend/js/features/addQuote.js
import { API_BASE_URL } from '../config.js';

export function setupAddQuoteForm() {
  const toggleBtn = document.getElementById('toggle-quote-form');
  const formContainer = document.getElementById('quote-form-container');
  const form = document.getElementById('quote-form');
  const quoteInput = document.getElementById('quote-input');
  const authorInput = document.getElementById('author-input');
  const formMessage = document.getElementById('form-message');

  // NEW: Create or grab loader
  let loader = document.getElementById('form-loader');
  if (!loader) {
    loader = document.createElement('div');
    loader.id = 'form-loader';
    loader.classList.add('hidden');
    formContainer.prepend(loader);
  }

  toggleBtn?.addEventListener('click', () => {
    formContainer.classList.toggle('hidden');
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newQuote = quoteInput.value.trim();
    const newAuthor = authorInput.value.trim() || 'Anonymous';

    if (!newQuote) {
      formMessage.textContent = 'Quote text cannot be empty.';
      return;
    }

    // Show loader and hide message
    loader.classList.remove('hidden');
    formMessage.textContent = '';

    try {
      const res = await fetch(`${API_BASE_URL}/quotes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: newQuote,
          author: newAuthor,
          tags: [],
        }),
      });

      // Simulated delay for testing visual feedback
      await new Promise(resolve => setTimeout(resolve, 1500));

      const result = await res.json();

      if (res.ok && result.success) {
        formMessage.textContent = 'Quote added successfully!';
        quoteInput.value = '';
        authorInput.value = '';
      } else {
        formMessage.textContent = result.message || 'Failed to add quote.';
      }
    } catch (err) {
      console.error('Error submitting quote:', err);
      formMessage.textContent = 'Error submitting quote.';
    } finally {
      loader.classList.add('hidden');

      // Optional: Hide message after 3 seconds
      setTimeout(() => {
        formMessage.textContent = '';
      }, 3000);
    }
  });
}