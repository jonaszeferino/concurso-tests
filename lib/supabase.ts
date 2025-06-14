import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types para as tabelas
export interface Concurso {
  id: number
  orgao: string
  ano: number
  edital: string
  status: string
  data_prova: string
  created_at: string
}

export interface BancaExaminadora {
  id: number
  nome: string
  sigla: string
  site_oficial?: string
  estilo_prova: string
  created_at: string
}

export interface Cargo {
  id: number
  nome: string
  nivel: string
  salario?: number
  requisitos?: string
  lotacao?: string
  created_at: string
}

export interface Prova {
  id: number
  concurso_id: number
  cargo_id: number
  codigo_interno: string
  tipo_prova: string
  turno_data: string
  versao?: string
  created_at: string
}

export interface Disciplina {
  id: number
  nome: string
  area_conhecimento: string
  created_at: string
}

export interface Questao {
  id: number
  numero: number
  enunciado: string
  alternativas: string[]
  resposta_correta: number
  comentario?: string
  disciplina_id: number
  prova_id: number
  banca_id: number
  created_at: string
}

export interface Gabarito {
  id: number
  prova_id: number
  respostas_corretas: number[]
  formato_original?: string
  created_at: string
}
