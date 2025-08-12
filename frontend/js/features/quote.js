// /frontend/js/features/quote.js

import { API_BASE_URL } from '../config.js';

export async function fetchQuote({ loader, quoteText, authorText }) {
  try {
    loader.classList.remove('hidden');
    quoteText.classList.add('hidden');
    authorText.classList.add('hidden');

    const res = await fetch(`${API_BASE_URL}/quotes/random`);
    const data = await res.json();

    await new Promise(resolve => setTimeout(resolve, 700));

    quoteText.textContent = `"${data.data.text}"`;
    authorText.textContent = data.data.author ? `— ${data.data.author}` : '— Unknown';
  } catch (err) {
    quoteText.textContent = 'No quotes found';
    authorText.textContent = '';
  } finally {
    loader.classList.add('hidden');
    quoteText.classList.remove('hidden');
    authorText.classList.remove('hidden');
  }
}