-- ==============================================================================
-- GIRO 360 / DIÁRIO NACIONAL - SCRIPT DE CRIAÇÃO DO BANCO DE DADOS (SUPABASE)
-- Execute este script no SQL Editor do seu projeto Supabase
-- ==============================================================================

-- 1. Habilitar extensão para geração de UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Categorias
CREATE TABLE IF NOT EXISTS public.categorias (
    id BIGSERIAL PRIMARY KEY,
    nome TEXT UNIQUE NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cor TEXT DEFAULT 'bg-editorial-red',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Inserir categorias padrão do portal
INSERT INTO public.categorias (nome, slug, cor) VALUES
('Política', 'politica', 'bg-blue-600'),
('Economia', 'economia', 'bg-emerald-600'),
('Tecnologia', 'tecnologia', 'bg-indigo-600'),
('Esportes', 'esportes', 'bg-amber-600'),
('Entretenimento', 'entretenimento', 'bg-rose-600'),
('Geral', 'geral', 'bg-editorial-red')
ON CONFLICT (slug) DO NOTHING;

-- 3. Tabela de Notícias / Postagens
CREATE TABLE IF NOT EXISTS public.noticias (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    data_publicacao DATE DEFAULT CURRENT_DATE,
    titulo TEXT NOT NULL,
    titulo_seo TEXT,
    descricao_seo TEXT,
    palavras_chave TEXT,
    categoria TEXT NOT NULL DEFAULT 'Geral',
    categoria_slug TEXT DEFAULT 'geral',
    autor TEXT NOT NULL DEFAULT 'Redação Giro 360',
    autor_cargo TEXT DEFAULT 'Repórter',
    tempo_leitura TEXT DEFAULT '3 min',
    imagem_url TEXT,
    legenda_imagem TEXT,
    conteudo TEXT NOT NULL,
    destaque BOOLEAN DEFAULT false,
    visualizacoes INTEGER DEFAULT 0,
    status TEXT DEFAULT 'publicado' CHECK (status IN ('publicado', 'rascunho', 'arquivado'))
);

-- Índices para otimização de busca e filtragem
CREATE INDEX IF NOT EXISTS idx_noticias_categoria ON public.noticias(categoria_slug);
CREATE INDEX IF NOT EXISTS idx_noticias_data ON public.noticias(data_publicacao DESC);
CREATE INDEX IF NOT EXISTS idx_noticias_views ON public.noticias(visualizacoes DESC);

-- 4. Tabela de Comentários dos Leitores
CREATE TABLE IF NOT EXISTS public.comentarios (
    id BIGSERIAL PRIMARY KEY,
    noticia_id BIGINT REFERENCES public.noticias(id) ON DELETE CASCADE,
    autor TEXT NOT NULL,
    email TEXT,
    texto TEXT NOT NULL,
    aprovado BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Inserir Notícias Iniciais de Demonstração
INSERT INTO public.noticias (
    titulo, 
    titulo_seo, 
    descricao_seo, 
    palavras_chave, 
    categoria, 
    categoria_slug, 
    autor, 
    autor_cargo, 
    tempo_leitura, 
    imagem_url, 
    legenda_imagem, 
    conteudo, 
    destaque, 
    visualizacoes
) VALUES 
(
    'PIB brasileiro supera projeções internacionais e consolida ciclo de investimentos industriais',
    'PIB brasileiro supera projeções em 2026',
    'Crescimento expressivo no setor de serviços e agronegócio impulsiona economia nacional.',
    'economia, pib, brasil, investimentos, fazenda',
    'Economia',
    'economia',
    'Carlos Eduardo Menezes',
    'Correspondente de Economia • Brasília',
    '5 min',
    'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    'Fachada dos ministérios em Brasília: novo boletim macroeconômico surpreende instituições financeiras.',
    '<p>O Produto Interno Bruto (PIB) do Brasil registrou expansão contínua no último trimestre, surpreendendo os principais organismos multilaterais e bancos de investimento. A combinação entre consumo interno resiliente e queda nas taxas de juros consolidou o novo ciclo.</p><p>De acordo com o Ministério da Fazenda, a modernização dos incentivos para a indústria nacional gerou previsibilidade sem precedentes para os próximos anos fiscais.</p>',
    true,
    184500
),
(
    'Reforma administrativa entra em pauta prioritária no Senado com foco em eficiência digital',
    'Reforma administrativa avança no Senado Federal',
    'Proposta visa modernizar o serviço público e acelerar a digitalização total do atendimento ao cidadão.',
    'politica, senado, reforma administrativa, brasilia',
    'Política',
    'politica',
    'Renata Vasconcellos Silva',
    'Analista Política • Brasília',
    '4 min',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1200&q=80',
    'Plenário do Senado Federal durante sessão de debates.',
    '<p>Líderes partidários no Senado chegaram a um consenso para colocar em votação o relatório final da reforma administrativa. A matéria propõe critérios transparentes de avaliação de desempenho e corte de despesas operacionais redundantes.</p>',
    false,
    79200
),
(
    'Cientistas anunciam processador quântico de alta eficiência térmica desenvolvido no Brasil',
    'Processador quântico nacional é anunciado',
    'Arquitetura pioneira dispensa sistemas complexos de superresfriamento com hélio líquido.',
    'tecnologia, computacao quantica, inovacao, ciencia brasil',
    'Tecnologia',
    'tecnologia',
    'Felipe Albuquerque',
    'Editor de Ciência & Inovação',
    '3 min',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
    'Chip com arquitetura inovadora montado em laboratório de nanotecnologia.',
    '<p>Uma equipe multidisciplinar de físicos e engenheiros brasileiros anunciou o protótipo funcional de um processador quântico capaz de operar em temperaturas muito próximas do ambiente tradicional.</p>',
    false,
    148900
),
(
    'Estádios registram maior média de público dos últimos dez anos no futebol nacional',
    'Recorde de público nos estádios brasileiros',
    'Arenas modernas e segurança integrada atraem multidões e famílias inteiras.',
    'esportes, futebol, brasileirao, estadios, torcida',
    'Esportes',
    'esportes',
    'Lucas Barreto',
    'Repórter Esportivo',
    '2 min',
    'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
    'Festa nas arquibancadas em noite de clássico nacional.',
    '<p>O levantamento da CBF revelou média superior a 38 mil torcedores pagantes por partida na Série A, com aumento expressivo da presença de famílias nos estádios.</p>',
    false,
    65100
);

-- Inserir Comentários Iniciais
INSERT INTO public.comentarios (noticia_id, autor, texto) VALUES
(1, 'Marcos Vinicius', 'Excelente ver a indústria nacional voltando a ter relevância e gerando empregos de qualidade.'),
(1, 'Dra. Patrícia Fontes', 'A estabilidade fiscal e o foco em sustentabilidade são os verdadeiros pilares desse resultado animador.'),
(2, 'Sérgio Lemos', 'A digitalização de processos desburocratiza a vida de quem mais precisa de atendimento.');

-- ==============================================================================
-- 6. POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- Permite leitura pública por qualquer visitante e manipulação pelo painel admin
-- ==============================================================================

ALTER TABLE public.noticias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- Notícias: Leitura pública para todos os visitantes do portal
CREATE POLICY "Permitir leitura publica de noticias" 
ON public.noticias FOR SELECT 
USING (true);

-- Notícias: Inserção, Atualização e Exclusão pelo Painel Admin (usando a chave anon)
CREATE POLICY "Permitir insercao de noticias pelo painel" 
ON public.noticias FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Permitir atualizacao de noticias pelo painel" 
ON public.noticias FOR UPDATE 
USING (true);

CREATE POLICY "Permitir exclusao de noticias pelo painel" 
ON public.noticias FOR DELETE 
USING (true);

-- Categorias: Leitura e Edição
CREATE POLICY "Permitir leitura publica de categorias" 
ON public.categorias FOR SELECT 
USING (true);

CREATE POLICY "Permitir gerenciamento de categorias" 
ON public.categorias FOR ALL 
USING (true);

-- Comentários: Leitura pública e postagem de comentários
CREATE POLICY "Permitir leitura publica de comentarios" 
ON public.comentarios FOR SELECT 
USING (true);

CREATE POLICY "Permitir postagem de comentarios" 
ON public.comentarios FOR INSERT 
WITH CHECK (true);

-- ==============================================================================
-- PRONTO! Suas tabelas e políticas de acesso estão configuradas.
-- Agora basta copiar as credenciais do seu projeto Supabase:
-- Project URL (ex: https://xyz.supabase.co) e Anon Key
-- e colar nas configurações do seu painel em /admin
-- ==============================================================================
