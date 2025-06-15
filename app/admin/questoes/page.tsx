"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

interface Questao {
  id: number
  numero: number
  prova_id: number
  disciplina_id: number
  enunciado: string
  alternativas: string[]
  resposta_correta: number
  comentario?: string
  status: string
  prova: {
    id: number
    titulo: string
    codigo_interno: string
    concurso: {
      id: number
      orgao: string
      ano: number
    }
  }
  disciplina: {
    id: number
    nome: string
    area_de_conhecimento: string
  }
}

interface Prova {
  id: number
  titulo: string
  codigo_interno: string
  data_prova: string
  descricao: string
  nivel_dificuldade: string
  tempo_limite: number
  numero_questoes: number
  updated_at: string
  concurso: {
    id: number
    orgao: string
    ano: number
  }
  disciplina: {
    id: number
    nome: string
  }
  cargo: {
    id: number
    nome_do_cargo: string
    nivel: string
  }
}

interface Disciplina {
  id: number
  nome: string
  area_de_conhecimento: string
}

export default function QuestoesAdminPage() {
  const [questoes, setQuestoes] = useState<Questao[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestao, setEditingQuestao] = useState<Questao | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [provas, setProvas] = useState<Prova[]>([])
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([])

  const [formData, setFormData] = useState({
    numero: "",
    prova_id: "",
    disciplina_id: "",
    enunciado: "",
    alternativas: ["", "", "", "", ""],
    resposta_correta: 0,
    comentario: "",
    status: "ativa"
  })

  useEffect(() => {
    fetchQuestoes()
    fetchProvas()
    fetchDisciplinas()
  }, [])

  const fetchQuestoes = async () => {
    try {
      const response = await fetch('/api/v1/questoes')
      if (!response.ok) throw new Error('Erro ao carregar questões')
      const data = await response.json()
      setQuestoes(data)
    } catch (error) {
      toast.error("Erro ao carregar questões")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const fetchProvas = async () => {
    try {
      const response = await fetch('/api/v1/provas')
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro ao carregar provas')
      }
      const data = await response.json()
      console.log('Provas carregadas:', data)
      if (!data || data.length === 0) {
        console.warn('Nenhuma prova encontrada')
      }
      setProvas(data)
    } catch (error) {
      toast.error("Erro ao carregar provas")
      console.error('Erro ao carregar provas:', error)
    }
  }

  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('/api/v1/disciplinas')
      if (!response.ok) throw new Error('Erro ao carregar disciplinas')
      const data = await response.json()
      console.log('Disciplinas carregadas:', data)
      setDisciplinas(data)
    } catch (error) {
      toast.error("Erro ao carregar disciplinas")
      console.error('Erro ao carregar disciplinas:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      console.log('FormData antes do envio:', formData)

      // Validar campos obrigatórios
      if (!formData.prova_id || !formData.disciplina_id || !formData.enunciado) {
        toast.error("Preencha todos os campos obrigatórios")
        return
      }

      // Validar alternativas (mínimo 2 preenchidas)
      const alternativasPreenchidas = formData.alternativas.filter(alt => alt.trim() !== "")
      if (alternativasPreenchidas.length < 2) {
        toast.error("Adicione pelo menos 2 alternativas")
        return
      }

      // Validar resposta correta
      if (formData.resposta_correta === undefined || formData.resposta_correta === null) {
        toast.error("Selecione uma resposta correta")
        return
      }

      // Preparar dados para envio
      const dadosParaEnvio = {
        ...formData,
        prova_id: parseInt(formData.prova_id),
        disciplina_id: parseInt(formData.disciplina_id),
        numero: parseInt(formData.numero) || 0,
        alternativas: alternativasPreenchidas,
        resposta_correta: Number(formData.resposta_correta)
      }

      console.log('Dados para envio:', dadosParaEnvio)

      const response = await fetch('/api/v1/questoes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dadosParaEnvio),
      })

      const responseData = await response.json()
      console.log('Resposta da API:', responseData)

      if (!response.ok) {
        throw new Error(responseData.error || 'Erro ao salvar questão')
      }

      toast.success("Questão salva com sucesso!")
      setFormData({
        numero: "",
        prova_id: "",
        disciplina_id: "",
        enunciado: "",
        alternativas: ["", "", "", "", ""],
        resposta_correta: 0,
        comentario: "",
        status: "ativa"
      })
      setIsDialogOpen(false)
      fetchQuestoes()
    } catch (error) {
      console.error('Erro ao salvar questão:', error)
      toast.error(error instanceof Error ? error.message : "Erro ao salvar questão")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta questão?")) return

    try {
      const response = await fetch(`/api/v1/questoes?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Erro ao excluir questão')

      toast.success("Questão excluída com sucesso!")
      fetchQuestoes()
    } catch (error) {
      toast.error("Erro ao excluir questão")
      console.error(error)
    }
  }

  const filteredQuestoes = questoes.filter(
    (questao) =>
      questao.enunciado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questao.disciplina?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questao.prova?.titulo?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Carregando...</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Gerenciar Questões</h1>
          <p className="text-gray-600">Cadastre e edite questões do banco de dados</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingQuestao(null)
                setFormData({
                  numero: "",
                  prova_id: "",
                  disciplina_id: "",
                  enunciado: "",
                  alternativas: ["", "", "", "", ""],
                  resposta_correta: 0,
                  comentario: "",
                  status: "ativa"
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nova Questão
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingQuestao ? "Editar Questão" : "Nova Questão"}</DialogTitle>
              <DialogDescription>Preencha os dados da questão abaixo</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="numero">Número</Label>
                  <Input
                    id="numero"
                    type="number"
                    value={formData.numero}
                    onChange={(e) => setFormData((prev) => ({ ...prev, numero: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prova_id">Prova</Label>
                  <Select
                    value={formData.prova_id}
                    onValueChange={(value) => {
                      console.log('Prova selecionada:', value)
                      setFormData((prev) => ({ ...prev, prova_id: value }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prova" />
                    </SelectTrigger>
                    <SelectContent>
                      {provas && provas.length > 0 ? (
                        provas.map((prova) => (
                          <SelectItem 
                            key={prova.id} 
                            value={prova.id.toString()}
                          >
                            {prova.titulo} - {prova.concurso?.orgao} {prova.concurso?.ano} ({prova.disciplina?.nome})
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="0" disabled>
                          Nenhuma prova disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {provas.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Nenhuma prova cadastrada. Cadastre uma prova primeiro.
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="disciplina_id">Disciplina</Label>
                  <Select
                    value={formData.disciplina_id}
                    onValueChange={(value) => {
                      console.log('Disciplina selecionada:', value)
                      setFormData((prev) => ({ ...prev, disciplina_id: value }))
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas && disciplinas.length > 0 ? (
                        disciplinas.map((disciplina) => (
                          <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                            {disciplina.nome}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="" disabled>
                          Nenhuma disciplina disponível
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {disciplinas.length === 0 && (
                    <p className="text-sm text-red-500 mt-1">
                      Nenhuma disciplina cadastrada. Cadastre uma disciplina primeiro.
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="enunciado">Enunciado</Label>
                <Textarea
                  id="enunciado"
                  value={formData.enunciado}
                  onChange={(e) => setFormData((prev) => ({ ...prev, enunciado: e.target.value }))}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-4">
                <Label>Alternativas</Label>
                {formData.alternativas.map((alternativa, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={alternativa}
                      onChange={(e) => {
                        const novasAlternativas = [...formData.alternativas]
                        novasAlternativas[index] = e.target.value
                        setFormData({ ...formData, alternativas: novasAlternativas })
                      }}
                      placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const novasAlternativas = formData.alternativas.filter((_, i) => i !== index)
                        setFormData({ ...formData, alternativas: novasAlternativas })
                      }}
                      disabled={formData.alternativas.length <= 2}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {formData.alternativas.length < 5 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        alternativas: [...formData.alternativas, ""]
                      })
                    }}
                  >
                    Adicionar Alternativa
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <Label>Resposta Correta</Label>
                <Select
                  value={formData.resposta_correta?.toString() || "0"}
                  onValueChange={(value) => {
                    console.log('Valor selecionado:', value)
                    const respostaCorreta = parseInt(value)
                    console.log('Valor convertido:', respostaCorreta)
                    setFormData(prev => {
                      const newData = { ...prev, resposta_correta: respostaCorreta }
                      console.log('Novo formData:', newData)
                      return newData
                    })
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a resposta correta" />
                  </SelectTrigger>
                  <SelectContent>
                    {formData.alternativas.map((alt, index) => (
                      alt.trim() !== "" && (
                        <SelectItem key={index} value={index.toString()}>
                          {String.fromCharCode(65 + index)}
                        </SelectItem>
                      )
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="comentario">Comentário/Resolução (opcional)</Label>
                <Textarea
                  id="comentario"
                  value={formData.comentario}
                  onChange={(e) => setFormData((prev) => ({ ...prev, comentario: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">{editingQuestao ? "Salvar Alterações" : "Cadastrar Questão"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtro de busca */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar questões por enunciado, disciplina ou prova..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de questões */}
      <Card>
        <CardHeader>
          <CardTitle>Questões Cadastradas ({filteredQuestoes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nº</TableHead>
                <TableHead>Disciplina</TableHead>
                <TableHead>Prova</TableHead>
                <TableHead>Enunciado</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredQuestoes.map((questao) => (
                <TableRow key={questao.id}>
                  <TableCell>{questao.numero}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{questao.disciplina.nome}</Badge>
                  </TableCell>
                  <TableCell>
                    {questao.prova.titulo} - {questao.prova.concurso.orgao} {questao.prova.concurso.ano}
                  </TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{questao.enunciado}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={questao.status === "ativa" ? "default" : "secondary"}>
                      {questao.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(questao)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleDelete(questao.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
