import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    
    const { data, error } = await supabase
      .from('banca_examinadora')
      .select('id, nome')
      .order('nome')

    if (error) {
      console.error('Erro ao buscar bancas:', error)
      return NextResponse.json(
        { error: "Erro ao buscar bancas", details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro ao buscar bancas:', error)
    return NextResponse.json(
      { error: "Erro ao buscar bancas", details: error instanceof Error ? error.message : 'Erro desconhecido' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    console.log('Dados recebidos na API:', body)

    const { data, error } = await supabase
      .from('banca_examinadora')
      .insert([
        {
          nome: body.nome,
          sigla: body.sigla,
          site_oficial: body.site_oficial,
          estilo_de_prova: body.estilo_de_prova
        }
      ])
      .select()

    if (error) {
      console.error('Erro no POST:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data[0])
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
    .from('banca_examinadora')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro no DELETE:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
} 