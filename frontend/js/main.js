// /frontend/js/main.js
import { loadComponent } from './components.js';
import { fetchQuote } from './features/quote.js';
import { setupFiltering } from './features/filter.js';
import { setupAddQuoteForm } from './features/addQuote.js';
import { setupFavoritesUI, renderFavorites  } from './features/favorites.js';
import { favorites, addFavorite } from './data/favoritesStore.js';

window.addEventListener('DOMContentLoaded', async () => {
  const timestamp = Date.now();

  await loadComponent('app', './components/01_HomeLayout.html?t=' + timestamp);
  await loadComponent('header-slot', `./components/02_Header.html?t=${timestamp}`);
  await loadComponent('display-slot', `./components/03_QuoteDisplay.html?t=${timestamp}`);
  await loadComponent('controls-slot', `./components/04_QuoteControls.html?t=${timestamp}`);
  await loadComponent('search-slot', `./components/05_SearchFilter.html?t=${timestamp}`);
  await loadComponent('list-slot', `./components/06_QuoteList.html?t=${timestamp}`);
  await loadComponent('form-slot', `./components/08_AddQuoteForm.html?t=${timestamp}`);
  await loadComponent('footer-slot', `./components/07_QuoteFooter.html?t=${timestamp}`);

  const quoteText = document.getElementById('quote');
  const authorText = document.getElementById('author');
  const newQuoteBtn = document.getElementById('new-quote');
  const favoriteBtn = document.getElementById('favorite-btn');
  const loader = document.getElementById('loader');

  //const favorites = [];

  newQuoteBtn?.addEventListener('click', () => {
    fetchQuote({ loader, quoteText, authorText });
  });

  favoriteBtn?.addEventListener('click', () => {
    const quote = quoteText.textContent;
    const author = authorText.textContent;
    if (!quote || !author) return;

    addFavorite(quote, author);
    console.log('Saved to favorites:', favorites);

    renderFavorites(); // immediately refresh
  });

  fetchQuote({ loader, quoteText, authorText });

  setupFiltering();
  setupAddQuoteForm();
  setupFavoritesUI(favorites);
});