-- ==============================================================================
-- GIRO 360 - CONFIGURAÇÃO DO BUCKET DE IMAGENS (SUPABASE STORAGE)
-- Execute este script no SQL Editor do Supabase para habilitar o upload de imagens
-- ==============================================================================

-- 1. Criar o bucket público 'imagens-noticias'
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES (
    'imagens-noticias', 
    'imagens-noticias', 
    true, 
    10485760, -- Limite de 10MB por imagem
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Remover políticas antigas para evitar duplicidade
DROP POLICY IF EXISTS "Imagens publicas para leitura" ON storage.objects;
DROP POLICY IF EXISTS "Upload de imagens liberado" ON storage.objects;
DROP POLICY IF EXISTS "Atualizacao de imagens liberada" ON storage.objects;
DROP POLICY IF EXISTS "Exclusao de imagens liberada" ON storage.objects;

-- 3. Criar Políticas de Acesso (RLS) para o bucket 'imagens-noticias'

-- Permitir que qualquer leitor do site visualize as imagens
CREATE POLICY "Imagens publicas para leitura" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'imagens-noticias');

-- Permitir upload de novas imagens pelo painel administrativo
CREATE POLICY "Upload de imagens liberado" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'imagens-noticias');

-- Permitir substituição/atualização de imagens
CREATE POLICY "Atualizacao de imagens liberada" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'imagens-noticias');

-- Permitir exclusão de imagens
CREATE POLICY "Exclusao de imagens liberada" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'imagens-noticias');

