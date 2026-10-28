/**
 * GIRO 360 - REPOSITÓRIO CENTRAL DE DADOS & SINCRONIZAÇÃO SUPABASE
 * Conecta com o Supabase oficial e mantém sincronização com o LocalStorage.
 */

const STORAGE_KEYS = {
  NEWS: 'dn_news_database',
  POLL: 'dn_poll_data',
  THEME: 'dn_theme_preference',
  FONT_SCALE: 'dn_font_scale',
  SUPABASE_URL: 'dn_supabase_url',
  SUPABASE_KEY: 'dn_supabase_key'
};

// Configurações padrão do Supabase oficial
const DEFAULT_SUPABASE = {
  url: 'https://wxlzwccoitbzpisitdqe.supabase.co',
  key: 'sb_publishable_1zm8d88ZJ7DvLKFNZ_jG_g_J5Q8sCKO'
};

// Base inicial de matérias de contingência (fallback offline)
const initialNews = [
  {
    id: 1,
    title: "PIB brasileiro supera projeções internacionais e consolida ciclo de investimentos industriais",
    subtitle: "Com forte tração nos setores de serviços, agronegócio de valor agregado e tecnologia verde, país alcança ritmo sustentável de expansão econômica.",
    category: "economia",
    categoryLabel: "Economia",
    author: "Carlos Eduardo Menezes",
    authorRole: "Correspondente de Economia • Brasília",
    date: "28 de Outubro de 2026",
    readTime: "5 min",
    views: 184500,
    isLead: true,
    image: "https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80",
    caption: "Fachada dos ministérios em Brasília: novo boletim macroeconômico surpreende instituições financeiras internacionais.",
    content: `
      <p>O Produto Interno Bruto (PIB) do Brasil registrou expansão contínua no último trimestre, surpreendendo os principais organismos multilaterais e bancos de investimento. A combinação entre consumo interno resiliente, queda estrutural nas taxas de juros e a atração de capital internacional para projetos de transição energética consolidou o novo ciclo de desenvolvimento.</p>
      <blockquote>“Estamos colhendo os frutos de um equilíbrio fiscal somado a políticas assertivas de crédito e inovação produtiva. O país não apenas cresce em números brutos, mas gera empregos qualificados em todas as cinco regiões”, destacou a equipe econômica em comunicado oficial.</blockquote>
      <p>De acordo com o Ministério da Fazenda, a modernização dos incentivos para a indústria nacional e a desburocratização trazida pela nova etapa da reforma tributária proporcionaram um ambiente de previsibilidade sem precedentes para os próximos anos fiscais.</p>
    `,
    comments: [
      { id: 101, author: "Marcos Vinicius", time: "Há 40 minutos", text: "Excelente ver a indústria nacional voltando a ter relevância e gerando empregos de qualidade." },
      { id: 102, author: "Dra. Patrícia Fontes", time: "Há 1 hora", text: "A estabilidade fiscal e o foco em sustentabilidade são os verdadeiros pilares desse resultado animador." }
    ]
  },
  {
    id: 2,
    title: "Reforma administrativa entra em pauta prioritária no Senado com foco em eficiência digital",
    subtitle: "Proposta visa modernizar o serviço público, valorizar carreiras essenciais e acelerar a digitalização total do atendimento ao cidadão.",
    category: "politica",
    categoryLabel: "Política",
    author: "Renata Vasconcellos Silva",
    authorRole: "Analista Política • Brasília",
    date: "28 de Outubro de 2026",
    readTime: "4 min",
    views: 79200,
    isLead: false,
    image: "https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80",
    caption: "Plenário do Senado Federal durante sessão de debates sobre o marco regulatório do funcionalismo público.",
    content: `
      <p>Líderes partidários no Senado chegaram a um consenso para colocar em votação o relatório final da reforma administrativa. A matéria propõe critérios transparentes de avaliação de desempenho, premiação por produtividade e corte rigoroso de despesas operacionais redundantes.</p>
      <p>O relator enfatizou que os direitos adquiridos dos atuais servidores serão integralmente preservados, criando regras de transição equilibradas para os novos ingressantes através de concursos públicos altamente técnicos.</p>
    `,
    comments: [
      { id: 103, author: "Sérgio Lemos", time: "Há 2 horas", text: "A digitalização de processos desburocratiza a vida de quem mais precisa de atendimento no SUS e no INSS." }
    ]
  },
  {
    id: 3,
    title: "Cientistas anunciam processador quântico de alta eficiência térmica desenvolvido no Brasil",
    subtitle: "Pesquisadores de centros integrados desenvolvem arquitetura de computação inovadora que dispensa sistemas complexos de superresfriamento.",
    category: "tecnologia",
    categoryLabel: "Tecnologia",
    author: "Felipe Albuquerque",
    authorRole: "Editor de Ciência & Inovação",
    date: "28 de Outubro de 2026",
    readTime: "3 min",
    views: 148900,
    isLead: false,
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    caption: "Chip com arquitetura inovadora montado em laboratório de nanotecnologia de ponta.",
    content: `
      <p>Uma equipe multidisciplinar de físicos e engenheiros brasileiros anunciou hoje o protótipo funcional de um processador quântico capaz de operar em temperaturas muito próximas do ambiente de laboratório tradicional.</p>
    `,
    comments: [
      { id: 104, author: "Thiago Rocha", time: "Há 3 horas", text: "Orgulho imenso da ciência brasileira. Isso demonstra o potencial que temos quando há investimento contínuo!" }
    ]
  },
  {
    id: 4,
    title: "Estádios registram maior média de público dos últimos dez anos no futebol nacional",
    subtitle: "Arenas modernas, horários amigáveis para famílias e maior equilíbrio técnico nas quatro divisões impulsionam a presença de torcedores.",
    category: "esportes",
    categoryLabel: "Esportes",
    author: "Lucas Barreto",
    authorRole: "Repórter Esportivo",
    date: "28 de Outubro de 2026",
    readTime: "2 min",
    views: 65100,
    isLead: false,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80",
    caption: "Festa nas arquibancadas com mosaicos e apoio incondicional das torcidas em noite de clássico nacional.",
    content: `
      <p>O levantamento divulgado pela CBF revelou que a média de ocupação das arenas superou a marca histórica de 38 mil pagantes por partida na Série A.</p>
    `,
    comments: []
  }
];

