import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

// GET - Buscar questões de uma lista específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: questoes, error } = await supabase
      .from('lista_exercicios_questoes')
      .select(`
        id,
        ordem,
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
      `)
      .eq('lista_exercicios_id', params.id)
      .order('ordem')

    if (error) {
      console.error('Erro ao buscar questões da lista:', error)
      return NextResponse.json(
        { error: "Erro ao buscar questões da lista", details: error.message },
        { status: 500 }
      )
    }

    // Transformar os dados para o formato esperado pelo frontend
    const questoesFormatadas = questoes.map(item => ({
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

    return NextResponse.json(questoesFormatadas)
  } catch (error) {
    console.error('Erro ao buscar questões da lista:', error)
    return NextResponse.json(
      { error: "Erro ao buscar questões da lista", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

// POST - Adicionar questões à lista
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { questoes } = await request.json()
    
    if (!questoes || !Array.isArray(questoes)) {
      return NextResponse.json(
        { error: "Dados inválidos", details: "Lista de questões é obrigatória" },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Buscar a ordem atual mais alta
    const { data: ultimaOrdem } = await supabase
      .from('lista_exercicios_questoes')
      .select('ordem')
      .eq('lista_exercicios_id', params.id)
      .order('ordem', { ascending: false })
      .limit(1)
      .single()

    const ordemInicial = (ultimaOrdem?.ordem || 0) + 1

    // Preparar dados para inserção
    const questoesLista = questoes.map((questaoId: number, index: number) => ({
      lista_exercicios_id: params.id,
      questao_id: questaoId,
      ordem: ordemInicial + index
    }))

    const { error } = await supabase
      .from('lista_exercicios_questoes')
      .insert(questoesLista)

    if (error) {
      console.error('Erro ao adicionar questões:', error)
      return NextResponse.json(
        { error: "Erro ao adicionar questões à lista", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Questões adicionadas com sucesso"
    })
  } catch (error) {
    console.error('Erro ao adicionar questões:', error)
    return NextResponse.json(
      { error: "Erro ao adicionar questões à lista", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

// DELETE - Remover questão da lista
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { questao_id } = await request.json()
    
    if (!questao_id) {
      return NextResponse.json(
        { error: "Dados inválidos", details: "ID da questão é obrigatório" },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase
      .from('lista_exercicios_questoes')
      .delete()
      .eq('lista_exercicios_id', params.id)
      .eq('questao_id', questao_id)

    if (error) {
      console.error('Erro ao remover questão:', error)
      return NextResponse.json(
        { error: "Erro ao remover questão da lista", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Questão removida com sucesso"
    })
  } catch (error) {
    console.error('Erro ao remover questão:', error)
    return NextResponse.json(
      { error: "Erro ao remover questão da lista", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
} 