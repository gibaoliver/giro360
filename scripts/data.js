/**
 * DIÁRIO NACIONAL - REPOSITÓRIO CENTRAL DE DADOS & STORAGE
 * Gerencia notícias, colunistas, enquetes e comentários com sincronização via LocalStorage.
 */

const STORAGE_KEYS = {
  NEWS: 'dn_news_database',
  POLL: 'dn_poll_data',
  THEME: 'dn_theme_preference',
  FONT_SCALE: 'dn_font_scale'
};

// Base inicial de matérias jornalísticas completas
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
      <p>O agronegócio tecnológico e a indústria automobilística elétrica responderam por mais de 40% das novas contratações no período, apontando para uma diversificação saudável da matriz de exportações brasileira.</p>
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
      <p>A votação deve ocorrer em dois turnos ao longo das próximas semanas, prometendo destravar economias orçamentárias expressivas nos âmbitos federal, estadual e municipal.</p>
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
      <p>Uma equipe multidisciplinar de físicos e engenheiros brasileiros anunciou hoje o protótipo funcional de um processador quântico capaz de operar em temperaturas muito próximas do ambiente de laboratório tradicional, eliminando a dependência de hélio líquido superresfriado.</p>
      <p>O avanço abre portas para que data centers e hospitais utilizem simulações quânticas complexas na descoberta de novos fármacos e na criptografia pós-quântica inviolável.</p>
      <p>A patente já foi depositada e grandes fundos de capital de risco já manifestaram intenção de investir na produção em escala dos novos componentes.</p>
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
      <p>O levantamento divulgado pela Confederação Brasileira de Futebol revelou que a média de ocupação das arenas superou a marca histórica de 38 mil pagantes por partida na Série A, com destaque para a participação crescente de mulheres e crianças nos estádios.</p>
      <p>O investimento em segurança integrada com reconhecimento facial e sistemas de transporte público dedicados após os jogos foram apontados como fatores determinantes para o sucesso das arquibancadas.</p>
      <p>A disputa pelo título segue acirrada entre quatro clubes separados por apenas três pontos na tabela de classificação.</p>
    `,
    comments: []
  },
  {
    id: 5,
    title: "Festival de Cinema de Salvador premia produções autorais da América Latina no Centro Histórico",
    subtitle: "Mais de 80 longas e curtas-metragens foram exibidos gratuitamente em praças públicas e teatros restaurados do Pelourinho e Santo Antônio.",
    category: "entretenimento",
    categoryLabel: "Entretenimento",
    author: "Camila Guimarães",
    authorRole: "Crítica Cultural • Salvador",
    date: "28 de Outubro de 2026",
    readTime: "3 min",
    views: 99400,
    isLead: false,
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80",
    caption: "Projeção a céu aberto encanta moradores e turistas no coração cultural da capital baiana.",
    content: `
      <p>O 12º Festival Internacional de Cinema de Salvador encerrou sua edição mais concorrida celebrando a diversidade narrativa da América Latina. O troféu de melhor filme do júri oficial foi concedido ao drama documental 'Vozes da Maré', dirigido por uma cineasta baiana de 29 anos.</p>
      <p>O evento movimentou a rede hoteleira, restaurantes e o comércio de artesanato, atraindo críticos renomados e celebridades internacionais para as ladeiras históricas da cidade.</p>
      <p>Para a próxima edição, a organização confirmou ampliação do circuito para bairros da Cidade Baixa e do Subúrbio Ferroviário com oficinas de capacitação audiovisual gratuitas.</p>
    `,
    comments: [
      { id: 105, author: "Beatriz Andrade", time: "Há 4 horas", text: "Salvador respira arte e cultura. Essa iniciativa valoriza o Pelourinho de forma digna e popular!" }
    ]
  },
  {
    id: 6,
    title: "O futuro do trabalho humano diante dos novos agentes autônomos de Inteligência Artificial",
    subtitle: "Colunista analisa por que a criatividade emocional e o pensamento crítico serão as competências mais bem remuneradas da década.",
    category: "tecnologia",
    categoryLabel: "Opinião",
    author: "Mariana Rios",
    authorRole: "Pesquisadora Sênior de Ética e IA",
    date: "28 de Outubro de 2026",
    readTime: "4 min",
    views: 57200,
    isLead: false,
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
    caption: "Mariana Rios é pesquisadora sênior em ética computacional e escritora.",
    content: `
      <p>Ao contrário dos prenúncios alarmistas de substituição maciça, o que assistimos no mercado corporativo atual é uma simbiose entre inteligência analítica das máquinas e a sensibilidade contextual dos seres humanos.</p>
      <p>Sistemas automatizados executam rotinas repetitivas com velocidade cirúrgica, mas continuam incapazes de negociar nuances diplomáticas, inspirar equipes desmotivadas ou conceber visões artísticas genuinamente disruptivas.</p>
      <p>A verdadeira divisão do trabalho moderno não será entre homens e algoritmos, mas entre os profissionais que sabem comandar a tecnologia e aqueles que hesitam em compreendê-la.</p>
    `,
    comments: []
  },
  {
    id: 7,
    title: "Cidades inteligentes: como a mobilidade sustentável transforma o cotidiano da Bahia",
    subtitle: "VLT, ciclovias integradas e corredores de ônibus elétricos criam novo paradigma de qualidade de vida urbana.",
    category: "politica",
    categoryLabel: "Opinião",
    author: "Prof. Gilberto Assis",
    authorRole: "Professor de Urbanismo na UFBA",
    date: "28 de Outubro de 2026",
    readTime: "3 min",
    views: 43800,
    isLead: false,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
    caption: "Prof. Gilberto Assis leciona Urbanismo e Sustentabilidade na UFBA.",
    content: `
      <p>O avanço das obras do VLT em Salvador e a integração tarifária com metrô e ônibus representam a mais profunda reparação histórica para as famílias do Subúrbio Ferroviário.</p>
      <p>Reduzir o tempo de deslocamento diário de duas horas para 35 minutos significa devolver convívio familiar, descanso e oportunidades de estudo para os trabalhadores de periferia.</p>
      <p>Mobilidade não é luxo de engenharia; é o mais básico e poderoso instrumento de justiça social e preservação ambiental que uma metrópole contemporânea pode abraçar.</p>
    `,
    comments: []
  },
  {
    id: 8,
    title: "Educação financeira familiar: o escudo indispensável contra as oscilações da inflação",
    subtitle: "Estratégias práticas e acessíveis para famílias construírem reservas de emergência e protegerem o poder de compra.",
    category: "economia",
    categoryLabel: "Opinião",
    author: "Helena Castelo",
    authorRole: "Consultora Financeira e Apresentadora",
    date: "28 de Outubro de 2026",
    readTime: "3 min",
    views: 40500,
    isLead: false,
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    caption: "Helena Castelo é consultora financeira e apresentadora de podcast econômico.",
    content: `
      <p>Conversar sobre finanças à mesa de jantar ainda é um tabu para milhares de lares brasileiros. No entanto, em tempos de dinamismo econômico, a ignorância orçamentária custa caro.</p>
      <p>Pequenos hábitos diários, como o mapeamento sistemático de despesas invisíveis por meio de aplicativos simples e o hábito de poupar 5% da renda antes dos gastos, têm o poder de transformar vidas.</p>
      <p>O segredo da prosperidade duradoura nunca esteve nos ganhos milagrosos da especulação, mas sim na disciplina constante e no consumo consciente.</p>
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

