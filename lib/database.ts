import { createClient } from '@supabase/supabase-js'
import type { Concurso, BancaExaminadora, Cargo, Prova, Disciplina, Questao, Gabarito } from "./supabase"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const db = createClient(supabaseUrl, supabaseKey)

// Verificar se o Supabase está configurado
if (!db) {
  console.warn("Supabase client not configured")
}

// Funções para Concursos
export async function getConcursos() {
  try {
    const { data, error } = await db.from("concursos").select("*").order("ano", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in getConcursos:", error)
    throw error
  }
}

export async function createConcurso(concurso: Omit<Concurso, "id" | "created_at">) {
  try {
    const { data, error } = await db.from("concursos").insert([concurso]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createConcurso:", error)
    throw error
  }
}

export async function updateConcurso(id: number, concurso: Partial<Concurso>) {
  try {
    const { data, error } = await db.from("concursos").update(concurso).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in updateConcurso:", error)
    throw error
  }
}

export async function deleteConcurso(id: number) {
  try {
    const { error } = await db.from("concursos").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error in deleteConcurso:", error)
    throw error
  }
}

// Funções para Bancas
export async function getBancas() {
  try {
    const { data, error } = await db.from("bancas_examinadoras").select("*").order("nome")

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in getBancas:", error)
    throw error
  }
}

export async function createBanca(banca: Omit<BancaExaminadora, "id" | "created_at">) {
  try {
    const { data, error } = await db.from("bancas_examinadoras").insert([banca]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createBanca:", error)
    throw error
  }
}

export async function updateBanca(id: number, banca: Partial<BancaExaminadora>) {
  try {
    const { data, error } = await db.from("bancas_examinadoras").update(banca).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in updateBanca:", error)
    throw error
  }
}

export async function deleteBanca(id: number) {
  try {
    const { error } = await db.from("bancas_examinadoras").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error in deleteBanca:", error)
    throw error
  }
}

// Funções para Cargos
export async function getCargos() {
  try {
    const { data, error } = await db.from("cargos").select("*").order("nome")

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in getCargos:", error)
    throw error
  }
}

export async function createCargo(cargo: Omit<Cargo, "id" | "created_at">) {
  try {
    const { data, error } = await db.from("cargos").insert([cargo]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createCargo:", error)
    throw error
  }
}

export async function updateCargo(id: number, cargo: Partial<Cargo>) {
  try {
    const { data, error } = await db.from("cargos").update(cargo).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in updateCargo:", error)
    throw error
  }
}

export async function deleteCargo(id: number) {
  try {
    const { error } = await db.from("cargos").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error in deleteCargo:", error)
    throw error
  }
}

// Funções para Disciplinas
export async function getDisciplinas() {
  try {
    const { data, error } = await db.from("disciplinas").select("*").order("nome")

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in getDisciplinas:", error)
    throw error
  }
}

export async function createDisciplina(disciplina: Omit<Disciplina, "id" | "created_at">) {
  try {
    const { data, error } = await db.from("disciplinas").insert([disciplina]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createDisciplina:", error)
    throw error
  }
}

export async function updateDisciplina(id: number, disciplina: Partial<Disciplina>) {
  try {
    const { data, error } = await db.from("disciplinas").update(disciplina).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in updateDisciplina:", error)
    throw error
  }
}

export async function deleteDisciplina(id: number) {
  try {
    const { error } = await db.from("disciplinas").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error in deleteDisciplina:", error)
    throw error
  }
}

// Funções para Provas
export async function getProvas() {
  try {
    const { data, error } = await db
      .from("provas")
      .select(`
      *,
      concursos (orgao, ano, edital),
      cargos (nome, nivel)
    `)
      .order("created_at", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in getProvas:", error)
    throw error
  }
}

export async function getProvaById(id: number) {
  try {
    const { data, error } = await db
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
  } catch (error) {
    console.error("Error in getProvaById:", error)
    throw error
  }
}

export async function createProva(prova: Omit<Prova, "id" | "created_at">) {
  try {
    const { data, error } = await db.from("provas").insert([prova]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createProva:", error)
    throw error
  }
}

export async function updateProva(id: number, prova: Partial<Prova>) {
  try {
    const { data, error } = await db.from("provas").update(prova).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in updateProva:", error)
    throw error
  }
}

export async function deleteProva(id: number) {
  try {
    const { error } = await db.from("provas").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error in deleteProva:", error)
    throw error
  }
}

// Funções para Questões
export async function getQuestoes() {
  try {
    const { data, error } = await db
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
  } catch (error) {
    console.error("Error in getQuestoes:", error)
    throw error
  }
}

export async function getQuestoesByProva(provaId: number) {
  try {
    const { data, error } = await db
      .from("questoes")
      .select(`
      *,
      disciplinas (nome)
    `)
      .eq("prova_id", provaId)
      .order("numero")

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in getQuestoesByProva:", error)
    throw error
  }
}

export async function createQuestao(questao: Omit<Questao, "id" | "created_at">) {
  try {
    const { data, error } = await db.from("questoes").insert([questao]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createQuestao:", error)
    throw error
  }
}

export async function updateQuestao(id: number, questao: Partial<Questao>) {
  try {
    const { data, error } = await db.from("questoes").update(questao).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in updateQuestao:", error)
    throw error
  }
}

export async function deleteQuestao(id: number) {
  try {
    const { error } = await db.from("questoes").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error in deleteQuestao:", error)
    throw error
  }
}

// Funções para Gabaritos
export async function getGabaritoByProva(provaId: number) {
  try {
    const { data, error } = await db.from("gabaritos").select("*").eq("prova_id", provaId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in getGabaritoByProva:", error)
    throw error
  }
}

export async function createGabarito(gabarito: Omit<Gabarito, "id" | "created_at">) {
  try {
    const { data, error } = await db.from("gabaritos").insert([gabarito]).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in createGabarito:", error)
    throw error
  }
}

export async function updateGabarito(id: number, gabarito: Partial<Gabarito>) {
  try {
    const { data, error } = await db.from("gabaritos").update(gabarito).eq("id", id).select().single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in updateGabarito:", error)
    throw error
  }
}

export async function deleteGabarito(id: number) {
  try {
    const { error } = await db.from("gabaritos").delete().eq("id", id)

    if (error) throw error
  } catch (error) {
    console.error("Error in deleteGabarito:", error)
    throw error
  }
}

// Funções de busca e filtros
export async function searchProvas(filters: {
  orgao?: string
  banca?: string
  ano?: number
  disciplina?: string
  search?: string
}) {
  try {
    let query = db.from("provas").select(`
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
  } catch (error) {
    console.error("Error in searchProvas:", error)
    throw error
  }
}

// Função para estatísticas do dashboard
export async function getDashboardStats() {
  try {
    const [concursos, provas, questoes, disciplinas] = await Promise.all([
      db.from("concursos").select("id", { count: "exact" }),
      db.from("provas").select("id", { count: "exact" }),
      db.from("questoes").select("id", { count: "exact" }),
      db.from("disciplinas").select("id", { count: "exact" }),
    ])

    return {
      concursos: concursos.count || 0,
      provas: provas.count || 0,
      questoes: questoes.count || 0,
      disciplinas: disciplinas.count || 0,
    }
  } catch (error) {
    console.error("Error in getDashboardStats:", error)
    return {
      concursos: 0,
      provas: 0,
      questoes: 0,
      disciplinas: 0,
    }
  }
}

// Função para contar questões por prova
export async function getQuestoesCountByProva(provaId: number) {
  try {
    const { count, error } = await db
      .from("questoes")
      .select("*", { count: "exact", head: true })
      .eq("prova_id", provaId)

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error("Error in getQuestoesCountByProva:", error)
    return 0
  }
}

// Função para buscar disciplinas únicas de uma prova
export async function getDisciplinasByProva(provaId: number) {
  try {
    const { data, error } = await db
      .from("questoes")
      .select(`
      disciplinas (nome)
    `)
      .eq("prova_id", provaId)

    if (error) throw error

    // Extrair nomes únicos das disciplinas
    const disciplinasUnicas = [...new Set(data.map((item) => item.disciplinas.nome))]
    return disciplinasUnicas
  } catch (error) {
    console.error("Error in getDisciplinasByProva:", error)
    return []
  }
}
