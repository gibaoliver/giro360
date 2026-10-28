/**
 * DIÁRIO NACIONAL - SCRIPT DO PAINEL ADMINISTRATIVO (admin.html)
 * CMS para publicação de novas notícias, estatísticas de audiência e moderação.
 */

document.addEventListener('DOMContentLoaded', () => {
  renderAdminStats();
  renderAdminArticlesTable();
  initArticleForm();
  initResetDataBtn();
});

function renderAdminStats() {
  const news = getAllNews();
  const totalViews = news.reduce((acc, curr) => acc + (curr.views || 0), 0);
  const totalComments = news.reduce((acc, curr) => acc + (curr.comments ? curr.comments.length : 0), 0);

  document.getElementById('statTotalNews').textContent = news.length;
  document.getElementById('statTotalViews').textContent = totalViews > 1000 ? `${(totalViews / 1000).toFixed(1)}k` : totalViews;
  document.getElementById('statTotalComments').textContent = totalComments;
}

function renderAdminArticlesTable() {
  const tableBody = document.getElementById('adminArticlesBody');
  if (!tableBody) return;

  const news = getAllNews();

  tableBody.innerHTML = news.map(item => `
    <tr class="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
      <td class="py-3 px-4 font-mono text-xs text-gray-400">#${item.id}</td>
      <td class="py-3 px-4">
        <div class="font-bold text-sm text-gray-900 dark:text-gray-100 line-clamp-1">${escapeHtml(item.title)}</div>
        <div class="text-xs text-gray-400">${item.date} • ${item.author}</div>
      </td>
      <td class="py-3 px-4">
        <span class="px-2 py-0.5 text-[10px] font-bold rounded uppercase ${getCategoryColor(item.category)} text-white">
          ${item.categoryLabel}
        </span>
      </td>
      <td class="py-3 px-4 text-xs font-mono text-gray-600 dark:text-gray-300">
        ${(item.views || 0).toLocaleString('pt-BR')}
      </td>
      <td class="py-3 px-4 text-xs text-gray-500">
        💬 ${item.comments ? item.comments.length : 0}
      </td>
      <td class="py-3 px-4 text-right space-x-2">
        <a href="materia.html?id=${item.id}" target="_blank" class="px-2.5 py-1 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-700 dark:text-gray-200 text-xs rounded transition inline-block">
          Ver
        </a>
        <button onclick="handleDeleteArticle(${item.id})" class="px-2.5 py-1 bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 hover:bg-rose-100 text-xs rounded transition">
          Excluir
        </button>
      </td>
    </tr>
  `).join('');
}

function initArticleForm() {
  const form = document.getElementById('newArticleForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('formTitle').value.trim();
    const subtitle = document.getElementById('formSubtitle').value.trim();
    const category = document.getElementById('formCategory').value;
    const author = document.getElementById('formAuthor').value.trim();
    const readTime = document.getElementById('formReadTime').value.trim();
    const image = document.getElementById('formImage').value.trim() || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';
    const caption = document.getElementById('formCaption').value.trim();
    const contentText = document.getElementById('formContent').value.trim();

    const categoryLabels = {
      economia: 'Economia',
      politica: 'Política',
      tecnologia: 'Tecnologia',
      esportes: 'Esportes',
      entretenimento: 'Entretenimento'
    };

    // Formatar parágrafos no HTML
    const formattedContent = contentText.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

    const newArticle = {
      title,
      subtitle,
      category,
      categoryLabel: categoryLabels[category] || 'Geral',
      author,
      authorRole: 'Redação Diário Nacional',
      date: dateFormatted,
      readTime,
      image,
      caption,
      content: formattedContent
    };

    saveNewsArticle(newArticle);

    // Feedback e Reset
    form.reset();
    renderAdminStats();
    renderAdminArticlesTable();

    const alertBox = document.getElementById('articleSuccessAlert');
    if (alertBox) {
      alertBox.classList.remove('hidden');
      setTimeout(() => alertBox.classList.add('hidden'), 5000);
    }
  });
}

function handleDeleteArticle(id) {
  if (confirm(`Deseja realmente remover a matéria #${id}? Esta ação não pode ser desfeita.`)) {
    deleteNewsArticle(id);
    renderAdminStats();
    renderAdminArticlesTable();
  }
}

function initResetDataBtn() {
  const btn = document.getElementById('btnResetDemoData');
  if (btn) {
    btn.addEventListener('click', () => {
      if (confirm('Isso restaurará o banco de dados inicial do portal. Deseja continuar?')) {
        localStorage.removeItem(STORAGE_KEYS.NEWS);
        getAllNews();
        renderAdminStats();
        renderAdminArticlesTable();
        alert('Banco de dados restaurado com sucesso!');
      }
    });
  }
}

function escapeHtml(text) {
  return text.replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}

