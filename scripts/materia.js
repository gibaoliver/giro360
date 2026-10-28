/**
 * DIÁRIO NACIONAL - SCRIPT DA PÁGINA DE MATÉRIA (materia.html)
 * Gerencia a renderização do artigo, leitor de áudio TTS, compartilhamento e comentários.
 */

let currentArticle = null;
let isSpeaking = false;
let synth = window.speechSynthesis;
let speechUtterance = null;

document.addEventListener('DOMContentLoaded', () => {
  loadArticleFromURL();
  initCommentsForm();
});

function loadArticleFromURL() {
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get('id') || 1;
  const article = getNewsById(articleId);

  if (!article) {
    document.getElementById('articleContainer').innerHTML = `
      <div class="text-center py-20">
        <h2 class="text-2xl font-bold mb-2">Matéria não encontrada</h2>
        <p class="text-gray-500 mb-6">A matéria que você tentou acessar não existe ou foi removida.</p>
        <a href="index.html" class="px-5 py-2.5 bg-editorial-red text-white font-bold rounded-lg hover:bg-editorial-darkred transition">Voltar para a Página Inicial</a>
      </div>
    `;
    return;
  }

  currentArticle = article;
  document.title = `${article.title} | DIÁRIO NACIONAL`;

  // Preenchimento de Conteúdo
  document.getElementById('breadcrumbCategory').textContent = article.categoryLabel;
  document.getElementById('breadcrumbCategory').href = `noticias.html?cat=${article.category}`;
  
  const catBadge = document.getElementById('articleCategoryBadge');
  catBadge.textContent = article.categoryLabel;
  catBadge.className = `px-3 py-1 text-white text-xs font-black uppercase rounded-full ${getCategoryColor(article.category)}`;

  document.getElementById('articleReadTime').textContent = `⏱️ ${article.readTime} de leitura`;
  document.getElementById('articleTitle').textContent = article.title;
  document.getElementById('articleSubtitle').textContent = article.subtitle;
  document.getElementById('articleAuthor').textContent = article.author;
  document.getElementById('articleAuthorRole').textContent = article.authorRole || 'Redação Diário Nacional';
  document.getElementById('articleDate').textContent = `Publicado em ${article.date}`;
  
  const img = document.getElementById('articleImage');
  img.src = article.image;
  img.alt = article.title;
  document.getElementById('articleCaption').textContent = article.caption;

  document.getElementById('articleBody').innerHTML = article.content;

  // Botão de Compartilhar no WhatsApp
  const shareUrl = window.location.href;
  const shareText = `*${article.title}*\n\nLeia a matéria completa no Diário Nacional: ${shareUrl}`;
  document.getElementById('btnShareWhatsApp').href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  // Botão Copiar Link
  const btnCopy = document.getElementById('btnCopyLink');
  if (btnCopy) {
    btnCopy.addEventListener('click', () => {
      navigator.clipboard.writeText(shareUrl).then(() => {
        const originalText = btnCopy.innerHTML;
        btnCopy.innerHTML = '✓ Link Copiado!';
        setTimeout(() => btnCopy.innerHTML = originalText, 2500);
      });
    });
  }

  // Renderizar Comentários
  renderComments(article.comments || []);

  // Notícias Relacionadas
  renderRelatedNews(article);
}

/* ----------------------------------------------------
 * LEITOR DE ÁUDIO NATIVO (WEB SPEECH API)
 * ---------------------------------------------------- */
function toggleSpeech() {
  if (!currentArticle) return;

  if (!('speechSynthesis' in window)) {
    alert('Seu navegador não tem suporte à leitura de áudio nativa.');
    return;
  }

  if (isSpeaking) {
    if (synth.paused) {
      synth.resume();
      updateSpeechUI(true, 'Reproduzindo narração...');
    } else {
      synth.pause();
      updateSpeechUI(false, 'Narração pausada');
    }
  } else {
    const rawContent = currentArticle.content.replace(/<[^>]*>/g, '');
    const fullText = `${currentArticle.title}. ${currentArticle.subtitle}. Notícia completa: ${rawContent}`;

    synth.cancel();
    speechUtterance = new SpeechSynthesisUtterance(fullText);
    speechUtterance.lang = 'pt-BR';
    speechUtterance.rate = 1.0;

    const voices = synth.getVoices();
    const ptVoice = voices.find(v => v.lang.includes('pt-BR') || v.lang.includes('pt'));
    if (ptVoice) speechUtterance.voice = ptVoice;

    speechUtterance.onstart = () => {
      isSpeaking = true;
      updateSpeechUI(true, 'Narrando matéria em voz alta...');
    };

    speechUtterance.onend = () => {
      stopSpeech();
    };

    speechUtterance.onerror = () => {
      stopSpeech();
    };

    synth.speak(speechUtterance);
  }
}

