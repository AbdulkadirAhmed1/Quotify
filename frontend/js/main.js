// /frontend/js/main.js

import { loadComponent } from './components.js';
import { fetchQuote } from './features/quote.js';
import { setupFiltering } from './features/filter.js'; // merged logic

window.addEventListener('DOMContentLoaded', async () => {
  await loadComponent('app', './components/01_HomeLayout.html?t=' + Date.now());

  await loadComponent('header-slot', './components/02_Header.html');
  await loadComponent('display-slot', './components/03_QuoteDisplay.html');
  await loadComponent('controls-slot', './components/04_QuoteControls.html');
  await loadComponent('search-slot', './components/05_SearchFilter.html');
  await loadComponent('list-slot', './components/06_QuoteList.html');
  await loadComponent('footer-slot', './components/07_QuoteFooter.html');

  // DOM refs
  const quoteText = document.getElementById('quote');
  const authorText = document.getElementById('author');
  const newQuoteBtn = document.getElementById('new-quote');
  const favoriteBtn = document.getElementById('favorite-btn');
  const loader = document.getElementById('loader');

  const favorites = [];

  newQuoteBtn?.addEventListener('click', () => {
    fetchQuote({ loader, quoteText, authorText });
  });

  favoriteBtn?.addEventListener('click', () => {
    const quote = quoteText.textContent;
    const author = authorText.textContent;
    if (!quote || !author) return;
    favorites.push({ text: quote, author });
    console.log('Saved to favorites:', favorites);
  });

  fetchQuote({ loader, quoteText, authorText });

  setupFiltering(); 
});