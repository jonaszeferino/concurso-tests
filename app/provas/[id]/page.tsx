"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, CheckCircle } from "lucide-react"
import { getProvaById, getQuestoesByProva } from "@/lib/database"
import Link from "next/link"

// Mock data - substituir por dados do Supabase
// const mockQuestoes = [
//   {
//     id: 1,
//     numero: 1,
//     disciplina: "Português",
//     enunciado: "Assinale a alternativa que apresenta concordância verbal correta:",
//     alternativas: [
//       "Fazem dois anos que ele partiu.",
//       "Faz dois anos que ele partiu.",
//       "Fazem dois anos desde que ele partiu.",
//       "Faz dois anos desde que ele partiu.",
//       "Fazem dois anos quando ele partiu.",
//     ],
//     respostaCorreta: 1,
//     comentario:
//       "O verbo 'fazer' no sentido de tempo decorrido é impessoal, portanto fica sempre na 3ª pessoa do singular.",
//   },
//   {
//     id: 2,
//     numero: 2,
//     disciplina: "Matemática",
//     enunciado: "Se x + y = 10 e x - y = 4, qual o valor de x?",
//     alternativas: ["3", "5", "7", "9", "11"],
//     respostaCorreta: 2,
//     comentario: "Somando as duas equações: 2x = 14, logo x = 7.",
//   },
// ]

export default function ProvaPage() {
  const params = useParams()
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<{ [key: number]: number }>({})
  const [mostrarResultado, setMostrarResultado] = useState(false)
  const [tempoRestante, setTempoRestante] = useState(7200) // 2 horas em segundos
  const [questoes, setQuestoes] = useState<any[]>([])
  const [prova, setProva] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        if (params.id) {
          const provaData = await getProvaById(Number(params.id))
          setProva(provaData)
          const questoesData = await getQuestoesByProva(Number(params.id))
          setQuestoes(questoesData)
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
        // Fallback para dados mock em desenvolvimento
        setQuestoes([])
        setProva(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [params.id])

  if (isLoading) {
    return <div>Carregando...</div>
  }

  if (!questoes || questoes.length === 0 || !prova) {
    return <div>Prova não encontrada.</div>
  }

  const questao = questoes[questaoAtual]
  const totalQuestoes = questoes.length
  const progresso = ((questaoAtual + 1) / totalQuestoes) * 100

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`
  }

  const selecionarResposta = (alternativa: number) => {
    setRespostas((prev) => ({
      ...prev,
      [questao.id]: alternativa,
    }))
  }

  const proximaQuestao = () => {
    if (questaoAtual < totalQuestoes - 1) {
      setQuestaoAtual(questaoAtual + 1)
    }
  }

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(questaoAtual - 1)
    }
  }

  const finalizarProva = () => {
    setMostrarResultado(true)
  }

  const calcularPontuacao = () => {
    let acertos = 0
    questoes.forEach((q) => {
      if (respostas[q.id] === q.resposta_correta) {
        acertos++
      }
    })
    return acertos
  }

  if (mostrarResultado) {
    const acertos = calcularPontuacao()
    const percentual = (acertos / totalQuestoes) * 100

    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Resultado da Prova</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl font-bold text-blue-600">{percentual.toFixed(1)}%</div>
            <div className="text-xl">
              Você acertou <span className="font-bold text-green-600">{acertos}</span> de{" "}
              <span className="font-bold">{totalQuestoes}</span> questões
            </div>
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{acertos}</div>
                <div className="text-sm text-green-700">Acertos</div>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{totalQuestoes - acertos}</div>
                <div className="text-sm text-red-700">Erros</div>
              </div>
            </div>
            <div className="flex gap-2 justify-center">
              <Button onClick={() => (window.location.href = "/provas")}>Voltar às Provas</Button>
              <Button variant="outline" asChild>
                <Link href={`/provas/${params.id}/resolucao`}>Ver Resolução Comentada</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header da Prova */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Prova - {prova.name}</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">{formatarTempo(tempoRestante)}</span>
            </div>
            <Badge variant="outline">
              Questão {questaoAtual + 1} de {totalQuestoes}
            </Badge>
          </div>
        </div>
        <Progress value={progresso} className="h-2" />
      </div>

      {/* Questão */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">Questão {questao.numero}</CardTitle>
            <Badge>{questao.disciplinas?.nome}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-lg mb-6 leading-relaxed">{questao.question}</p>

          <RadioGroup
            value={respostas[questao.id]?.toString()}
            onValueChange={(value) => selecionarResposta(Number.parseInt(value))}
          >
            {questao.alternativas.map((alternativa: string, index: number) => (
              <div key={index} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                <RadioGroupItem value={index.toString()} id={`alt-${index}`} className="mt-1" />
                <Label htmlFor={`alt-${index}`} className="flex-1 cursor-pointer leading-relaxed">
                  <span className="font-medium mr-2">{String.fromCharCode(65 + index)})</span>
                  {alternativa}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navegação */}
      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={questaoAnterior} disabled={questaoAtual === 0}>
          Anterior
        </Button>

        <div className="flex gap-2">
          {questaoAtual === totalQuestoes - 1 ? (
            <Button onClick={finalizarProva} className="bg-green-600 hover:bg-green-700">
              Finalizar Prova
            </Button>
          ) : (
            <Button onClick={proximaQuestao}>Próxima</Button>
          )}
        </div>
      </div>

      {/* Mapa de Questões */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Mapa de Questões</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-10 gap-2">
            {questoes.map((q, index) => (
              <Button
                key={q.id}
                variant={index === questaoAtual ? "default" : "outline"}
                size="sm"
                className={`w-10 h-10 ${respostas[q.id] !== undefined ? "bg-green-100 border-green-300" : ""}`}
                onClick={() => setQuestaoAtual(index)}
              >
                {index + 1}
                {respostas[q.id] !== undefined && (
                  <CheckCircle className="h-3 w-3 absolute -top-1 -right-1 text-green-600" />
                )}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
              <span>Não respondida</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded"></div>
              <span>Respondida</span>
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