function stopSpeech() {
  if ('speechSynthesis' in window) {
    synth.cancel();
  }
  isSpeaking = false;
  updateSpeechUI(false, 'Narração automática em português brasileiro');
}

function updateSpeechUI(speaking, statusText) {
  const statusEl = document.getElementById('ttsStatus');
  const btnText = document.getElementById('ttsBtnText');
  const icon = document.getElementById('ttsIcon');

  if (statusEl) statusEl.textContent = statusText;
  if (btnText && icon) {
    if (speaking) {
      btnText.textContent = 'Pausar Áudio';
      icon.textContent = '⏸';
    } else {
      btnText.textContent = 'Ouvir Notícia';
      icon.textContent = '▶';
    }
  }
}

/* ----------------------------------------------------
 * SISTEMA DE COMENTÁRIOS INTERATIVOS
 * ---------------------------------------------------- */
function renderComments(comments) {
  const list = document.getElementById('commentsList');
  const countBadge = document.getElementById('commentsCountBadge');

  if (countBadge) countBadge.textContent = comments.length;

  if (!comments || comments.length === 0) {
    list.innerHTML = `
      <div class="text-center py-6 text-sm text-gray-500 bg-gray-50 dark:bg-gray-800/40 rounded-xl">
        Seja o primeiro a expressar sua opinião sobre esta matéria.
      </div>
    `;
    return;
  }

  list.innerHTML = comments.map(c => `
    <div class="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800">
      <div class="flex items-center justify-between mb-1.5">
        <span class="font-bold text-sm text-gray-900 dark:text-gray-100">${escapeHtml(c.author)}</span>
        <span class="text-xs text-gray-400">${c.time}</span>
      </div>
      <p class="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        ${escapeHtml(c.text)}
      </p>
    </div>
  `).join('');
}

function initCommentsForm() {
  const form = document.getElementById('commentForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!currentArticle) return;

    const authorInput = document.getElementById('commentAuthor');
    const textInput = document.getElementById('commentText');

    const author = authorInput.value.trim();
    const text = textInput.value.trim();

    if (!author || !text) return;

    addCommentToArticle(currentArticle.id, author, text);
    
    // Recarregar os comentários atualizados
    const updated = getNewsById(currentArticle.id);
    renderComments(updated.comments || []);

    authorInput.value = '';
    textInput.value = '';
    const emailInput = document.getElementById('commentEmail');
    if (emailInput) emailInput.value = '';

    const alertMsg = document.getElementById('commentSuccessAlert');
    if (alertMsg) {
      alertMsg.classList.remove('hidden');
      setTimeout(() => alertMsg.classList.add('hidden'), 4000);
    }
  });
}

/* ----------------------------------------------------
 * NOTÍCIAS RELACIONADAS
 * ---------------------------------------------------- */
function renderRelatedNews(article) {
  const container = document.getElementById('relatedNewsGrid');
  if (!container) return;

  const all = getAllNews();
  const related = all.filter(a => a.id !== article.id && a.category === article.category).slice(0, 3);
  
  // Se não houver suficientes da mesma categoria, pega outras notícias
  const finalRelated = related.length >= 2 ? related : all.filter(a => a.id !== article.id).slice(0, 3);

  container.innerHTML = finalRelated.map(item => `
    <a href="materia.html?id=${item.id}" class="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div class="aspect-video overflow-hidden">
          <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300">
        </div>
        <div class="p-4">
          <span class="text-[10px] font-bold text-editorial-red uppercase tracking-wider">${item.categoryLabel}</span>
          <h4 class="font-bold text-sm text-gray-900 dark:text-white group-hover:text-editorial-red transition-colors mt-1 line-clamp-2">
            ${item.title}
          </h4>
        </div>
      </div>
      <div class="px-4 pb-4 text-[11px] text-gray-400 flex justify-between">
        <span>⏱️ ${item.readTime}</span>
        <span>${item.date}</span>
      </div>
    </a>
  `).join('');
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

