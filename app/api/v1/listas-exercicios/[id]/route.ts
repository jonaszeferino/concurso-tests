import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'

// GET - Buscar uma lista específica
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data: lista, error } = await supabase
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
      .eq('id', params.id)
      .eq('usuario_id', 1) // Temporariamente fixo como 1
      .single()

    if (error) {
      console.error('Erro ao buscar lista:', error)
      return NextResponse.json(
        { error: "Erro ao buscar lista de exercícios", details: error.message },
        { status: 500 }
      )
    }

    if (!lista) {
      return NextResponse.json(
        { error: "Lista não encontrada" },
        { status: 404 }
      )
    }

    // Transformar os dados para o formato esperado pelo frontend
    const listaFormatada = {
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
    }

    return NextResponse.json(listaFormatada)
  } catch (error) {
    console.error('Erro ao buscar lista:', error)
    return NextResponse.json(
      { error: "Erro ao buscar lista de exercícios", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir uma lista
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies })

    const { error } = await supabase
      .from('listas_exercicios')
      .delete()
      .eq('id', params.id)
      .eq('usuario_id', 1) // Temporariamente fixo como 1

    if (error) {
      console.error('Erro ao excluir lista:', error)
      return NextResponse.json(
        { error: "Erro ao excluir lista", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: "Lista excluída com sucesso"
    })
  } catch (error) {
    console.error('Erro ao excluir lista:', error)
    return NextResponse.json(
      { error: "Erro ao excluir lista", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
} 