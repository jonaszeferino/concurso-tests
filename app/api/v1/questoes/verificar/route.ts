import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

interface Questao {
  id: number
  resposta_correta: number
}

interface Resposta {
  questao_id: number
  alternativa: number
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { respostas } = body as { respostas: Resposta[] }

    if (!respostas || !Array.isArray(respostas)) {
      return NextResponse.json(
        { error: "Respostas inválidas" },
        { status: 400 }
      )
    }

    // Buscar as questões e suas respostas corretas
    const questoesIds = respostas.map(r => r.questao_id)
    const { rows: questoes } = await sql`
      SELECT id, resposta_correta
      FROM questao
      WHERE id = ANY(${questoesIds})
    `

    // Calcular acertos
    let acertos = 0
    respostas.forEach((resposta) => {
      const questao = questoes.find((q: Questao) => q.id === resposta.questao_id)
      if (questao && questao.resposta_correta === resposta.alternativa) {
        acertos++
      }
    })

    const total = respostas.length
    const percentual = Math.round((acertos / total) * 100)

    return NextResponse.json({
      acertos,
      total,
      percentual
    })
  } catch (error) {
    console.error('Erro ao verificar respostas:', error)
    return NextResponse.json(
      { error: "Erro ao verificar respostas" },
      { status: 500 }
    )
  }
} 