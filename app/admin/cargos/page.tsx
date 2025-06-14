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
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Cargo {
  id: number;
  nome_do_cargo: string;
  nivel: string;
  salario: number;
  requisitos: string;
  lotacao_prevista: string;
}

export default function CargosPage() {
  const [cargos, setCargos] = useState<Cargo[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome_do_cargo: "",
    nivel: "",
    salario: "",
    requisitos: "",
    lotacao_prevista: "",
  });

  useEffect(() => {
    fetchCargos();
  }, []);

  const fetchCargos = async () => {
    try {
      const response = await fetch('/api/v1/cargos');
      if (!response.ok) throw new Error('Erro ao carregar cargos');
      const data = await response.json();
      setCargos(data);
    } catch (error) {
      toast.error("Erro ao carregar cargos");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando dados:', formData);

      const response = await fetch('/api/v1/cargos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          salario: parseFloat(formData.salario)
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erro na resposta:', responseData);
        throw new Error(responseData.error || 'Erro ao criar cargo');
      }

      toast.success("Cargo criado com sucesso!");
      setFormData({
        nome_do_cargo: "",
        nivel: "",
        salario: "",
        requisitos: "",
        lotacao_prevista: "",
      });
      fetchCargos();
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao criar cargo");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este cargo?")) return;

    try {
      const response = await fetch(`/api/v1/cargos?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir cargo');

      toast.success("Cargo excluído com sucesso!");
      fetchCargos();
    } catch (error) {
      toast.error("Erro ao excluir cargo");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Cargos</h1>
        <p className="text-gray-600">Adicione e gerencie os cargos disponíveis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Inserção */}
        <Card>
          <CardHeader>
            <CardTitle>Novo Cargo</CardTitle>
            <CardDescription>Preencha os dados do novo cargo</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome_do_cargo">Nome do Cargo</Label>
                <Input
                  id="nome_do_cargo"
                  value={formData.nome_do_cargo}
                  onChange={(e) =>
                    setFormData({ ...formData, nome_do_cargo: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nivel">Nível</Label>
                <Input
                  id="nivel"
                  value={formData.nivel}
                  onChange={(e) =>
                    setFormData({ ...formData, nivel: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salario">Salário</Label>
                <Input
                  id="salario"
                  type="number"
                  step="0.01"
                  value={formData.salario}
                  onChange={(e) =>
                    setFormData({ ...formData, salario: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="requisitos">Requisitos</Label>
                <Input
                  id="requisitos"
                  value={formData.requisitos}
                  onChange={(e) =>
                    setFormData({ ...formData, requisitos: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lotacao_prevista">Lotação Prevista</Label>
                <Input
                  id="lotacao_prevista"
                  value={formData.lotacao_prevista}
                  onChange={(e) =>
                    setFormData({ ...formData, lotacao_prevista: e.target.value })
                  }
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Cargo
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Cargos */}
        <Card>
          <CardHeader>
            <CardTitle>Cargos Cadastrados</CardTitle>
            <CardDescription>Lista de todos os cargos disponíveis</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {cargos.map((cargo) => (
                  <div
                    key={cargo.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{cargo.nome_do_cargo}</h3>
                      <p className="text-sm text-gray-600">
                        {cargo.nivel} - R$ {cargo.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                      <p className="text-sm text-gray-500">
                        {cargo.lotacao_prevista}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(cargo.id)}
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
