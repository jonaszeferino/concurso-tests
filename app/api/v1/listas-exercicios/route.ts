import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

// GET - Buscar todas as listas do usuário
export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: listas, error } = await supabase
      .from('listas_exercicios')
      .select(`
        id,
        titulo,
        descricao,
        created_at,
        questoes:lista_exercicios_questoes (
          questao:questao_id (
            id,
            numero,
            enunciado,
            alternativas,
            prova:prova_id (
              id,
              titulo,
              disciplina:disciplina_id (
                id,
                nome
              ),
              concurso:concurso_id (
                id,
                orgao,
                ano,
                banca:banca_id (
                  id,
                  nome
                )
              )
            )
          )
        )
      `)
      .eq('usuario_id', 1) // Temporariamente fixo como 1
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar listas:', error)
      return NextResponse.json(
        { error: "Erro ao buscar listas de exercícios", details: error.message },
        { status: 500 }
      )
    }

    // Transformar os dados para o formato esperado pelo frontend
    const listasFormatadas = listas.map(lista => ({
      id: lista.id,
      titulo: lista.titulo,
      descricao: lista.descricao,
      created_at: lista.created_at,
      questoes: lista.questoes.map((item: any) => ({
        id: item.questao.id,
        numero: item.questao.numero,
        enunciado: item.questao.enunciado,
        alternativas: item.questao.alternativas,
        prova: {
          id: item.questao.prova.id,
          titulo: item.questao.prova.titulo,
          concurso: {
            titulo: `${item.questao.prova.concurso.orgao} ${item.questao.prova.concurso.ano}`,
            banca: item.questao.prova.concurso.banca.nome
          },
          disciplina: {
            nome: item.questao.prova.disciplina.nome
          }
        }
      }))
    }))

    return NextResponse.json(listasFormatadas)
  } catch (error) {
    console.error('Erro ao buscar listas:', error)
    return NextResponse.json(
      { error: "Erro ao buscar listas de exercícios", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

// POST - Criar nova lista de exercícios
export async function POST(request: Request) {
  try {
    const { titulo, descricao, questoes } = await request.json()
    
    if (!titulo || !questoes || !Array.isArray(questoes)) {
      return NextResponse.json(
        { error: "Dados inválidos", details: "Título e questões são obrigatórios" },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Iniciar transação
    const { data: lista, error: listaError } = await supabase
      .from('listas_exercicios')
      .insert({
        titulo,
        descricao,
        usuario_id: 1 // Temporariamente fixo como 1
      })
      .select()
      .single()

    if (listaError) {
      console.error('Erro ao criar lista:', listaError)
      return NextResponse.json(
        { error: "Erro ao criar lista de exercícios", details: listaError.message },
        { status: 500 }
      )
    }

    // Inserir questões da lista
    const questoesLista = questoes.map((questaoId: number) => ({
      lista_exercicios_id: lista.id,
      questao_id: questaoId
    }))

    const { error: questoesError } = await supabase
      .from('lista_exercicios_questoes')
      .insert(questoesLista)

    if (questoesError) {
      console.error('Erro ao adicionar questões:', questoesError)
      return NextResponse.json(
        { error: "Erro ao adicionar questões à lista", details: questoesError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Lista criada com sucesso",
      lista_id: lista.id
    })
  } catch (error) {
    console.error('Erro ao criar lista:', error)
    return NextResponse.json(
      { error: "Erro ao criar lista de exercícios", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
} 