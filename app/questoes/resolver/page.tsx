"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Loader2, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

interface Questao {
  id: number
  numero: number
  enunciado: string
  alternativas: string[]
  prova: {
    titulo: string
    concurso: {
      titulo: string
    }
    disciplina: {
      nome: string
    }
  }
}

interface Resposta {
  questao_id: number
  alternativa: number
}

export default function ResolverQuestoesPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [questaoAtual, setQuestaoAtual] = useState(0)
  const [respostas, setRespostas] = useState<Resposta[]>([])
  const [tempoRestante, setTempoRestante] = useState(3600) // 1 hora em segundos
  const [provaFinalizada, setProvaFinalizada] = useState(false)
  const [resultado, setResultado] = useState<{
    acertos: number
    total: number
    percentual: number
  } | null>(null)

  useEffect(() => {
    const ids = searchParams.get('ids')?.split(',')
    if (!ids?.length) {
      router.push('/questoes')
      return
    }
    fetchQuestoes(ids)
  }, [searchParams])

  useEffect(() => {
    if (tempoRestante > 0 && !provaFinalizada) {
      const timer = setInterval(() => {
        setTempoRestante(prev => prev - 1)
      }, 1000)
      return () => clearInterval(timer)
    } else if (tempoRestante === 0 && !provaFinalizada) {
      finalizarProva()
    }
  }, [tempoRestante, provaFinalizada])

  const fetchQuestoes = async (ids: string[]) => {
    try {
      setLoading(true)
      const questoesData = await Promise.all(
        ids.map(id => fetch(`/api/v1/questoes/${id}`).then(res => res.json()))
      )
      setQuestoes(questoesData)
    } catch (error) {
      console.error('Erro ao carregar questões:', error)
      toast.error('Erro ao carregar questões')
    } finally {
      setLoading(false)
    }
  }

  const handleResposta = (alternativa: number) => {
    setRespostas(prev => {
      const novasRespostas = prev.filter(r => r.questao_id !== questoes[questaoAtual].id)
      return [...novasRespostas, { questao_id: questoes[questaoAtual].id, alternativa }]
    })
  }

  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual(prev => prev + 1)
    }
  }

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual(prev => prev - 1)
    }
  }

  const finalizarProva = async () => {
    if (provaFinalizada) return

    try {
      const response = await fetch('/api/v1/questoes/verificar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ respostas }),
      })

      if (!response.ok) throw new Error('Erro ao verificar respostas')

      const data = await response.json()
      setResultado(data)
      setProvaFinalizada(true)
    } catch (error) {
      console.error('Erro ao finalizar prova:', error)
      toast.error('Erro ao finalizar prova')
    }
  }

  const formatarTempo = (segundos: number) => {
    const horas = Math.floor(segundos / 3600)
    const minutos = Math.floor((segundos % 3600) / 60)
    const segs = segundos % 60
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}:${segs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (provaFinalizada && resultado) {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Resultado da Prova</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl font-bold text-primary">
                {resultado.acertos}/{resultado.total}
              </h2>
              <p className="text-2xl font-semibold">
                {resultado.percentual}% de acerto
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Progresso</span>
                <span>{resultado.percentual}%</span>
              </div>
              <Progress value={resultado.percentual} className="h-2" />
            </div>

            <div className="flex justify-center">
              <Button onClick={() => router.push('/questoes')}>
                Voltar para Questões
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const questao = questoes[questaoAtual]
  const respostaAtual = respostas.find(r => r.questao_id === questao.id)

  return (
    <div className="container mx-auto py-8">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">{questao.prova.titulo}</h1>
          <p className="text-muted-foreground">
            {questao.prova.concurso.titulo} - {questao.prova.disciplina.nome}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-primary">
            {formatarTempo(tempoRestante)}
          </div>
          <div className="text-sm text-muted-foreground">Tempo Restante</div>
        </div>
      </div>

      {/* Progresso */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span>Progresso</span>
          <span>
            {questaoAtual + 1} de {questoes.length}
          </span>
        </div>
        <Progress
          value={((questaoAtual + 1) / questoes.length) * 100}
          className="h-2"
        />
      </div>

      {/* Questão */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">
                Questão {questao.numero}
              </h2>
              <p className="text-lg">{questao.enunciado}</p>
            </div>

            <RadioGroup
              value={respostaAtual?.alternativa.toString()}
              onValueChange={(value) => handleResposta(parseInt(value))}
              className="space-y-4"
            >
              {questao.alternativas.map((alternativa, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem
                    value={index.toString()}
                    id={`alternativa-${index}`}
                  />
                  <Label
                    htmlFor={`alternativa-${index}`}
                    className="flex-1 cursor-pointer"
                  >
                    {alternativa}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Navegação */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={questaoAnterior}
          disabled={questaoAtual === 0}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        {questaoAtual === questoes.length - 1 ? (
          <Button onClick={finalizarProva}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Finalizar Prova
          </Button>
        ) : (
          <Button onClick={proximaQuestao}>
            Próxima
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
} 