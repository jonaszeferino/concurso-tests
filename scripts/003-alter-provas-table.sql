-- Primeiro, vamos tornar o campo codigo_interno opcional
ALTER TABLE public.provas
ALTER COLUMN codigo_interno DROP NOT NULL;

-- Agora vamos adicionar os novos campos
ALTER TABLE public.provas
ADD COLUMN IF NOT EXISTS titulo text,
ADD COLUMN IF NOT EXISTS disciplina_id bigint REFERENCES public.disciplinas(id),
ADD COLUMN IF NOT EXISTS data_prova timestamp with time zone,
ADD COLUMN IF NOT EXISTS descricao text,
ADD COLUMN IF NOT EXISTS nivel_dificuldade text CHECK (nivel_dificuldade IN ('facil', 'medio', 'dificil')),
ADD COLUMN IF NOT EXISTS tempo_limite integer CHECK (tempo_limite > 0),
ADD COLUMN IF NOT EXISTS numero_questoes integer CHECK (numero_questoes > 0),
ADD COLUMN IF NOT EXISTS updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()),
ADD COLUMN IF NOT EXISTS tipo_prova VARCHAR(50) DEFAULT 'objetiva' CHECK (tipo_prova IN ('objetiva', 'discursiva', 'pratica'));

-- Criar índices para os novos campos
CREATE INDEX IF NOT EXISTS provas_disciplina_id_idx ON public.provas(disciplina_id);
CREATE INDEX IF NOT EXISTS provas_data_prova_idx ON public.provas(data_prova);

-- Criar função para atualizar o updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar o updated_at
DROP TRIGGER IF EXISTS handle_provas_updated_at ON public.provas;
CREATE TRIGGER handle_provas_updated_at
    BEFORE UPDATE ON public.provas
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Adicionar comentário na coluna
COMMENT ON COLUMN public.provas.tipo_prova IS 'Tipo da prova: objetiva, discursiva ou pratica'; 