// Colunistas do Portal
const columnistsDatabase = [
  {
    name: "Mariana Rios",
    role: "Ética & Inteligência Artificial",
    bio: "Doutora pelo MIT, pesquisadora de impacto social de novas tecnologias e autora do best-seller 'O Algoritmo e a Alma'.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    latestArticleId: 6,
    latestTitle: "O futuro do trabalho humano diante dos novos agentes autônomos de IA"
  },
  {
    name: "Prof. Gilberto Assis",
    role: "Urbanismo & Mobilidade Sustentável",
    bio: "Arquiteto e urbanista, professor titular da Faculdade de Arquitetura da UFBA e consultor de planejamento metropolitano.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
    latestArticleId: 7,
    latestTitle: "Cidades inteligentes: como a mobilidade sustentável transforma a Bahia"
  },
  {
    name: "Helena Castelo",
    role: "Economia Doméstica & Investimentos",
    bio: "Especialista em finanças pessoais pela FGV, criadora do projeto 'Finanças Sem Segredo' e podcaster com mais de 2 milhões de ouvintes.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80",
    latestArticleId: 8,
    latestTitle: "Educação financeira familiar: o escudo contra as oscilações da inflação"
  }
];

// Inicialização do cliente Supabase global
function getSupabaseClient() {
  if (typeof window !== 'undefined' && window.supabaseClient) {
    return window.supabaseClient;
  }
  const url = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.SUPABASE_URL)) || DEFAULT_SUPABASE.url;
  const key = (typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEYS.SUPABASE_KEY)) || DEFAULT_SUPABASE.key;

  if (typeof window !== 'undefined' && window.supabase && window.supabase.createClient) {
    try {
      window.supabaseClient = window.supabase.createClient(url, key);
      return window.supabaseClient;
    } catch (e) {
      console.warn('Erro ao inicializar Supabase:', e);
    }
  }
  return null;
}

// SINCRONIZAÇÃO ASSÍNCRONA COM O SUPABASE
async function syncNewsFromSupabase() {
  const sb = getSupabaseClient();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from('noticias')
      .select('*')
      .order('id', { ascending: false });

    if (!error && data && data.length > 0) {
      // Normalizar campos para compatibilidade com a interface
      const normalized = data.map(item => ({
        ...item,
        title: item.titulo || item.title,
        subtitle: item.descricao_seo || item.subtitle,
        category: (item.categoria || item.category || 'geral').toLowerCase(),
        categoryLabel: item.categoria || item.categoryLabel || 'Geral',
        author: item.autor || item.author || 'Redação',
        date: item.data_publicacao || item.date || 'Hoje',
        readTime: item.tempo_leitura || item.readTime || '3 min',
        image: item.imagem_url || item.image,
        caption: item.legenda_imagem || item.caption,
        content: item.conteudo || item.content,
        views: item.visualizacoes || item.views || 0,
        comments: item.comments || []
      }));

      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(normalized));
      return normalized;
    }
  } catch (err) {
    console.warn('Supabase offline ou tabela noticias ainda não criada. Usando dados locais.', err);
  }
  return null;
}

