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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Disciplina {
  id: number;
  nome: string;
  area_de_conhecimento: string;
  obrigatoria_para: string;
}

export default function DisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    area_de_conhecimento: "",
    obrigatoria_para: "",
  });

  useEffect(() => {
    fetchDisciplinas();
  }, []);

  const fetchDisciplinas = async () => {
    try {
      const response = await fetch('/api/v1/disciplinas');
      if (!response.ok) throw new Error('Erro ao carregar disciplinas');
      const data = await response.json();
      setDisciplinas(data);
    } catch (error) {
      toast.error("Erro ao carregar disciplinas");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando dados:', formData);

      const response = await fetch('/api/v1/disciplinas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erro na resposta:', responseData);
        throw new Error(responseData.error || 'Erro ao criar disciplina');
      }

      toast.success("Disciplina criada com sucesso!");
      setFormData({
        nome: "",
        area_de_conhecimento: "",
        obrigatoria_para: "",
      });
      fetchDisciplinas();
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao criar disciplina");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta disciplina?")) return;

    try {
      const response = await fetch(`/api/v1/disciplinas?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir disciplina');

      toast.success("Disciplina excluída com sucesso!");
      fetchDisciplinas();
    } catch (error) {
      toast.error("Erro ao excluir disciplina");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Disciplinas</h1>
        <p className="text-gray-600">Adicione e gerencie as disciplinas disponíveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Inserção */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Disciplina</CardTitle>
            <CardDescription>Preencha os dados da nova disciplina</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Disciplina</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="area_de_conhecimento">Área de Conhecimento</Label>
                <Input
                  id="area_de_conhecimento"
                  value={formData.area_de_conhecimento}
                  onChange={(e) =>
                    setFormData({ ...formData, area_de_conhecimento: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="obrigatoria_para">Obrigatória Para</Label>
                <Textarea
                  id="obrigatoria_para"
                  value={formData.obrigatoria_para}
                  onChange={(e) =>
                    setFormData({ ...formData, obrigatoria_para: e.target.value })
                  }
                  placeholder="Ex: Técnico Administrativo, Analista Judiciário"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Disciplina
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Disciplinas */}
        <Card>
          <CardHeader>
            <CardTitle>Disciplinas Cadastradas</CardTitle>
            <CardDescription>Lista de todas as disciplinas disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {disciplinas.map((disciplina) => (
                  <div
                    key={disciplina.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{disciplina.nome}</h3>
                      <p className="text-sm text-gray-600">
                        Área: {disciplina.area_de_conhecimento}
                      </p>
                      <p className="text-sm text-gray-500">
                        Obrigatória para: {disciplina.obrigatoria_para}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(disciplina.id)}
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
