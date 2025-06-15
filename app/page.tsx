import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Trophy, Filter } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Sistema de Provas
            <span className="text-blue-600"> Concursos Públicos</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Plataforma completa para gerenciar e realizar provas de concursos
            públicos online. Cadastre provas, questões e permita que candidatos
            pratiquem com filtros avançados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-3">
              <Link href="/questoes">Fazer Questões</Link>
            </Button>
            {/* <Button asChild variant="outline" size="lg" className="text-lg px-8 py-3">
              <Link href="/admin">Área Administrativa</Link>
            </Button>*/}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <BookOpen className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <CardTitle>Banco de Questões</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Amplo banco de questões organizadas por disciplina, banca e
                concurso
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Filter className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <CardTitle>Filtros Avançados</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Filtre provas por órgão, banca, cargo, disciplina e ano
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <Trophy className="h-12 w-12 text-orange-600 mx-auto mb-4" />
              <CardTitle>Simulados Online</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Realize provas completas online com correção automática
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-center mb-8">
            Estatísticas da Plataforma
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">1,250+</div>
              <div className="text-gray-600">Questões</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">85+</div>
              <div className="text-gray-600">Provas</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">25+</div>
              <div className="text-gray-600">Órgãos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-orange-600">12+</div>
              <div className="text-gray-600">Bancas</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
