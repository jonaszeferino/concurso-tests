"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Prova {
  id: number
  titulo: string
  data_prova: string
  descricao: string
  nivel_dificuldade: string
  tempo_limite: number
  numero_questoes: number
  concurso: {
    titulo: string
  }
  disciplina: {
    nome: string
  }
}

interface Questao {
  id: number
  numero: number
  enunciado: string
  alternativas: string[]
  prova: {
    id: number
    titulo: string
    concurso: {
      titulo: string
    }
    disciplina: {
      nome: string
    }
  }
}

export default function QuestoesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [provas, setProvas] = useState<Prova[]>([])
  const [filtros, setFiltros] = useState({
    prova_id: "todas",
    disciplina_id: "",
    busca: ""
  })
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState<number[]>([])

  useEffect(() => {
    fetchProvas()
    fetchQuestoes()
  }, [])

  const fetchProvas = async () => {
    try {
      const response = await fetch('/api/v1/provas')
      if (!response.ok) throw new Error('Erro ao carregar provas')
      const data = await response.json()
      setProvas(data)
    } catch (error) {
      console.error('Erro ao carregar provas:', error)
      toast.error('Erro ao carregar provas')
    }
  }

  const fetchQuestoes = async () => {
    try {
      setLoading(true)
      let url = '/api/v1/questoes'
      const params = new URLSearchParams()
      
      if (filtros.prova_id && filtros.prova_id !== 'todas') params.append('prova_id', filtros.prova_id)
      if (filtros.disciplina_id) params.append('disciplina_id', filtros.disciplina_id)
      if (filtros.busca) params.append('busca', filtros.busca)
      
      if (params.toString()) {
        url += `?${params.toString()}`
      }

      const response = await fetch(url)
      if (!response.ok) throw new Error('Erro ao carregar questões')
      const data = await response.json()
      setQuestoes(data)
    } catch (error) {
      console.error('Erro ao carregar questões:', error)
      toast.error('Erro ao carregar questões')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
  }

  const handleBusca = () => {
    fetchQuestoes()
  }

  const toggleQuestaoSelecionada = (questaoId: number) => {
    setQuestoesSelecionadas(prev => {
      if (prev.includes(questaoId)) {
        return prev.filter(id => id !== questaoId)
      }
      return [...prev, questaoId]
    })
  }

  const handleIniciarProva = () => {
    if (questoesSelecionadas.length === 0) {
      toast.error('Selecione pelo menos uma questão')
      return
    }
    router.push(`/questoes/resolver?ids=${questoesSelecionadas.join(',')}`)
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Questões Disponíveis</h1>

      {/* Filtros */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="prova">Prova</Label>
              <Select
                value={filtros.prova_id}
                onValueChange={(value) => handleFiltroChange('prova_id', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma prova" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as provas</SelectItem>
                  {provas.map((prova) => (
                    <SelectItem key={prova.id} value={prova.id.toString()}>
                      {prova.titulo} - {prova.concurso.titulo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="busca">Buscar</Label>
              <Input
                id="busca"
                placeholder="Buscar por enunciado..."
                value={filtros.busca}
                onChange={(e) => handleFiltroChange('busca', e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleBusca} className="w-full">
                Buscar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Questões */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {questoes.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhuma questão encontrada
            </div>
          ) : (
            questoes.map((questao) => (
              <Card
                key={questao.id}
                className={`cursor-pointer transition-colors ${
                  questoesSelecionadas.includes(questao.id)
                    ? 'border-primary bg-primary/5'
                    : ''
                }`}
                onClick={() => toggleQuestaoSelecionada(questao.id)}
              >
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold mb-2">
                        Questão {questao.numero} - {questao.prova.titulo}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {questao.prova.concurso.titulo} - {questao.prova.disciplina.nome}
                      </p>
                      <p className="text-sm">{questao.enunciado}</p>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={questoesSelecionadas.includes(questao.id)}
                        onChange={() => toggleQuestaoSelecionada(questao.id)}
                        className="h-5 w-5"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Botão de Iniciar */}
      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleIniciarProva}
          disabled={questoesSelecionadas.length === 0}
          size="lg"
        >
          Iniciar Prova ({questoesSelecionadas.length} questões selecionadas)
        </Button>
      </div>
    </div>
  )
} 