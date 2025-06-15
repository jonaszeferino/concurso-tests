import { NextResponse } from 'next/server'
import { db } from '@/lib/database'

export async function GET() {
  try {
    console.log('Iniciando busca de provas...')
    
    // Primeiro, vamos verificar se a tabela existe
    const { data: tableCheck, error: tableError } = await db
      .from('prova')
      .select('id')
      .limit(1)

    if (tableError) {
      console.error('Erro ao verificar tabela provas:', tableError)
      return NextResponse.json(
        { 
          error: 'Erro ao acessar tabela provas',
          details: tableError.message
        },
        { status: 500 }
      )
    }

    console.log('Tabela provas existe, buscando dados...')
    
    const { data, error } = await db
      .from('prova')
      .select(`
        id,
        titulo,
        codigo_interno,
        data_prova,
        descricao,
        nivel_dificuldade,
        tempo_limite,
        numero_questoes,
        updated_at,
        concurso:concurso_id (
          id,
          orgao,
          ano
        ),
        disciplina:disciplina_id (
          id,
          nome
        ),
        cargo:cargo_id (
          id,
          nome_do_cargo,
          nivel
        )
      `)
      .order('data_prova', { ascending: false })

    if (error) {
      console.error('Erro detalhado ao buscar provas:', error)
      return NextResponse.json(
        { 
          error: 'Erro ao buscar provas',
          details: error.message
        },
        { status: 500 }
      )
    }

    console.log('Provas encontradas:', data?.length || 0)
    return NextResponse.json(data || [])
  } catch (error: any) {
    console.error('Erro ao buscar provas:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar provas',
        details: error.message || 'Erro desconhecido'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Dados recebidos:', body)

    // Validação dos campos obrigatórios
    const requiredFields = ['titulo', 'concurso_id', 'disciplina_id', 'cargo_id']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      console.error('Campos obrigatórios faltando:', missingFields)
      return NextResponse.json(
        { error: `Campos obrigatórios faltando: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Buscar informações do concurso
    const { data: concursoData, error: concursoError } = await db
      .from('concurso')
      .select('orgao, ano')
      .eq('id', body.concurso_id)
      .single()

    if (concursoError) {
      console.error('Erro ao buscar concurso:', concursoError)
      return NextResponse.json(
        { error: 'Erro ao buscar informações do concurso', details: concursoError },
        { status: 500 }
      )
    }

    if (!concursoData) {
      console.error('Concurso não encontrado:', body.concurso_id)
      return NextResponse.json(
        { error: 'Concurso não encontrado' },
        { status: 404 }
      )
    }

    console.log('Dados do concurso:', concursoData)

    // Gerar código interno se não fornecido
    const codigoInterno = body.codigo_interno || `${concursoData.orgao}-${concursoData.ano}-${Date.now().toString().slice(-4)}`

    // Formatar os dados para inserção
    const formattedData = {
      titulo: body.titulo,
      descricao: body.descricao,
      concurso_id: body.concurso_id,
      disciplina_id: body.disciplina_id,
      cargo_id: body.cargo_id,
      data_prova: body.data_prova,
      tempo_limite: body.tempo_limite,
      numero_questoes: body.numero_questoes,
      tipo_de_prova: body.tipo_de_prova || 'objetiva',
      turno_data: body.turno_data || new Date().toISOString(),
      codigo_interno: codigoInterno,
      nivel_dificuldade: body.nivel_dificuldade || 'medio'
    }

    console.log('Dados formatados para inserção:', formattedData)

    const { data, error } = await db
      .from('prova')
      .insert([formattedData])
      .select()
      .single()

    if (error) {
      console.error('Erro ao inserir prova:', error)
      return NextResponse.json(
        { error: 'Erro ao criar prova', details: error },
        { status: 500 }
      )
    }

    console.log('Prova criada com sucesso:', data)
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
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'ID da prova não fornecido' },
        { status: 400 }
      )
    }

    const { error } = await db
      .from('prova')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao deletar prova:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar prova', details: error },
        { status: 500 }
      )
    }

    return NextResponse.json({ message: 'Prova deletada com sucesso' })
  } catch (error: any) {
    console.error('Erro ao processar requisição:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
} 