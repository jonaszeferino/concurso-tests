'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Trash2, Play, Edit } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

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

export default function ListasPage() {
  const router = useRouter()
  const [listas, setListas] = useState<ListaExercicios[]>([])
  const [loading, setLoading] = useState(true)
  const [excluindoLista, setExcluindoLista] = useState<number | null>(null)

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

  const handleExcluirLista = async (listaId: number) => {
    try {
      setExcluindoLista(listaId)
      const response = await fetch(`/api/v1/listas-exercicios/${listaId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir lista')
      }

      toast.success('Lista excluída com sucesso')
      fetchListas() // Recarregar a lista
    } catch (error) {
      console.error('Erro ao excluir lista:', error)
      toast.error('Erro ao excluir lista')
    } finally {
      setExcluindoLista(null)
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
        <h1 className="text-3xl font-bold">Minhas Listas de Exercícios</h1>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/listas/resolver')}
          >
            Resolver Listas
          </Button>
          <Button onClick={() => router.push('/questoes')}>
            Criar Nova Lista
          </Button>
        </div>
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
              <CardFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => router.push(`/listas/${lista.id}`)}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>
                <Button
                  onClick={() => handleResolverLista(lista)}
                  className="flex-1"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Resolver
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={excluindoLista === lista.id}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Lista</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir esta lista? Esta ação não pode ser desfeita.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleExcluirLista(lista.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Excluir
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 