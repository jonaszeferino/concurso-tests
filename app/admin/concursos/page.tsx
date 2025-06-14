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
  banca_id: number;
  sigla_banca: string;
  banca_examinadora: Banca;
}

export default function ConcursosPage() {
  const [concursos, setConcursos] = useState<Concurso[]>([]);
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    orgao: "",
    ano: "",
    edital: "",
    status: "",
    data_da_prova: "",
    banca_id: "",
  });

  useEffect(() => {
    fetchConcursos();
    fetchBancas();
  }, []);

  const fetchBancas = async () => {
    try {
      const response = await fetch('/api/v1/bancas');
      if (!response.ok) throw new Error('Erro ao carregar bancas');
      const data = await response.json();
      setBancas(data);
    } catch (error) {
      toast.error("Erro ao carregar bancas");
      console.error(error);
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando dados:', formData);

      const response = await fetch('/api/v1/concursos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          ano: parseInt(formData.ano),
          banca_id: parseInt(formData.banca_id)
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erro na resposta:', responseData);
        throw new Error(responseData.error || 'Erro ao criar concurso');
      }

      toast.success("Concurso criado com sucesso!");
      setFormData({
        orgao: "",
        ano: "",
        edital: "",
        status: "",
        data_da_prova: "",
        banca_id: "",
      });
      fetchConcursos();
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao criar concurso");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este concurso?")) return;

    try {
      const response = await fetch(`/api/v1/concursos?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir concurso');

      toast.success("Concurso excluído com sucesso!");
      fetchConcursos();
    } catch (error) {
      toast.error("Erro ao excluir concurso");
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
        <h1 className="text-3xl font-bold mb-2">Gerenciar Concursos</h1>
        <p className="text-gray-600">Adicione e gerencie os concursos disponíveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Inserção */}
        <Card>
          <CardHeader>
            <CardTitle>Novo Concurso</CardTitle>
            <CardDescription>Preencha os dados do novo concurso</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="orgao">Órgão</Label>
                <Input
                  id="orgao"
                  value={formData.orgao}
                  onChange={(e) =>
                    setFormData({ ...formData, orgao: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ano">Ano</Label>
                <Input
                  id="ano"
                  type="number"
                  value={formData.ano}
                  onChange={(e) =>
                    setFormData({ ...formData, ano: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edital">Edital</Label>
                <Input
                  id="edital"
                  value={formData.edital}
                  onChange={(e) =>
                    setFormData({ ...formData, edital: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Input
                  id="status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_da_prova">Data da Prova</Label>
                <Input
                  id="data_da_prova"
                  type="datetime-local"
                  value={formData.data_da_prova}
                  onChange={(e) =>
                    setFormData({ ...formData, data_da_prova: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banca_id">Banca</Label>
                <Select
                  value={formData.banca_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, banca_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma banca" />
                  </SelectTrigger>
                  <SelectContent>
                    {bancas.map((banca) => (
                      <SelectItem key={banca.id} value={banca.id.toString()}>
                        {banca.nome} ({banca.sigla})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Concurso
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Concursos */}
        <Card>
          <CardHeader>
            <CardTitle>Concursos Cadastrados</CardTitle>
            <CardDescription>Lista de todos os concursos disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {concursos.map((concurso) => (
                  <div
                    key={concurso.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{concurso.orgao}</h3>
                      <p className="text-sm text-gray-600">
                        Edital {concurso.edital} - {concurso.ano}
                      </p>
                      <p className="text-sm text-gray-500">
                        Status: {concurso.status}
                      </p>
                      <p className="text-sm text-gray-500">
                        Data da Prova: {formatarData(concurso.data_da_prova)}
                      </p>
                      <p className="text-sm text-gray-500">
                        Banca: {concurso.banca_examinadora?.nome} ({concurso.sigla_banca})
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(concurso.id)}
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
