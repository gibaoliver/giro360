/**
 * GIRO 360 - CLIENTE CENTRALIZADO SUPABASE
 * Configuração oficial da conexão com o banco de dados Supabase.
 */

const SUPABASE_CONFIG = {
  url: 'https://wxlzwccoitbzpisitdqe.supabase.co',
  anonKey: 'sb_publishable_1zm8d88ZJ7DvLKFNZ_jG_g_J5Q8sCKO'
};

// Salvar no localStorage para garantir persistência em todos os contextos
if (typeof localStorage !== 'undefined') {
  if (!localStorage.getItem('dn_supabase_url')) {
    localStorage.setItem('dn_supabase_url', SUPABASE_CONFIG.url);
  }
  if (!localStorage.getItem('dn_supabase_key')) {
    localStorage.setItem('dn_supabase_key', SUPABASE_CONFIG.anonKey);
  }
}

// Instanciar o cliente Supabase caso a biblioteca JS esteja carregada
let supabase = null;
if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
  try {
    supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);
  } catch (err) {
    console.warn('Não foi possível inicializar o cliente Supabase:', err);
  }
}

