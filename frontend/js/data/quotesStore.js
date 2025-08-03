// /frontend/js/data/quotesStore.js

let quotes = [];

export function setQuotes(newQuotes) {
  quotes = newQuotes;
}

export function getQuotes() {
  return quotes;
}