"use client"

import type React from "react"

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
import {
  getQuestoes,
  createQuestao,
  updateQuestao,
  deleteQuestao,
  getDisciplinas,
  getProvas,
  getBancas,
} from "@/lib/database"

export default function QuestoesAdminPage() {
  const [questoes, setQuestoes] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingQuestao, setEditingQuestao] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    numero: "",
    disciplina: "",
    prova: "",
    enunciado: "",
    alternativas: ["", "", "", "", ""],
    respostaCorreta: 0,
    comentario: "",
  })

  const [disciplinas, setDisciplinas] = useState([])
  const [provas, setProvas] = useState([])
  const [bancas, setBancas] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const questoesData = await getQuestoes()
        setQuestoes(questoesData)

        const disciplinasData = await getDisciplinas()
        setDisciplinas(disciplinasData)

        const provasData = await getProvas()
        setProvas(provasData)

        const bancasData = await getBancas()
        setBancas(bancasData)

        setError(null)
      } catch (e: any) {
        setError(e.message)
        console.error("Failed to fetch data", e)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (editingQuestao) {
        // Editar questão existente
        await updateQuestao(editingQuestao.id, { ...formData, status: "Ativa" })
        setQuestoes((prev) =>
          prev.map((q) =>
            q.id === editingQuestao.id ? { ...q, ...formData, id: editingQuestao.id, status: "Ativa" } : q,
          ),
        )
      } else {
        // Adicionar nova questão
        const newQuestao = await createQuestao({ ...formData, status: "Ativa" })
        setQuestoes((prev) => [...prev, newQuestao])
      }

      // Reset form
      setFormData({
        numero: "",
        disciplina: "",
        prova: "",
        enunciado: "",
        alternativas: ["", "", "", "", ""],
        respostaCorreta: 0,
        comentario: "",
      })
      setEditingQuestao(null)
      setIsDialogOpen(false)
      setError(null)
    } catch (e: any) {
      setError(e.message)
      console.error("Failed to save data", e)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (questao: any) => {
    setEditingQuestao(questao)
    setFormData({
      numero: questao.numero.toString(),
      disciplina: questao.disciplina,
      prova: questao.prova,
      enunciado: questao.enunciado,
      alternativas: questao.alternativas,
      respostaCorreta: questao.respostaCorreta,
      comentario: questao.comentario || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    setLoading(true)
    try {
      await deleteQuestao(id)
      setQuestoes((prev) => prev.filter((q) => q.id !== id))
      setError(null)
    } catch (e: any) {
      setError(e.message)
      console.error("Failed to delete data", e)
    } finally {
      setLoading(false)
    }
  }

  const filteredQuestoes = questoes.filter(
    (questao: any) =>
      questao.enunciado?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questao.disciplina?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      questao.prova?.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8">Error: {error}</div>
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
                  disciplina: "",
                  prova: "",
                  enunciado: "",
                  alternativas: ["", "", "", "", ""],
                  respostaCorreta: 0,
                  comentario: "",
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
                  <Label htmlFor="disciplina">Disciplina</Label>
                  <Select
                    value={formData.disciplina}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, disciplina: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {disciplinas.map((disciplina: any) => (
                        <SelectItem key={disciplina.id} value={disciplina.nome}>
                          {disciplina.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="prova">Prova</Label>
                  <Select
                    value={formData.prova}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, prova: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a prova" />
                    </SelectTrigger>
                    <SelectContent>
                      {provas.map((prova: any) => (
                        <SelectItem key={prova.id} value={prova.nome}>
                          {prova.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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

              <div>
                <Label>Alternativas</Label>
                <div className="space-y-3">
                  {formData.alternativas.map((alt, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Label className="w-8">{String.fromCharCode(65 + index)})</Label>
                      <Input
                        value={alt}
                        onChange={(e) => {
                          const newAlternativas = [...formData.alternativas]
                          newAlternativas[index] = e.target.value
                          setFormData((prev) => ({ ...prev, alternativas: newAlternativas }))
                        }}
                        placeholder={`Alternativa ${String.fromCharCode(65 + index)}`}
                        required
                      />
                      <input
                        type="radio"
                        name="respostaCorreta"
                        checked={formData.respostaCorreta === index}
                        onChange={() => setFormData((prev) => ({ ...prev, respostaCorreta: index }))}
                        className="w-4 h-4"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">Marque o círculo da alternativa correta</p>
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
              {filteredQuestoes.map((questao: any) => (
                <TableRow key={questao.id}>
                  <TableCell>{questao.numero}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{questao.disciplina}</Badge>
                  </TableCell>
                  <TableCell>{questao.prova}</TableCell>
                  <TableCell className="max-w-md">
                    <p className="truncate">{questao.enunciado}</p>
                  </TableCell>
                  <TableCell>
                    <Badge variant={questao.status === "Ativa" ? "default" : "secondary"}>{questao.status}</Badge>
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
