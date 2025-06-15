"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Banca {
  id: number;
  nome: string;
  sigla: string;
}

interface Concurso {
  id: number;
  orgao: string;
  ano: number;
  edital: string;
  status: string;
  data_da_prova: string;
  banca_examinadora: Banca;
}

interface Disciplina {
  id: number;
  nome: string;
  area_de_conhecimento: string;
}

interface Cargo {
  id: number;
  nome_do_cargo: string;
  nivel: string;
}

interface Prova {
  id: number;
  titulo: string;
  concurso_id: number;
  disciplina_id: number;
  cargo_id: number;
  data_prova: string;
  descricao: string;
  nivel_dificuldade: string;
  tempo_limite: number;
  numero_questoes: number;
  concurso: Concurso;
  disciplina: Disciplina;
  cargo: Cargo;
}

export default function ProvasPage() {
  const [provas, setProvas] = useState<Prova[]>([]);
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    titulo: "",
    concurso_id: "",
    disciplina_id: "",
    cargo_id: "",
    data_prova: "",
    descricao: "",
    nivel_dificuldade: "",
    tempo_limite: "",
    numero_questoes: "",
    tipo_de_prova: "",
    turno_data: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProvas();
    fetchConcursos();
    fetchDisciplinas();
    fetchCargos();
  }, []);

  const fetchProvas = async () => {
    try {
      const response = await fetch('/api/v1/provas');
      if (!response.ok) throw new Error('Erro ao carregar provas');
      const data = await response.json();
      setProvas(data);
    } catch (error) {
      toast.error("Erro ao carregar provas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchConcursos = async () => {
    try {
      const response = await fetch('/api/v1/concursos');
      if (!response.ok) throw new Error('Erro ao carregar concursos');
      const data = await response.json();
      setConcursos(data);
    } catch (error) {
      toast.error("Erro ao carregar concursos");
      console.error(error);
    }
  };

  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('/api/v1/disciplinas');
      if (!response.ok) throw new Error('Erro ao carregar disciplinas');
      const data = await response.json();
      setDisciplinas(data);
    } catch (error) {
      toast.error("Erro ao carregar disciplinas");
      console.error(error);
    }
  };

  const fetchCargos = async () => {
    try {
      const response = await fetch('/api/v1/cargos');
      if (!response.ok) throw new Error('Erro ao carregar cargos');
      const data = await response.json();
      setCargos(data);
    } catch (error) {
      toast.error("Erro ao carregar cargos");
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Enviando dados:', formData)
      const response = await fetch('/api/v1/provas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const responseData = await response.json()
      console.log('Resposta da API:', responseData)

      if (!response.ok) {
        console.error('Erro na resposta:', responseData)
        throw new Error(responseData.error || 'Erro ao criar prova')
      }

      toast.success('Prova criada com sucesso!')

      // Limpar formulário
      setFormData({
        titulo: '',
        descricao: '',
        concurso_id: '',
        disciplina_id: '',
        cargo_id: '',
        data_prova: '',
        tempo_limite: 0,
        numero_questoes: 0,
        tipo_de_prova: 'objetiva',
        turno_data: '',
        nivel_dificuldade: 'medio'
      })

      // Recarregar lista de provas
      fetchProvas()
    } catch (err) {
      console.error('Erro ao criar prova:', err)
      setError(err instanceof Error ? err.message : 'Erro ao criar prova')
      toast.error(err instanceof Error ? err.message : 'Erro ao criar prova')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta prova?")) return;

    try {
      const response = await fetch(`/api/v1/provas?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir prova');

      toast.success("Prova excluída com sucesso!");
      fetchProvas();
    } catch (error) {
      toast.error("Erro ao excluir prova");
      console.error(error);
    }
  };

  const formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Provas</h1>
        <p className="text-gray-600">Adicione e gerencie as provas disponíveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Inserção */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Prova</CardTitle>
            <CardDescription>Preencha os dados da nova prova</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) =>
                    setFormData({ ...formData, titulo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concurso_id">Concurso</Label>
                <Select
                  value={formData.concurso_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, concurso_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um concurso" />
                  </SelectTrigger>
                  <SelectContent>
                    {concursos.map((concurso) => (
                      <SelectItem key={concurso.id} value={concurso.id.toString()}>
                        {concurso.orgao} - {concurso.ano} ({concurso.banca_examinadora.sigla})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disciplina_id">Disciplina</Label>
                <Select
                  value={formData.disciplina_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, disciplina_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma disciplina" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map((disciplina) => (
                      <SelectItem key={disciplina.id} value={disciplina.id.toString()}>
                        {disciplina.nome} - {disciplina.area_de_conhecimento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo_id">Cargo</Label>
                <Select
                  value={formData.cargo_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, cargo_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    {cargos.map((cargo) => (
                      <SelectItem key={cargo.id} value={cargo.id.toString()}>
                        {cargo.nome_do_cargo} - {cargo.nivel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_prova">Data da Prova</Label>
                <Input
                  id="data_prova"
                  type="datetime-local"
                  value={formData.data_prova}
                  onChange={(e) =>
                    setFormData({ ...formData, data_prova: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) =>
                    setFormData({ ...formData, descricao: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel_dificuldade">Nível de Dificuldade</Label>
                <Select
                  value={formData.nivel_dificuldade}
                  onValueChange={(value) =>
                    setFormData({ ...formData, nivel_dificuldade: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o nível de dificuldade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="facil">Fácil</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="dificil">Difícil</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tempo_limite">Tempo Limite (minutos)</Label>
                <Input
                  id="tempo_limite"
                  type="number"
                  value={formData.tempo_limite}
                  onChange={(e) =>
                    setFormData({ ...formData, tempo_limite: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numero_questoes">Número de Questões</Label>
                <Input
                  id="numero_questoes"
                  type="number"
                  value={formData.numero_questoes}
                  onChange={(e) =>
                    setFormData({ ...formData, numero_questoes: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_de_prova">Tipo de Prova</Label>
                <Select
                  value={formData.tipo_de_prova}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipo_de_prova: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de prova" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="objetiva">Objetiva</SelectItem>
                    <SelectItem value="discursiva">Discursiva</SelectItem>
                    <SelectItem value="pratica">Prática</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turno_data">Data e Hora do Turno</Label>
                <Input
                  id="turno_data"
                  type="datetime-local"
                  value={formData.turno_data}
                  onChange={(e) =>
                    setFormData({ ...formData, turno_data: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                <Plus className="h-4 w-4 mr-2" />
                {isLoading ? 'Criando...' : 'Adicionar Prova'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Provas */}
        <Card>
          <CardHeader>
            <CardTitle>Provas Cadastradas</CardTitle>
            <CardDescription>Lista de todas as provas disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {provas.map((prova) => (
                  <div
                    key={prova.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{prova.titulo}</h3>
                      <p className="text-sm text-gray-600">
                        Concurso: {prova.concurso.orgao} - {prova.concurso.ano}
                      </p>
                      <p className="text-sm text-gray-600">
                        Disciplina: {prova.disciplina.nome}
                      </p>
                      <p className="text-sm text-gray-600">
                        Cargo: {prova.cargo.nome_do_cargo}
                      </p>
                      <p className="text-sm text-gray-500">
                        Data: {formatarData(prova.data_prova)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Nível: {prova.nivel_dificuldade} | Questões: {prova.numero_questoes} | Tempo: {prova.tempo_limite}min
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(prova.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
