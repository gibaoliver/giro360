/**
 * DIÁRIO NACIONAL - SCRIPT PRINCIPAL & UTILITÁRIOS
 * Compartilhado por todas as páginas do portal (Header, Acessibilidade, Top Bar, Rodapé).
 */

document.addEventListener('DOMContentLoaded', () => {
  initLiveClock();
  initCurrencies();
  initTheme();
  initAccessibilityFont();
  initMobileMenu();
  initNewsletter();
});

/* ----------------------------------------------------
 * 1. RELÓGIO & DATA EM TEMPO REAL (PADRÃO BRASILEIRO)
 * ---------------------------------------------------- */
function initLiveClock() {
  const el = document.getElementById('liveDateTime');
  if (!el) return;

  function update() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('pt-BR', options);
    const timeStr = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    el.textContent = `${dateStr.charAt(0).toUpperCase() + dateStr.slice(1)} • ${timeStr}`;
  }
  update();
  setInterval(update, 1000);
}

/* ----------------------------------------------------
 * 2. COTAÇÕES DE MOEDAS EM TEMPO REAL (AWESOMEAPI)
 * ---------------------------------------------------- */
async function initCurrencies() {
  const rateUSD = document.getElementById('rateUSD');
  const varUSD = document.getElementById('varUSD');
  const rateEUR = document.getElementById('rateEUR');
  const varEUR = document.getElementById('varEUR');
  const rateBTC = document.getElementById('rateBTC');

  if (!rateUSD) return;

  try {
    const res = await fetch('https://economia.awesomeapi.com.br/last/USD-BRL,EUR-BRL,BTC-BRL');
    if (res.ok) {
      const data = await res.json();
      if (data.USDBRL) {
        rateUSD.textContent = `R$ ${parseFloat(data.USDBRL.bid).toFixed(2)}`;
        const varU = parseFloat(data.USDBRL.pctChange);
        varUSD.textContent = `${varU >= 0 ? '▲ +' : '▼ '}${varU.toFixed(2)}%`;
        varUSD.className = varU >= 0 ? 'text-emerald-400 text-[10px]' : 'text-rose-400 text-[10px]';
      }
      if (data.EURBRL) {
        rateEUR.textContent = `R$ ${parseFloat(data.EURBRL.bid).toFixed(2)}`;
        const varE = parseFloat(data.EURBRL.pctChange);
        varEUR.textContent = `${varE >= 0 ? '▲ +' : '▼ '}${varE.toFixed(2)}%`;
        varEUR.className = varE >= 0 ? 'text-emerald-400 text-[10px]' : 'text-rose-400 text-[10px]';
      }
      if (data.BTCBRL) {
        const btcVal = parseFloat(data.BTCBRL.bid);
        rateBTC.textContent = `R$ ${btcVal.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}`;
      }
    }
  } catch (err) {
    // Mantém valores de fallback pré-carregados no HTML
    console.warn('Usando cotações locais offline');
  }
}

/* ----------------------------------------------------
 * 3. MODO ESCURO (DARK MODE COM PERSISTÊNCIA)
 * ---------------------------------------------------- */
function initTheme() {
  const toggleBtn = document.getElementById('darkModeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const themeText = document.getElementById('themeText');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('dn_theme') || 
    (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');

  if (savedTheme === 'dark') {
    root.classList.add('dark');
    updateThemeUI(true);
  } else {
    root.classList.remove('dark');
    updateThemeUI(false);
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const isDark = root.classList.toggle('dark');
      localStorage.setItem('dn_theme', isDark ? 'dark' : 'light');
      updateThemeUI(isDark);
    });
  }

  function updateThemeUI(isDark) {
    if (!themeText || !themeIcon) return;
    themeText.textContent = isDark ? 'Claro' : 'Escuro';
    themeIcon.innerHTML = isDark
      ? `<svg class="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path></svg>`
      : `<svg class="w-4 h-4 text-gray-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path></svg>`;
  }
}

/* ----------------------------------------------------
 * 4. ACESSIBILIDADE: CONTROLE DO TAMANHO DA FONTE
 * ---------------------------------------------------- */
function initAccessibilityFont() {
  const btnInc = document.getElementById('btnIncreaseFont');
  const btnDec = document.getElementById('btnDecreaseFont');
  const btnReset = document.getElementById('btnResetFont');
  const root = document.documentElement;

  let scale = parseFloat(localStorage.getItem('dn_font_scale')) || 1.0;
  applyScale(scale);

  if (btnInc) {
    btnInc.addEventListener('click', () => {
      if (scale < 1.35) {
        scale += 0.08;
        applyScale(scale);
      }
    });
  }

  if (btnDec) {
    btnDec.addEventListener('click', () => {
      if (scale > 0.85) {
        scale -= 0.08;
        applyScale(scale);
      }
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', () => {
      scale = 1.0;
      applyScale(scale);
    });
  }

  function applyScale(val) {
    root.style.setProperty('--text-scale', `${val}rem`);
    localStorage.setItem('dn_font_scale', val.toString());
  }
}

/* ----------------------------------------------------
 * 5. MENU MOBILE INTERATIVO
 * ---------------------------------------------------- */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const menu = document.getElementById('mobileMenuDrawer');

  if (btn && menu) {
    btn.addEventListener('click', () => {
      menu.classList.toggle('hidden');
    });
  }
}

/* ----------------------------------------------------
 * 6. NEWSLETTER MATINAL
 * ---------------------------------------------------- */
function initNewsletter() {
  const form = document.getElementById('newsletterForm');
  const success = document.getElementById('newsletterSuccess');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input && input.value) {
        input.value = '';
        if (success) {
          success.classList.remove('hidden');
          setTimeout(() => success.classList.add('hidden'), 5000);
        }
      }
    });
  }
}

