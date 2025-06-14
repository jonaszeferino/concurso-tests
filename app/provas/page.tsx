"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Building, Users, BookOpen } from "lucide-react"
import Link from "next/link"
import { getProvas } from "@/lib/database"

const orgaos = ["Todos", "INSS", "Banco do Brasil", "Tribunal de Justiça do RS"]
const bancas = ["Todas", "CESPE/Cebraspe", "FGV", "Fundatec"]
const anos = ["Todos", "2023", "2022", "2021", "2020"]

export default function ProvasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedOrgao, setSelectedOrgao] = useState("Todos")
  const [selectedBanca, setSelectedBanca] = useState("Todas")
  const [selectedAno, setSelectedAno] = useState("Todos")
  const [provas, setProvas] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadProvas() {
      try {
        const data = await getProvas()
        if (data) {
          // Assuming getProvas returns an array of objects with prova and disciplinas
          setProvas(data)
        } else {
          console.error("Erro: getProvas retornou null ou undefined")
        }
      } catch (error) {
        console.error("Erro ao carregar provas:", error)
      } finally {
        setLoading(false)
      }
    }
    loadProvas()
  }, [])

  const filteredProvas = provas.filter((prova) => {
    const matchesSearch =
      prova.prova.concurso.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prova.prova.cargo.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrgao = selectedOrgao === "Todos" || prova.prova.orgao === selectedOrgao
    const matchesBanca = selectedBanca === "Todas" || prova.prova.banca === selectedBanca
    const matchesAno = selectedAno === "Todos" || prova.prova.ano.toString() === selectedAno

    return matchesSearch && matchesOrgao && matchesBanca && matchesAno
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Provas Disponíveis</h1>
        <p className="text-gray-600">Escolha uma prova para começar a estudar</p>
      </div>

      {/* Filtros */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Filtros de Busca
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                placeholder="Digite o nome do concurso ou cargo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <Label>Órgão</Label>
              <Select value={selectedOrgao} onValueChange={setSelectedOrgao}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {orgaos.map((orgao) => (
                    <SelectItem key={orgao} value={orgao}>
                      {orgao}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Banca</Label>
              <Select value={selectedBanca} onValueChange={setSelectedBanca}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {bancas.map((banca) => (
                    <SelectItem key={banca} value={banca}>
                      {banca}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Ano</Label>
              <Select value={selectedAno} onValueChange={setSelectedAno}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {anos.map((ano) => (
                    <SelectItem key={ano} value={ano}>
                      {ano}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Provas */}
      {loading ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Carregando provas...</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {filteredProvas.map((prova) => (
            <Card key={prova.prova.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl">{prova.prova.concurso}</CardTitle>
                    <CardDescription className="text-lg font-medium text-gray-700">{prova.prova.cargo}</CardDescription>
                  </div>
                  <Badge variant="secondary">{prova.prova.ano}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{prova.prova.orgao}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{prova.prova.banca}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{prova.prova.questoes} questões</span>
                  </div>
                </div>

                <div className="mb-4">
                  <Label className="text-sm font-medium">Disciplinas:</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {prova.disciplinas.map((disciplina) => (
                      <Badge key={disciplina.id} variant="outline">
                        {disciplina.nome}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button asChild>
                    <Link href={`/provas/${prova.prova.id}`}>Iniciar Prova</Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href={`/provas/${prova.prova.id}/detalhes`}>Ver Detalhes</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {filteredProvas.length === 0 && !loading && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">Nenhuma prova encontrada com os filtros selecionados.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
