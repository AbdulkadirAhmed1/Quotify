import { API_BASE_URL } from '../config.js';

export function setupAddQuoteForm() {
  const toggleBtn = document.getElementById('toggle-quote-form');
  const formContainer = document.getElementById('quote-form-container');
  const form = document.getElementById('quote-form');
  const quoteInput = document.getElementById('quote-input');
  const authorInput = document.getElementById('author-input');
  const formMessage = document.getElementById('form-message');
  const loader = document.getElementById('form-loader'); // ✅ Now points to correct loader in HTML

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

    loader?.classList.remove('hidden'); // ✅ Show spinner
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

      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated delay

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
      loader?.classList.add('hidden'); // ✅ Hide spinner

      setTimeout(() => {
        formMessage.textContent = '';
      }, 3000);
    }
  });
}