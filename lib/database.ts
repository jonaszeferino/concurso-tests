import { supabase } from "./supabase"
import type { Concurso, BancaExaminadora, Cargo, Prova, Disciplina, Questao, Gabarito } from "./supabase"

// Funções para Concursos
export async function getConcursos() {
  const { data, error } = await supabase.from("concursos").select("*").order("ano", { ascending: false })

  if (error) throw error
  return data
}

export async function createConcurso(concurso: Omit<Concurso, "id" | "created_at">) {
  const { data, error } = await supabase.from("concursos").insert([concurso]).select().single()

  if (error) throw error
  return data
}

export async function updateConcurso(id: number, concurso: Partial<Concurso>) {
  const { data, error } = await supabase.from("concursos").update(concurso).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteConcurso(id: number) {
  const { error } = await supabase.from("concursos").delete().eq("id", id)

  if (error) throw error
}

// Funções para Bancas
export async function getBancas() {
  const { data, error } = await supabase.from("bancas_examinadoras").select("*").order("nome")

  if (error) throw error
  return data
}

export async function createBanca(banca: Omit<BancaExaminadora, "id" | "created_at">) {
  const { data, error } = await supabase.from("bancas_examinadoras").insert([banca]).select().single()

  if (error) throw error
  return data
}

export async function updateBanca(id: number, banca: Partial<BancaExaminadora>) {
  const { data, error } = await supabase.from("bancas_examinadoras").update(banca).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteBanca(id: number) {
  const { error } = await supabase.from("bancas_examinadoras").delete().eq("id", id)

  if (error) throw error
}

// Funções para Cargos
export async function getCargos() {
  const { data, error } = await supabase.from("cargos").select("*").order("nome")

  if (error) throw error
  return data
}

export async function createCargo(cargo: Omit<Cargo, "id" | "created_at">) {
  const { data, error } = await supabase.from("cargos").insert([cargo]).select().single()

  if (error) throw error
  return data
}

export async function updateCargo(id: number, cargo: Partial<Cargo>) {
  const { data, error } = await supabase.from("cargos").update(cargo).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteCargo(id: number) {
  const { error } = await supabase.from("cargos").delete().eq("id", id)

  if (error) throw error
}

// Funções para Disciplinas
export async function getDisciplinas() {
  const { data, error } = await supabase.from("disciplinas").select("*").order("nome")

  if (error) throw error
  return data
}

export async function createDisciplina(disciplina: Omit<Disciplina, "id" | "created_at">) {
  const { data, error } = await supabase.from("disciplinas").insert([disciplina]).select().single()

  if (error) throw error
  return data
}

export async function updateDisciplina(id: number, disciplina: Partial<Disciplina>) {
  const { data, error } = await supabase.from("disciplinas").update(disciplina).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteDisciplina(id: number) {
  const { error } = await supabase.from("disciplinas").delete().eq("id", id)

  if (error) throw error
}

// Funções para Provas
export async function getProvas() {
  const { data, error } = await supabase
    .from("provas")
    .select(`
      *,
      concursos (orgao, ano, edital),
      cargos (nome, nivel)
    `)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export async function getProvaById(id: number) {
  const { data, error } = await supabase
    .from("provas")
    .select(`
      *,
      concursos (orgao, ano, edital),
      cargos (nome, nivel)
    `)
    .eq("id", id)
    .single()

  if (error) throw error
  return data
}

export async function createProva(prova: Omit<Prova, "id" | "created_at">) {
  const { data, error } = await supabase.from("provas").insert([prova]).select().single()

  if (error) throw error
  return data
}

export async function updateProva(id: number, prova: Partial<Prova>) {
  const { data, error } = await supabase.from("provas").update(prova).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteProva(id: number) {
  const { error } = await supabase.from("provas").delete().eq("id", id)

  if (error) throw error
}

// Funções para Questões
export async function getQuestoes() {
  const { data, error } = await supabase
    .from("questoes")
    .select(`
      *,
      disciplinas (nome),
      provas (codigo_interno),
      bancas_examinadoras (nome, sigla)
    `)
    .order("numero")

  if (error) throw error
  return data
}

export async function getQuestoesByProva(provaId: number) {
  const { data, error } = await supabase
    .from("questoes")
    .select(`
      *,
      disciplinas (nome)
    `)
    .eq("prova_id", provaId)
    .order("numero")

  if (error) throw error
  return data
}

export async function createQuestao(questao: Omit<Questao, "id" | "created_at">) {
  const { data, error } = await supabase.from("questoes").insert([questao]).select().single()

  if (error) throw error
  return data
}

export async function updateQuestao(id: number, questao: Partial<Questao>) {
  const { data, error } = await supabase.from("questoes").update(questao).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteQuestao(id: number) {
  const { error } = await supabase.from("questoes").delete().eq("id", id)

  if (error) throw error
}

// Funções para Gabaritos
export async function getGabaritoByProva(provaId: number) {
  const { data, error } = await supabase.from("gabaritos").select("*").eq("prova_id", provaId).single()

  if (error) throw error
  return data
}

export async function createGabarito(gabarito: Omit<Gabarito, "id" | "created_at">) {
  const { data, error } = await supabase.from("gabaritos").insert([gabarito]).select().single()

  if (error) throw error
  return data
}

export async function updateGabarito(id: number, gabarito: Partial<Gabarito>) {
  const { data, error } = await supabase.from("gabaritos").update(gabarito).eq("id", id).select().single()

  if (error) throw error
  return data
}

export async function deleteGabarito(id: number) {
  const { error } = await supabase.from("gabaritos").delete().eq("id", id)

  if (error) throw error
}

// Funções de busca e filtros
export async function searchProvas(filters: {
  orgao?: string
  banca?: string
  ano?: number
  disciplina?: string
  search?: string
}) {
  let query = supabase.from("provas").select(`
      *,
      concursos (orgao, ano, edital),
      cargos (nome, nivel)
    `)

  if (filters.orgao && filters.orgao !== "Todos") {
    query = query.eq("concursos.orgao", filters.orgao)
  }

  if (filters.ano) {
    query = query.eq("concursos.ano", filters.ano)
  }

  if (filters.search) {
    query = query.or(`concursos.orgao.ilike.%${filters.search}%,cargos.nome.ilike.%${filters.search}%`)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Função para estatísticas do dashboard
export async function getDashboardStats() {
  const [concursos, provas, questoes, disciplinas] = await Promise.all([
    supabase.from("concursos").select("id", { count: "exact" }),
    supabase.from("provas").select("id", { count: "exact" }),
    supabase.from("questoes").select("id", { count: "exact" }),
    supabase.from("disciplinas").select("id", { count: "exact" }),
  ])

  return {
    concursos: concursos.count || 0,
    provas: provas.count || 0,
    questoes: questoes.count || 0,
    disciplinas: disciplinas.count || 0,
  }
}

// Função para contar questões por prova
export async function getQuestoesCountByProva(provaId: number) {
  const { count, error } = await supabase
    .from("questoes")
    .select("*", { count: "exact", head: true })
    .eq("prova_id", provaId)

  if (error) throw error
  return count || 0
}

// Função para buscar disciplinas únicas de uma prova
export async function getDisciplinasByProva(provaId: number) {
  const { data, error } = await supabase
    .from("questoes")
    .select(`
      disciplinas (nome)
    `)
    .eq("prova_id", provaId)

  if (error) throw error

  // Extrair nomes únicos das disciplinas
  const disciplinasUnicas = [...new Set(data.map((item) => item.disciplinas.nome))]
  return disciplinasUnicas
}
