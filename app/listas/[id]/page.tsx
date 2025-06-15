'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'

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
      banca: string
    }
    disciplina: {
      nome: string
    }
  }
}

interface ListaExercicios {
  id: number
  titulo: string
  descricao: string
  created_at: string
  questoes: Questao[]
}

export default function EditarListaPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [lista, setLista] = useState<ListaExercicios | null>(null)
  const [loading, setLoading] = useState(true)
  const [removendoQuestao, setRemovendoQuestao] = useState<number | null>(null)

  useEffect(() => {
    fetchLista()
  }, [params.id])

  const fetchLista = async () => {
    try {
      const response = await fetch(`/api/v1/listas-exercicios/${params.id}`)
      if (!response.ok) {
        throw new Error('Erro ao buscar lista')
      }
      const data = await response.json()
      setLista(data)
    } catch (error) {
      console.error('Erro ao buscar lista:', error)
      toast.error('Erro ao buscar lista de exercícios')
    } finally {
      setLoading(false)
    }
  }

  const handleRemoverQuestao = async (questaoId: number) => {
    try {
      setRemovendoQuestao(questaoId)
      const response = await fetch(`/api/v1/listas-exercicios/${params.id}/questoes`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questao_id: questaoId }),
      })

      if (!response.ok) {
        throw new Error('Erro ao remover questão')
      }

      toast.success('Questão removida com sucesso')
      fetchLista() // Recarregar a lista
    } catch (error) {
      console.error('Erro ao remover questão:', error)
      toast.error('Erro ao remover questão da lista')
    } finally {
      setRemovendoQuestao(null)
    }
  }

  const handleResolverLista = () => {
    if (!lista) return
    const ids = lista.questoes.map(q => q.id)
    router.push(`/questoes/resolver?ids=${ids.join(',')}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg">Carregando lista...</p>
        </div>
      </div>
    )
  }

  if (!lista) {
    return (
      <div className="container mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Lista não encontrada
          </p>
          <Button
            variant="link"
            onClick={() => router.push('/listas')}
            className="mt-4"
          >
            Voltar para listas
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{lista.titulo}</h1>
          <p className="text-muted-foreground mt-2">
            {lista.descricao || 'Sem descrição'}
          </p>
        </div>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push('/questoes')}
          >
            Adicionar Questões
          </Button>
          <Button
            onClick={handleResolverLista}
            disabled={lista.questoes.length === 0}
          >
            Resolver Lista
          </Button>
        </div>
      </div>

      {lista.questoes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">
            Esta lista ainda não tem questões.
          </p>
          <Button
            variant="link"
            onClick={() => router.push('/questoes')}
            className="mt-4"
          >
            Adicionar questões
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {lista.questoes.map((questao) => (
            <Card key={questao.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-base">
                    Questão {questao.numero}
                  </CardTitle>
                  <CardDescription>
                    {questao.prova.concurso.titulo} - {questao.prova.disciplina.nome}
                  </CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoverQuestao(questao.id)}
                  disabled={removendoQuestao === questao.id}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{questao.enunciado}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
} 