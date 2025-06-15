import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { sql } from "@vercel/postgres"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const prova_id = searchParams.get('prova_id')
    const disciplina_id = searchParams.get('disciplina_id')
    const busca = searchParams.get('busca')

    let query = `
      SELECT 
        q.id,
        q.numero,
        q.enunciado,
        q.alternativas,
        q.resposta_correta,
        q.comentario,
        q.status,
        p.id as prova_id,
        p.titulo as prova_titulo,
        c.titulo as concurso_titulo,
        d.nome as disciplina_nome
      FROM questao q
      JOIN prova p ON q.prova_id = p.id
      JOIN concurso c ON p.concurso_id = c.id
      JOIN disciplina d ON p.disciplina_id = d.id
      WHERE 1=1
    `

    const params: any[] = []

    if (prova_id) {
      query += ` AND q.prova_id = $${params.length + 1}`
      params.push(prova_id)
    }

    if (disciplina_id) {
      query += ` AND p.disciplina_id = $${params.length + 1}`
      params.push(disciplina_id)
    }

    if (busca) {
      query += ` AND (q.enunciado ILIKE $${params.length + 1} OR q.alternativas::text ILIKE $${params.length + 1})`
      params.push(`%${busca}%`)
    }

    query += ` ORDER BY q.numero`

    const { rows } = await sql.query(query, params)

    const questoes = rows.map(row => ({
      id: row.id,
      numero: row.numero,
      enunciado: row.enunciado,
      alternativas: row.alternativas,
      prova: {
        id: row.prova_id,
        titulo: row.prova_titulo,
        concurso: {
          titulo: row.concurso_titulo
        },
        disciplina: {
          nome: row.disciplina_nome
        }
      }
    }))

    return NextResponse.json(questoes)
  } catch (error) {
    console.error('Erro ao buscar questões:', error)
    return NextResponse.json(
      { error: "Erro ao buscar questões" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    console.log('Dados recebidos na API:', body)

    // Validação dos campos obrigatórios
    const requiredFields = ['prova_id', 'disciplina_id', 'enunciado', 'alternativas']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.error('Campos obrigatórios faltando:', missingFields)
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Validar alternativas
    if (!Array.isArray(body.alternativas) || body.alternativas.length < 2) {
      return NextResponse.json(
        { error: 'É necessário pelo menos 2 alternativas' },
        { status: 400 }
      )
    }

    // Validar resposta correta
    const respostaCorreta = typeof body.resposta_correta === 'string' 
      ? parseInt(body.resposta_correta) 
      : body.resposta_correta;

    console.log('Resposta correta recebida:', body.resposta_correta)
    console.log('Resposta correta convertida:', respostaCorreta)

    if (respostaCorreta === undefined || respostaCorreta === null || isNaN(respostaCorreta)) {
      return NextResponse.json(
        { error: 'Resposta correta inválida' },
        { status: 400 }
      )
    }

    if (respostaCorreta < 0 || respostaCorreta >= body.alternativas.length) {
      return NextResponse.json(
        { error: 'Resposta correta fora do intervalo válido' },
        { status: 400 }
      )
    }

    // Verificar se a prova existe
    const { data: provaData, error: provaError } = await supabase
      .from('prova')
      .select('id')
      .eq('id', body.prova_id)
      .single()

    if (provaError || !provaData) {
      console.error('Erro ao verificar prova:', provaError)
      return NextResponse.json(
        { error: 'Prova não encontrada' },
        { status: 404 }
      )
    }

    // Verificar se a disciplina existe
    const { data: disciplinaData, error: disciplinaError } = await supabase
      .from('disciplina')
      .select('id')
      .eq('id', body.disciplina_id)
      .single()

    if (disciplinaError || !disciplinaData) {
      console.error('Erro ao verificar disciplina:', disciplinaError)
      return NextResponse.json(
        { error: 'Disciplina não encontrada' },
        { status: 404 }
      )
    }

    // Formatar os dados para inserção
    const formattedData = {
      numero: body.numero || 0,
      prova_id: parseInt(body.prova_id),
      disciplina_id: parseInt(body.disciplina_id),
      enunciado: body.enunciado,
      alternativas: body.alternativas,
      resposta_correta: respostaCorreta,
      comentario: body.comentario || null,
      status: body.status || 'ativa'
    }

    console.log('Dados formatados para inserção:', formattedData)

    const { data, error } = await supabase
      .from('questao')
      .insert([formattedData])
      .select(`
        *,
        prova:prova_id (
          id,
          titulo,
          codigo_interno,
          concurso:concurso_id (
            id,
            orgao,
            ano
          )
        ),
        disciplina:disciplina_id (
          id,
          nome,
          area_de_conhecimento
        )
      `)
      .single()

    if (error) {
      console.error('Erro ao inserir questão:', error)
      return NextResponse.json(
        { error: 'Erro ao criar questão', details: error },
        { status: 500 }
      )
    }

    console.log('Questão criada com sucesso:', data)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'ID é obrigatório' }, { status: 400 })
  }

  const { error } = await supabase
    .from('questao')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro ao excluir questão:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
} 