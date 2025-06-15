import { NextResponse } from "next/server"
import { sql } from "@vercel/postgres"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id

    const { rows } = await sql`
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
      WHERE q.id = ${id}
    `

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "Questão não encontrada" },
        { status: 404 }
      )
    }

    const questao = rows[0]

    return NextResponse.json({
      id: questao.id,
      numero: questao.numero,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
      prova: {
        id: questao.prova_id,
        titulo: questao.prova_titulo,
        concurso: {
          titulo: questao.concurso_titulo
        },
        disciplina: {
          nome: questao.disciplina_nome
        }
      }
    })
  } catch (error) {
    console.error('Erro ao buscar questão:', error)
    return NextResponse.json(
      { error: "Erro ao buscar questão" },
      { status: 500 }
    )
  }
} 