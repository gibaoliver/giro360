/**
 * DIÁRIO NACIONAL - SCRIPT DA PÁGINA DE NOTÍCIAS (noticias.html)
 * Filtros por categoria, ordenação e pesquisa em tempo real.
 */

let activeCategory = 'all';
let searchQuery = '';
let currentSort = 'recent';

document.addEventListener('DOMContentLoaded', () => {
  // Ler categoria inicial da URL (ex: noticias.html?cat=politica)
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  if (catParam) {
    activeCategory = catParam;
  }

  initCategoryButtons();
  initSearch();
  initSorting();
  applyFiltersAndRender();
});

function initCategoryButtons() {
  const buttons = document.querySelectorAll('.cat-filter-btn');
  buttons.forEach(btn => {
    const cat = btn.getAttribute('data-cat');
    if (cat === activeCategory) {
      setButtonActive(btn, true);
    } else {
      setButtonActive(btn, false);
    }

    btn.addEventListener('click', () => {
      activeCategory = cat;
      buttons.forEach(b => setButtonActive(b, b.getAttribute('data-cat') === cat));
      applyFiltersAndRender();
    });
  });
}

function setButtonActive(btn, active) {
  if (active) {
    btn.className = 'cat-filter-btn px-4 py-2 rounded-full bg-editorial-red text-white text-xs sm:text-sm font-bold whitespace-nowrap shadow-sm transition';
  } else {
    btn.className = 'cat-filter-btn px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs sm:text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 whitespace-nowrap transition';
  }
}

function initSearch() {
  const input = document.getElementById('newsSearchInput');
  const clearBtn = document.getElementById('clearNewsSearch');

  if (input) {
    input.addEventListener('input', (e) => {
      searchQuery = e.target.value.toLowerCase().trim();
      if (clearBtn) {
        clearBtn.classList.toggle('hidden', searchQuery.length === 0);
      }
      applyFiltersAndRender();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) input.value = '';
      searchQuery = '';
      clearBtn.classList.add('hidden');
      applyFiltersAndRender();
    });
  }
}

function initSorting() {
  const select = document.getElementById('sortSelect');
  if (select) {
    select.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFiltersAndRender();
    });
  }
}

function applyFiltersAndRender() {
  let list = getAllNews();

  // Filtrar por Categoria
  if (activeCategory !== 'all') {
    list = list.filter(item => item.category === activeCategory);
  }

  // Filtrar por Busca
  if (searchQuery) {
    list = list.filter(item => {
      return item.title.toLowerCase().includes(searchQuery) ||
             item.subtitle.toLowerCase().includes(searchQuery) ||
             item.author.toLowerCase().includes(searchQuery);
    });
  }

  // Ordenação
  if (currentSort === 'views') {
    list.sort((a, b) => (b.views || 0) - (a.views || 0));
  } else {
    list.sort((a, b) => b.id - a.id);
  }

  renderNewsCards(list);
}

function renderNewsCards(items) {
  const container = document.getElementById('newsArchiveGrid');
  const countEl = document.getElementById('archiveCount');
  const emptyState = document.getElementById('archiveEmptyState');

  if (!container) return;

  if (countEl) {
    countEl.textContent = `${items.length} matéria${items.length !== 1 ? 's' : ''} encontrada${items.length !== 1 ? 's' : ''}`;
  }

  if (items.length === 0) {
    container.innerHTML = '';
    if (emptyState) emptyState.classList.remove('hidden');
    return;
  }

  if (emptyState) emptyState.classList.add('hidden');

  container.innerHTML = items.map(news => `
    <article class="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between">
      <div>
        <a href="materia.html?id=${news.id}" class="block relative aspect-[16/10] overflow-hidden">
          <img src="${news.image}" alt="${news.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy">
          <span class="absolute top-3 left-3 px-2.5 py-1 text-[11px] font-black rounded uppercase tracking-wider text-white ${getCategoryColor(news.category)} shadow">
            ${news.categoryLabel}
          </span>
          <span class="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm text-white text-[10px] font-bold rounded">
            ⏱️ ${news.readTime}
          </span>
        </a>

        <div class="p-5">
          <span class="text-xs text-gray-400 block mb-1">${news.date}</span>
          <h3 class="font-bold text-lg leading-snug text-gray-900 dark:text-white group-hover:text-editorial-red transition-colors line-clamp-2 mb-2">
            <a href="materia.html?id=${news.id}">
              ${news.title}
            </a>
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
            ${news.subtitle}
          </p>
        </div>
      </div>

      <div class="px-5 pb-5 pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span class="truncate max-w-[160px] font-medium">${news.author}</span>
        <a href="materia.html?id=${news.id}" class="font-bold text-editorial-red hover:underline flex items-center gap-1 group-hover:translate-x-1 transition-transform">
          Ler matéria →
        </a>
      </div>
    </article>
  `).join('');
}

