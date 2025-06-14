-- Primeiro, vamos garantir que a coluna banca_id existe
ALTER TABLE public.concurso 
ADD COLUMN IF NOT EXISTS banca_id INTEGER;

-- Agora vamos adicionar a chave estrangeira
ALTER TABLE public.concurso
DROP CONSTRAINT IF EXISTS fk_concurso_banca;

ALTER TABLE public.concurso
ADD CONSTRAINT fk_concurso_banca
FOREIGN KEY (banca_id)
REFERENCES public.banca_examinadora(id)
ON DELETE SET NULL;

-- Adicionar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_concurso_banca_id 
ON public.concurso(banca_id); 