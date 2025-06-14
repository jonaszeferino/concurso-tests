"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, BookOpen, FileText, Users, Building, GraduationCap, ClipboardList } from "lucide-react"

export default function AdminPage() {
  const adminCards = [
    {
      title: "Concursos",
      description: "Gerenciar concursos públicos",
      icon: Building,
      href: "/admin/concursos",
      count: "25 concursos",
    },
    {
      title: "Bancas",
      description: "Cadastrar bancas examinadoras",
      icon: Users,
      href: "/admin/bancas",
      count: "12 bancas",
    },
    {
      title: "Cargos",
      description: "Gerenciar cargos e funções",
      icon: GraduationCap,
      href: "/admin/cargos",
      count: "45 cargos",
    },
    {
      title: "Provas",
      description: "Cadastrar e editar provas",
      icon: FileText,
      href: "/admin/provas",
      count: "85 provas",
    },
    {
      title: "Disciplinas",
      description: "Gerenciar disciplinas",
      icon: BookOpen,
      href: "/admin/disciplinas",
      count: "30 disciplinas",
    },
    {
      title: "Questões",
      description: "Banco de questões",
      icon: ClipboardList,
      href: "/admin/questoes",
      count: "1,250 questões",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel Administrativo</h1>
        <p className="text-gray-600">Gerencie todo o conteúdo da plataforma</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Questões</p>
                <p className="text-2xl font-bold">1,250</p>
              </div>
              <ClipboardList className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Provas Ativas</p>
                <p className="text-2xl font-bold">85</p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Concursos</p>
                <p className="text-2xl font-bold">25</p>
              </div>
              <Building className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Disciplinas</p>
                <p className="text-2xl font-bold">30</p>
              </div>
              <BookOpen className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminCards.map((card) => (
          <Card key={card.title} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <card.icon className="h-8 w-8 text-blue-600" />
                <Button asChild size="sm">
                  <Link href={card.href}>
                    <Plus className="h-4 w-4 mr-1" />
                    Gerenciar
                  </Link>
                </Button>
              </div>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">{card.count}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <Plus className="h-4 w-4 text-green-600" />
              <div className="flex-1">
                <p className="font-medium">Nova prova adicionada</p>
                <p className="text-sm text-gray-600">INSS 2023 - Técnico do Seguro Social</p>
              </div>
              <span className="text-sm text-gray-500">2 horas atrás</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <FileText className="h-4 w-4 text-blue-600" />
              <div className="flex-1">
                <p className="font-medium">Questões atualizadas</p>
                <p className="text-sm text-gray-600">25 questões de Direito Constitucional</p>
              </div>
              <span className="text-sm text-gray-500">1 dia atrás</span>
            </div>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <Building className="h-4 w-4 text-purple-600" />
              <div className="flex-1">
                <p className="font-medium">Novo concurso cadastrado</p>
                <p className="text-sm text-gray-600">Tribunal de Justiça do RS</p>
              </div>
              <span className="text-sm text-gray-500">3 dias atrás</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
