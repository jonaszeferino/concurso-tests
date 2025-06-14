import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  // Primeiro, buscar os concursos
  const { data: concursos, error: concursosError } = await supabase
    .from('concurso')
    .select('*')
    .order('data_da_prova', { ascending: false })

  if (concursosError) {
    console.error('Erro no GET:', concursosError)
    return NextResponse.json({ error: concursosError.message }, { status: 500 })
  }

  // Para cada concurso, buscar os dados da banca
  const concursosComBanca = await Promise.all(
    concursos.map(async (concurso) => {
      if (!concurso.banca_id) return concurso;

      const { data: bancaData, error: bancaError } = await supabase
        .from('banca_examinadora')
        .select('id, nome, sigla')
        .eq('id', concurso.banca_id)
        .single()

      if (bancaError) {
        console.error('Erro ao buscar banca:', bancaError)
        return concurso;
      }

      return {
        ...concurso,
        banca_examinadora: bancaData
      }
    })
  )

  return NextResponse.json(concursosComBanca)
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    console.log('Dados recebidos na API:', body)

    // Primeiro, buscar a banca para obter a sigla
    const { data: bancaData, error: bancaError } = await supabase
      .from('banca_examinadora')
      .select('sigla')
      .eq('id', body.banca_id)
      .single()

    if (bancaError) {
      console.error('Erro ao buscar banca:', bancaError)
      return NextResponse.json({ error: 'Erro ao buscar dados da banca' }, { status: 500 })
    }

    // Inserir o concurso
    const { data: concursoData, error: concursoError } = await supabase
      .from('concurso')
      .insert([
        {
          orgao: body.orgao,
          ano: body.ano,
          edital: body.edital,
          status: body.status,
          data_da_prova: body.data_da_prova,
          banca_id: body.banca_id,
          sigla_banca: bancaData.sigla
        }
      ])
      .select()
      .single()

    if (concursoError) {
      console.error('Erro no POST:', concursoError)
      return NextResponse.json({ error: concursoError.message }, { status: 500 })
    }

    // Buscar os dados da banca para retornar
    const { data: bancaCompleta, error: bancaCompletaError } = await supabase
      .from('banca_examinadora')
      .select('id, nome, sigla')
      .eq('id', body.banca_id)
      .single()

    if (bancaCompletaError) {
      console.error('Erro ao buscar banca completa:', bancaCompletaError)
      return NextResponse.json(concursoData)
    }

    return NextResponse.json({
      ...concursoData,
      banca_examinadora: bancaCompleta
    })
  } catch (error) {
    console.error('Erro geral no POST:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
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
    .from('concurso')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro no DELETE:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
} 