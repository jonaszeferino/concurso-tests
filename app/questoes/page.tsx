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
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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

interface QuestoesResponse {
  questoes: Questao[]
  total: number
  pagina: number
  porPagina: number
  totalPaginas: number
}

interface Banca {
  id: number
  nome: string
}

export default function QuestoesPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [provas, setProvas] = useState<Prova[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])
  const [bancas, setBancas] = useState<Banca[]>([])
  const [selectedQuestoes, setSelectedQuestoes] = useState<number[]>([])
  const [filtros, setFiltros] = useState({
    prova_id: 'todas',
    disciplina_id: 'todas',
    banca_id: 'todas',
    busca: ''
  })
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [totalQuestoes, setTotalQuestoes] = useState(0)
  const [salvandoLista, setSalvandoLista] = useState(false)
  const [tituloLista, setTituloLista] = useState('')
  const [descricaoLista, setDescricaoLista] = useState('')
  const [dialogAberto, setDialogAberto] = useState(false)

  useEffect(() => {
    fetchProvas()
    fetchDisciplinas()
    fetchBancas()
  }, [])

  useEffect(() => {
    fetchQuestoes()
  }, [filtros, pagina])

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

  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('/api/v1/disciplinas')
      if (!response.ok) throw new Error('Erro ao carregar disciplinas')
      const data = await response.json()
      setDisciplinas(data)
    } catch (error) {
      console.error('Erro ao carregar disciplinas:', error)
      toast.error('Erro ao carregar disciplinas')
    }
  }

  const fetchBancas = async () => {
    try {
      const response = await fetch('/api/v1/bancas')
      if (!response.ok) throw new Error('Erro ao carregar bancas')
      const data = await response.json()
      setBancas(data)
    } catch (error) {
      console.error('Erro ao carregar bancas:', error)
      toast.error('Erro ao carregar bancas')
    }
  }

  const fetchQuestoes = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filtros.prova_id && filtros.prova_id !== 'todas') {
        params.append('prova_id', filtros.prova_id)
      }
      if (filtros.disciplina_id && filtros.disciplina_id !== 'todas') {
        params.append('disciplina_id', filtros.disciplina_id)
      }
      if (filtros.banca_id && filtros.banca_id !== 'todas') {
        params.append('banca_id', filtros.banca_id)
      }
      if (filtros.busca) {
        params.append('busca', filtros.busca)
      }
      params.append('pagina', pagina.toString())
      params.append('por_pagina', '20')

      const url = `/api/v1/questoes-client?${params.toString()}`
      console.log('Filtros atuais:', filtros)
      console.log('Buscando questões:', url)
      
      const response = await fetch(url)
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.details || 'Erro ao carregar questões')
      }
      
      const data: QuestoesResponse = await response.json()
      console.log('Dados recebidos:', data)
      
      setQuestoes(data.questoes)
      setTotalQuestoes(data.total)
      setTotalPaginas(data.totalPaginas)
    } catch (error) {
      console.error('Erro ao carregar questões:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao carregar questões')
    } finally {
      setLoading(false)
    }
  }

  const handleFiltroChange = (campo: string, valor: string) => {
    setFiltros(prev => ({ ...prev, [campo]: valor }))
    setPagina(1)
  }

  const handleBusca = () => {
    fetchQuestoes()
  }

  const toggleQuestaoSelecionada = (questaoId: number) => {
    setSelectedQuestoes(prev => {
      if (prev.includes(questaoId)) {
        return prev.filter(id => id !== questaoId)
      }
      return [...prev, questaoId]
    })
  }

  const handleResolverQuestao = (questaoId: number) => {
    router.push(`/questoes/resolver?ids=${questaoId}`)
  }

  const handleResolverQuestoes = () => {
    if (selectedQuestoes.length === 0) {
      toast.error('Selecione pelo menos uma questão')
      return
    }
    router.push(`/questoes/resolver?ids=${selectedQuestoes.join(',')}`)
  }

  const handleSalvarLista = async () => {
    if (!tituloLista.trim()) {
      toast.error('Por favor, insira um título para a lista')
      return
    }

    if (selectedQuestoes.length === 0) {
      toast.error('Selecione pelo menos uma questão')
      return
    }

    try {
      setSalvandoLista(true)
      const response = await fetch('/api/v1/listas-exercicios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: tituloLista,
          descricao: descricaoLista,
          questoes: selectedQuestoes
        }),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.details || 'Erro ao salvar lista')
      }

      toast.success('Lista salva com sucesso!')
      setDialogAberto(false)
      setTituloLista('')
      setDescricaoLista('')
      setSelectedQuestoes([])
    } catch (error) {
      console.error('Erro ao salvar lista:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar lista')
    } finally {
      setSalvandoLista(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Questões</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/listas')}
          >
            Minhas Listas Salvas
          </Button>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                disabled={selectedQuestoes.length === 0}
              >
                Salvar Lista ({selectedQuestoes.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Salvar Lista de Exercícios</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="titulo">Título</Label>
                  <Input
                    id="titulo"
                    value={tituloLista}
                    onChange={(e) => setTituloLista(e.target.value)}
                    placeholder="Digite o título da lista"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição (opcional)</Label>
                  <Input
                    id="descricao"
                    value={descricaoLista}
                    onChange={(e) => setDescricaoLista(e.target.value)}
                    placeholder="Digite uma descrição para a lista"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {selectedQuestoes.length} questões selecionadas
                </div>
                <Button
                  onClick={handleSalvarLista}
                  disabled={salvandoLista || !tituloLista.trim()}
                  className="w-full"
                >
                  {salvandoLista ? 'Salvando...' : 'Salvar Lista'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Select
          value={filtros.prova_id}
          onValueChange={(value) => handleFiltroChange('prova_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a prova" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as provas</SelectItem>
            {provas.map(prova => (
              <SelectItem key={prova.id} value={prova.id.toString()}>
                {prova.titulo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.disciplina_id}
          onValueChange={(value) => handleFiltroChange('disciplina_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a disciplina" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as disciplinas</SelectItem>
            {disciplinas.map(disciplina => (
              <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                {disciplina.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filtros.banca_id}
          onValueChange={(value) => handleFiltroChange('banca_id', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a banca" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as bancas</SelectItem>
            {bancas.map(banca => (
              <SelectItem key={banca.id} value={banca.id.toString()}>
                {banca.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Input
            placeholder="Buscar por texto, disciplina ou cargo..."
            value={filtros.busca}
            onChange={(e) => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
          />
          <Button onClick={handleBusca}>Buscar</Button>
        </div>
      </div>

      {/* Lista de Questões */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {questoes.map(questao => (
              <Card key={questao.id} className="p-4">
                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedQuestoes.includes(questao.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedQuestoes(prev => [...prev, questao.id])
                      } else {
                        setSelectedQuestoes(prev => prev.filter(id => id !== questao.id))
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold">Questão {questao.numero}</h3>
                        <p className="text-sm text-gray-500">
                          {questao.prova.concurso.titulo} - {questao.prova.disciplina.nome}
                          {questao.prova.concurso.banca && ` - ${questao.prova.concurso.banca}`}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleResolverQuestao(questao.id)}
                      >
                        Resolver
                      </Button>
                    </div>
                    <p className="text-gray-700">{questao.enunciado}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Paginação */}
          {totalPaginas > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <Button
                variant="outline"
                onClick={() => setPagina(prev => Math.max(1, prev - 1))}
                disabled={pagina === 1}
              >
                Anterior
              </Button>
              <span className="text-sm">
                Página {pagina} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                onClick={() => setPagina(prev => Math.min(totalPaginas, prev + 1))}
                disabled={pagina === totalPaginas}
              >
                Próxima
              </Button>
            </div>
          )}

          {/* Total de questões */}
          <div className="text-center text-sm text-gray-500 mt-4">
            Total de questões: {totalQuestoes}
          </div>
        </>
      )}
    </div>
  )
} 