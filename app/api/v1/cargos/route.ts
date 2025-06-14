import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies })
  
  const { data, error } = await supabase
    .from('cargo')
    .select('*')
    .order('nome_do_cargo', { ascending: true })

  if (error) {
    console.error('Erro no GET:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const body = await request.json()
    
    console.log('Dados recebidos na API:', body)

    const { data, error } = await supabase
      .from('cargo')
      .insert([
        {
          nome_do_cargo: body.nome_do_cargo,
          nivel: body.nivel,
          salario: body.salario,
          requisitos: body.requisitos,
          lotacao_prevista: body.lotacao_prevista
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
    .from('cargo')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Erro no DELETE:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
} 