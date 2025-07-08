// /frontend/js/main.js
const quoteText = document.getElementById('quote');
const authorText = document.getElementById('author');
const newQuoteBtn = document.getElementById('new-quote');
const loader = document.getElementById('loader');

async function fetchQuote() {
  try {
    // Show loader and hide quote while loading
    loader.classList.remove('hidden');
    quoteText.classList.add('hidden');
    authorText.classList.add('hidden');

    const res = await fetch('http://127.0.0.1:8000/quotes/random');
    const data = await res.json();

    //  Optional delay to make the loading visible (e.g. 700ms)
    await new Promise(resolve => setTimeout(resolve, 700));

    quoteText.textContent = `"${data.data.text}"`;
    authorText.textContent = data.data.author ? `— ${data.data.author}` : '— Unknown';

  } catch (err) {
    quoteText.textContent = 'Error fetching quote.';
    authorText.textContent = '';
  } finally {
    // Hide loader and show quote after fetch completes
    loader.classList.add('hidden');
    quoteText.classList.remove('hidden');
    authorText.classList.remove('hidden');
  }
}


newQuoteBtn.addEventListener('click', fetchQuote);

// Load one on first open
fetchQuote();