// OBTENÇÃO DE NOTÍCIAS (Síncrono para render imediato do LocalStorage + Sync em background)
function getAllNews() {
  const saved = localStorage.getItem(STORAGE_KEYS.NEWS);
  if (!saved) {
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(initialNews));
    return initialNews;
  }
  try {
    return JSON.parse(saved);
  } catch (e) {
    return initialNews;
  }
}

function getNewsById(id) {
  const all = getAllNews();
  return all.find(item => item.id == id);
}

function formatToISODate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  dateStr = dateStr.toString().trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr;
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateStr)) {
    const parts = dateStr.split('/');
    const day = parts[0].padStart(2, '0');
    const month = parts[1].padStart(2, '0');
    const year = parts[2];
    return `${year}-${month}-${day}`;
  }
  const d = new Date(dateStr);
  if (!isNaN(d.getTime())) return d.toISOString().split('T')[0];
  return new Date().toISOString().split('T')[0];
}

function formatToBRDate(dateStr) {
  if (!dateStr) return '';
  if (/^\d{4}-\d{2}-\d{2}/.test(dateStr)) {
    const [y, m, d] = dateStr.split('T')[0].split('-');
    return `${d}/${m}/${y}`;
  }
  return dateStr;
}

// SALVAR NOTÍCIA (Supabase + LocalStorage)
async function saveNewsArticle(articleData) {
  const all = getAllNews();
  const sb = getSupabaseClient();
  const isoDate = formatToISODate(articleData.data_publicacao || articleData.date);

  // 1. Tentar salvar no Supabase
  if (sb) {
    try {
      const payload = {
        titulo: articleData.titulo || articleData.title,
        titulo_seo: articleData.titulo_seo || articleData.titulo || articleData.title,
        descricao_seo: articleData.descricao_seo || articleData.subtitle || '',
        palavras_chave: articleData.palavras_chave || '',
        categoria: articleData.categoria || articleData.categoryLabel || 'Geral',
        categoria_slug: (articleData.categoria || articleData.category || 'geral').toLowerCase(),
        autor: articleData.autor || articleData.author || 'Redação Giro 360',
        tempo_leitura: articleData.tempo_leitura || articleData.readTime || '3 min',
        imagem_url: articleData.imagem_url || articleData.image,
        legenda_imagem: articleData.legenda_imagem || articleData.caption || '',
        conteudo: articleData.conteudo || articleData.content,
        data_publicacao: isoDate
      };

      if (articleData.id) {
        await sb.from('noticias').update(payload).eq('id', articleData.id);
      } else {
        const { data } = await sb.from('noticias').insert([payload]).select();
        if (data && data[0]) {
          articleData.id = data[0].id;
        }
      }
    } catch (err) {
      console.warn('Não foi possível salvar no Supabase neste momento. Salvo localmente.', err);
    }
  }

  // 2. Salvar no LocalStorage para render imediato
  if (articleData.id) {
    const idx = all.findIndex(a => a.id == articleData.id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...articleData };
    } else {
      all.unshift(articleData);
    }
  } else {
    const newId = all.length > 0 ? Math.max(...all.map(a => Number(a.id) || 0)) + 1 : 1;
    articleData.id = newId;
    articleData.views = 0;
    articleData.comments = [];
    all.unshift(articleData);
  }

  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(all));
  return all;
}

// EXCLUIR NOTÍCIA (Supabase + LocalStorage)
async function deleteNewsArticle(id) {
  const sb = getSupabaseClient();
  if (sb) {
    try {
      await sb.from('noticias').delete().eq('id', id);
    } catch (e) {
      console.warn('Erro ao deletar do Supabase:', e);
    }
  }

  let all = getAllNews();
  all = all.filter(a => a.id != id);
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(all));
  return all;
}

// ADICIONAR COMENTÁRIO
async function addCommentToArticle(articleId, author, text) {
  const sb = getSupabaseClient();
  const newComment = {
    id: Date.now(),
    author: author,
    time: "Agora mesmo",
    text: text
  };

  if (sb) {
    try {
      await sb.from('comentarios').insert([{
        noticia_id: articleId,
        autor: author,
        texto: text
      }]);
    } catch (e) {
      console.warn('Erro ao salvar comentário no Supabase:', e);
    }
  }

  const all = getAllNews();
  const article = all.find(a => a.id == articleId);
  if (article) {
    if (!article.comments) article.comments = [];
    article.comments.unshift(newComment);
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(all));
  }
  return newComment;
}

function getCategoryColor(cat) {
  switch(cat ? cat.toLowerCase() : '') {
    case 'politica': return 'bg-blue-600';
    case 'economia': return 'bg-emerald-600';
    case 'tecnologia': return 'bg-indigo-600';
    case 'esportes': return 'bg-amber-600';
    case 'entretenimento': return 'bg-rose-600';
    default: return 'bg-editorial-red';
  }
}

// Auto-sync ao carregar
if (typeof window !== 'undefined') {
  syncNewsFromSupabase().catch(() => {});
}
