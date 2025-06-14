"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CheckCircle, XCircle, BookOpen, ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { getQuestoesByProva, getProvaById } from "@/lib/database"

interface QuestaoResolucao {
  id: number
  numero: number
  enunciado: string
  alternativas: string[]
  resposta_correta: number
  comentario?: string
  disciplinas: { nome: string }
}

interface ProvaResolucao {
  id: number
  codigo_interno: string
  concursos: { orgao: string; ano: number }
  cargos: { nome: string }
}

export default function ResolucaoPage() {
  const params = useParams()
  const [questoes, setQuestoes] = useState<QuestaoResolucao[]>([])
  const [prova, setProva] = useState<ProvaResolucao | null>(null)
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostasUsuario, setRespostasUsuario] = useState<{ [key: number]: number }>({})
  const [mostrarGabarito, setMostrarGabarito] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const provaId = Number(params.id)
        const [provaData, questoesData] = await Promise.all([getProvaById(provaId), getQuestoesByProva(provaId)])

        setProva(provaData)
        setQuestoes(questoesData)
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [params.id])

  // Simular respostas do usuário (em um caso real, viria de uma prova realizada)
  useEffect(() => {
    if (questoes.length > 0) {
      const respostasSimuladas: { [key: number]: number } = {}
      questoes.forEach((questao, index) => {
        // Simula algumas respostas corretas e outras incorretas
        respostasSimuladas[questao.id] =
          index % 3 === 0 ? questao.resposta_correta : (questao.resposta_correta + 1) % questao.alternativas.length
      })
      setRespostasUsuario(respostasSimuladas)
    }
  }, [questoes])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Carregando resolução...</div>
      </div>
    )
  }

  if (!prova || questoes.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Prova não encontrada</div>
      </div>
    )
  }

  const questao = questoes[questaoAtual]
  const respostaUsuario = respostasUsuario[questao.id]
  const acertou = respostaUsuario === questao.resposta_correta
  const totalAcertos = Object.entries(respostasUsuario).filter(([questaoId, resposta]) => {
    const q = questoes.find((quest) => quest.id === Number(questaoId))
    return q && resposta === q.resposta_correta
  }).length

  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(questaoAtual + 1)
    }
  }

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold">Resolução Comentada</h1>
            <p className="text-gray-600">
              {prova.concursos.orgao} {prova.concursos.ano} - {prova.cargos.nome}
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600">Seu desempenho</div>
            <div className="text-2xl font-bold text-blue-600">
              {((totalAcertos / questoes.length) * 100).toFixed(1)}%
            </div>
            <div className="text-sm text-gray-600">
              {totalAcertos} de {questoes.length} questões
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Questão {questaoAtual + 1} de {questoes.length}
          </Badge>
          <Badge variant={acertou ? "default" : "destructive"}>{acertou ? "Acertou" : "Errou"}</Badge>
        </div>
      </div>

      {/* Questão */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Questão {questao.numero}</CardTitle>
            <Badge>{questao.disciplinas.nome}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6 leading-relaxed">{questao.enunciado}</p>

          <div className="space-y-3">
            {questao.alternativas.map((alternativa, index) => {
              const isCorreta = index === questao.resposta_correta
              const foiSelecionada = index === respostaUsuario

              let className = "flex items-start space-x-3 p-4 rounded-lg border-2 "

              if (mostrarGabarito) {
                if (isCorreta) {
                  className += "border-green-500 bg-green-50"
                } else if (foiSelecionada && !isCorreta) {
                  className += "border-red-500 bg-red-50"
                } else {
                  className += "border-gray-200 bg-gray-50"
                }
              } else {
                if (foiSelecionada) {
                  className += "border-blue-500 bg-blue-50"
                } else {
                  className += "border-gray-200"
                }
              }

              return (
                <div key={index} className={className}>
                  <div className="flex items-center gap-2">
                    {mostrarGabarito && isCorreta && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {mostrarGabarito && foiSelecionada && !isCorreta && <XCircle className="h-5 w-5 text-red-600" />}
                    <span className="font-medium text-lg">{String.fromCharCode(65 + index)})</span>
                  </div>
                  <div className="flex-1">
                    <p className="leading-relaxed">{alternativa}</p>
                    {mostrarGabarito && isCorreta && (
                      <Badge className="mt-2" variant="default">
                        Resposta Correta
                      </Badge>
                    )}
                    {mostrarGabarito && foiSelecionada && !isCorreta && (
                      <Badge className="mt-2" variant="destructive">
                        Sua Resposta
                      </Badge>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Botão para mostrar/ocultar gabarito */}
          <div className="mt-6">
            <Button onClick={() => setMostrarGabarito(!mostrarGabarito)} variant="outline" className="w-full">
              <BookOpen className="h-4 w-4 mr-2" />
              {mostrarGabarito ? "Ocultar Resolução" : "Ver Resolução"}
            </Button>
          </div>

          {/* Comentário/Resolução */}
          {mostrarGabarito && questao.comentario && (
            <>
              <Separator className="my-6" />
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Resolução Comentada
                </h4>
                <p className="text-gray-700 leading-relaxed">{questao.comentario}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navegação */}
      <div className="flex justify-between items-center mb-6">
        <Button variant="outline" onClick={questaoAnterior} disabled={questaoAtual === 0}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link href={`/provas/${params.id}`}>Voltar à Prova</Link>
          </Button>
        </div>

        <Button onClick={proximaQuestao} disabled={questaoAtual === questoes.length - 1}>
          Próxima
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      {/* Mapa de Questões */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mapa de Questões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2 mb-4">
            {questoes.map((q, index) => {
              const respostaUser = respostasUsuario[q.id]
              const acertouQuestao = respostaUser === q.resposta_correta

              return (
                <Button
                  key={q.id}
                  variant={index === questaoAtual ? "default" : "outline"}
                  size="sm"
                  className={`w-10 h-10 relative ${
                    acertouQuestao
                      ? "bg-green-100 border-green-300 hover:bg-green-200"
                      : "bg-red-100 border-red-300 hover:bg-red-200"
                  }`}
                  onClick={() => setQuestaoAtual(index)}
                >
                  {index + 1}
                  {acertouQuestao ? (
                    <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                  ) : (
                    <XCircle className="h-3 w-3 absolute -top-1 -right-1 text-red-600" />
                  )}
                </Button>
              )
            })}
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded flex items-center justify-center">
                <CheckCircle className="h-2 w-2 text-green-600" />
              </div>
              <span>Acertou ({totalAcertos})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded flex items-center justify-center">
                <XCircle className="h-2 w-2 text-red-600" />
              </div>
              <span>Errou ({questoes.length - totalAcertos})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span>Atual</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
