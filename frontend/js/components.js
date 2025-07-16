// /frontend/js/components.js
export async function loadComponent(containerId, path) {
  console.log(`Loading ${path} into #${containerId}`);
  const res = await fetch(path);
  const html = await res.text();
  document.getElementById(containerId).innerHTML = html;
}