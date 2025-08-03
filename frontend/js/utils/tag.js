// /frontend/js/utils/tags.js

export function populateTags(selectEl, quotes) {
  const tagSet = new Set();

  quotes.forEach(q => {
    q.tags?.forEach(tag => tagSet.add(tag));
  });

  selectEl.innerHTML = '<option value="">Filter by Tag 🔽</option>';

  [...tagSet].sort().forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    selectEl.appendChild(option);
  });
}