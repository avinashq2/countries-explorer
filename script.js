const API = 'https://restcountries.com/v3.1/all?fields=name,flags,capital,region,subregion,population,cca3,languages,currencies,area';
const PAGE = 24;
const $ = id => document.getElementById(id);
const grid = $('grid'), loader = $('loader'), errorBox = $('error'), emptyBox = $('empty');
const search = $('search'), region = $('region'), sort = $('sort'), more = $('more'), count = $('count');

let all = [], filtered = [], shown = 0, timer;

function el(tag, text, cls) { const e = document.createElement(tag); if (text !== undefined) e.textContent = text; if (cls) e.className = cls; return e; }
function show(box, on) { box.classList.toggle('hidden', !on); }

async function loadCountries() {
  show(errorBox, false); show(emptyBox, false); show(loader, true);
  grid.innerHTML = ''; show(more, false); count.textContent = '';
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error(`Server responded with status ${res.status}.`);
    const data = await res.json();
    if (!Array.isArray(data) || !data.length) throw new Error('No data received from the API.');
    all = data;
    fillRegions();
    applyFilters();
  } catch (err) {
    $('error-msg').textContent = err instanceof TypeError
      ? 'Network error. Please check your internet connection.'
      : `Something went wrong. ${err.message}`;
    show(errorBox, true);
  } finally {
    show(loader, false);
  }
}

function fillRegions() {
  const regions = [...new Set(all.map(c => c.region).filter(Boolean))].sort();
  region.length = 1;
  regions.forEach(r => region.appendChild(new Option(r, r)));
}

function applyFilters() {
  const q = search.value.trim().toLowerCase();
  filtered = all.filter(c =>
    (!region.value || c.region === region.value) &&
    (!q || c.name.common.toLowerCase().includes(q) || (c.capital || []).some(x => x.toLowerCase().includes(q))));
  const by = {
    'name': (a, b) => a.name.common.localeCompare(b.name.common),
    'pop-desc': (a, b) => b.population - a.population,
    'pop-asc': (a, b) => a.population - b.population,
    'area-desc': (a, b) => (b.area || 0) - (a.area || 0)
  };
  filtered.sort(by[sort.value]);
  shown = 0;
  grid.innerHTML = '';
  renderMore();
}

function renderMore() {
  filtered.slice(shown, shown + PAGE).forEach(c => grid.appendChild(card(c)));
  shown = Math.min(shown + PAGE, filtered.length);
  count.textContent = filtered.length ? `Showing ${shown} of ${filtered.length} countries` : '';
  show(emptyBox, filtered.length === 0);
  show(more, shown < filtered.length);
}

function card(c) {
  const d = el('article', undefined, 'card');
  d.tabIndex = 0;
  const img = el('img'); img.src = c.flags.png || c.flags.svg; img.alt = c.flags.alt || `Flag of ${c.name.common}`; img.loading = 'lazy';
  const info = el('div', undefined, 'info');
  info.appendChild(el('h3', c.name.common));
  [['Capital', (c.capital || ['N/A'])[0]], ['Region', c.region || 'N/A'], ['Population', c.population.toLocaleString()]].forEach(([k, v]) => {
    const p = el('p'); p.append(el('b', k + ': '), v); info.appendChild(p);
  });
  d.append(img, info);
  d.addEventListener('click', () => openModal(c));
  d.addEventListener('keydown', e => { if (e.key === 'Enter') openModal(c); });
  return d;
}

function openModal(c) {
  const body = $('modal-body');
  body.innerHTML = '';
  const img = el('img'); img.src = c.flags.png || c.flags.svg; img.alt = c.flags.alt || `Flag of ${c.name.common}`;
  const d = el('div', undefined, 'detail');
  d.append(el('h2', c.name.common), el('p', c.name.official, 'official'));
  const dl = el('dl');
  const langs = c.languages ? Object.values(c.languages).join(', ') : 'N/A';
  const curr = c.currencies ? Object.values(c.currencies).map(x => `${x.name}${x.symbol ? ' (' + x.symbol + ')' : ''}`).join(', ') : 'N/A';
  [['Capital', (c.capital || ['N/A']).join(', ')], ['Region', c.region || 'N/A'], ['Subregion', c.subregion || 'N/A'],
   ['Population', c.population.toLocaleString()], ['Area', c.area ? c.area.toLocaleString() + ' km²' : 'N/A'],
   ['Languages', langs], ['Currencies', curr], ['Country code', c.cca3]]
    .forEach(([k, v]) => dl.append(el('dt', k), el('dd', v)));
  d.appendChild(dl);
  body.append(img, d);
  $('modal').showModal();
}

search.addEventListener('input', () => { clearTimeout(timer); timer = setTimeout(applyFilters, 250); });
region.addEventListener('change', applyFilters);
sort.addEventListener('change', applyFilters);
more.addEventListener('click', renderMore);
$('retry').addEventListener('click', loadCountries);
$('close').addEventListener('click', () => $('modal').close());
$('modal').addEventListener('click', e => { if (e.target === $('modal')) $('modal').close(); });

const themeBtn = $('theme-btn');
function setTheme(dark) { document.body.classList.toggle('dark', dark); themeBtn.textContent = dark ? '☀️' : '🌙'; try { localStorage.setItem('dark', dark ? '1' : '0'); } catch (e) {} }
themeBtn.addEventListener('click', () => setTheme(!document.body.classList.contains('dark')));
try { setTheme(localStorage.getItem('dark') === '1'); } catch (e) {}

loadCountries();
