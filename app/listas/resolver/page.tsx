'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Play } from 'lucide-react'

interface ListaExercicios {
  id: number
  titulo: string
  descricao: string
  created_at: string
  questoes: {
    id: number
    numero: number
    enunciado: string
    alternativas: string[]
    prova: {
      id: number
      titulo: string
      concurso: {
        titulo: string
        banca: string
      }
      disciplina: {
        nome: string
      }
    }
  }[]
}

export default function ResolverListasPage() {
  const router = useRouter()
  const [listas, setListas] = useState<ListaExercicios[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchListas()
  }, [])

  const fetchListas = async () => {
    try {
      const response = await fetch('/api/v1/listas-exercicios')
      if (!response.ok) {
        throw new Error('Erro ao buscar listas')
      }
      const data = await response.json()
      setListas(data)
    } catch (error) {
      console.error('Erro ao buscar listas:', error)
      toast.error('Erro ao buscar listas de exercícios')
    } finally {
      setLoading(false)
    }
  }

  const handleResolverLista = (lista: ListaExercicios) => {
    router.push(`/listas/resolver/${lista.id}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando listas...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Resolver Listas de Exercícios</h1>
        <Button
          variant="outline"
          onClick={() => router.push('/listas')}
        >
          Gerenciar Listas
        </Button>
      </div>

      {listas.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Você ainda não tem nenhuma lista de exercícios.
          </p>
          <Button
            variant="link"
            onClick={() => router.push('/questoes')}
            className="mt-4"
          >
            Criar sua primeira lista
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {listas.map((lista) => (
            <Card key={lista.id}>
              <CardHeader>
                <CardTitle>{lista.titulo}</CardTitle>
                <CardDescription>
                  {lista.descricao || 'Sem descrição'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    {lista.questoes.length} questões
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Criada em {new Date(lista.created_at).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleResolverLista(lista)}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Iniciar Exercícios
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 