// FUNÇÕES DE ACESSO E PERSISTÊNCIA

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
  return all.find(item => item.id === parseInt(id, 10));
}

function saveNewsArticle(articleData) {
  const all = getAllNews();
  if (articleData.id) {
    const idx = all.findIndex(a => a.id === articleData.id);
    if (idx !== -1) {
      all[idx] = { ...all[idx], ...articleData };
    }
  } else {
    const newId = all.length > 0 ? Math.max(...all.map(a => a.id)) + 1 : 1;
    const newArticle = {
      ...articleData,
      id: newId,
      views: 0,
      comments: []
    };
    all.unshift(newArticle);
  }
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(all));
  return all;
}

function deleteNewsArticle(id) {
  let all = getAllNews();
  all = all.filter(a => a.id !== parseInt(id, 10));
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(all));
  return all;
}

function addCommentToArticle(articleId, author, text) {
  const all = getAllNews();
  const article = all.find(a => a.id === parseInt(articleId, 10));
  if (!article) return null;

  if (!article.comments) article.comments = [];
  const newComment = {
    id: Date.now(),
    author: author,
    time: "Agora mesmo",
    text: text
  };
  article.comments.unshift(newComment);
  localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(all));
  return newComment;
}

function getCategoryColor(cat) {
  switch(cat) {
    case 'politica': return 'bg-blue-600';
    case 'economia': return 'bg-emerald-600';
    case 'tecnologia': return 'bg-indigo-600';
    case 'esportes': return 'bg-amber-600';
    case 'entretenimento': return 'bg-rose-600';
    default: return 'bg-editorial-red';
  }
}

