// /frontend/js/features/search.js

export function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const quoteList = document.getElementById('quote-list');
  const quoteListContainer = document.querySelector('.quote-list');

  let controller = null; // Abort controller

  searchInput?.addEventListener('input', async (e) => {
    const query = e.target.value.trim();

    // Abort previous search request if it exists
    if (controller) controller.abort();
    controller = new AbortController();

    // If too short, show early message and exit
    if (query.length < 3) {
      quoteList.innerHTML = `<div class="quote-empty">Type at least 3 characters to search.</div>`;
      quoteListContainer?.classList.remove('hidden');
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/quotes/search?query=${encodeURIComponent(query)}`, {
        signal: controller.signal
      });
      const data = await res.json();

      quoteList.innerHTML = '';

      if (!data.data || data.data.length === 0) {
        quoteList.innerHTML = `<div class="quote-empty">No quotes found.</div>`;
      } else {
        data.data.forEach(q => {
          quoteList.innerHTML += `
            <div class="quote-item">
              <div class="quote-text">"${q.text}"</div>
              <div class="quote-author">— ${q.author || 'Unknown'}</div>
            </div>
          `;
        });
      }

      quoteListContainer?.classList.remove('hidden');
    } catch (err) {
      if (err.name === 'AbortError') return; // Ignore cancelled request
      console.error('Search error:', err);
      quoteList.innerHTML = `<div class="quote-empty">Error fetching quotes.</div>`;
      quoteListContainer?.classList.remove('hidden');
    }
  });
}