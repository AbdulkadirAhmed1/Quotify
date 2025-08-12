// /frontend/js/utils/tag.js

export function populateTags(selectEl, quotes, preserveSelection = true) {
  const tagSet = new Set();
  quotes.forEach(q => q.tags?.forEach(tag => tagSet.add(tag)));

  const prevValue = preserveSelection ? selectEl.value : '';

  selectEl.innerHTML = '<option value="">Filter by Tag 🔽</option>';
  [...tagSet].sort().forEach(tag => {
    const option = document.createElement('option');
    option.value = tag;
    option.textContent = tag;
    // keep selection if still present
    if (preserveSelection && tag === prevValue) option.selected = true;
    selectEl.appendChild(option);
  });

  // if previous tag no longer exists, force reset to default
  if (preserveSelection) {
    if (!tagSet.has(prevValue)) {
      selectEl.value = '';
    } else {
      selectEl.value = prevValue;
    }
  }
}