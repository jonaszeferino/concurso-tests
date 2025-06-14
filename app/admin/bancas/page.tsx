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

interface Banca {
  id: number;
  nome: string;
  sigla: string;
  site_oficial: string;
  estilo_de_prova: string;
}

export default function BancasPage() {
  const [bancas, setBancas] = useState<Banca[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    nome: "",
    sigla: "",
    site_oficial: "",
    estilo_de_prova: "",
  });

  useEffect(() => {
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
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Enviando dados:', formData);

      const response = await fetch('/api/v1/bancas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        console.error('Erro na resposta:', responseData);
        throw new Error(responseData.error || 'Erro ao criar banca');
      }

      toast.success("Banca criada com sucesso!");
      setFormData({
        nome: "",
        sigla: "",
        site_oficial: "",
        estilo_de_prova: "",
      });
      fetchBancas();
    } catch (error) {
      console.error('Erro completo:', error);
      toast.error(error instanceof Error ? error.message : "Erro ao criar banca");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir esta banca?")) return;

    try {
      const response = await fetch(`/api/v1/bancas?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir banca');

      toast.success("Banca excluída com sucesso!");
      fetchBancas();
    } catch (error) {
      toast.error("Erro ao excluir banca");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Gerenciar Bancas Examinadoras</h1>
        <p className="text-gray-600">Adicione e gerencie as bancas examinadoras</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Formulário de Inserção */}
        <Card>
          <CardHeader>
            <CardTitle>Nova Banca</CardTitle>
            <CardDescription>Preencha os dados da nova banca examinadora</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome</Label>
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
                <Label htmlFor="sigla">Sigla</Label>
                <Input
                  id="sigla"
                  value={formData.sigla}
                  onChange={(e) =>
                    setFormData({ ...formData, sigla: e.target.value })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_oficial">Site Oficial</Label>
                <Input
                  id="site_oficial"
                  type="url"
                  value={formData.site_oficial}
                  onChange={(e) =>
                    setFormData({ ...formData, site_oficial: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estilo_de_prova">Estilo de Prova</Label>
                <Input
                  id="estilo_de_prova"
                  value={formData.estilo_de_prova}
                  onChange={(e) =>
                    setFormData({ ...formData, estilo_de_prova: e.target.value })
                  }
                />
              </div>
              <Button type="submit" className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Banca
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de Bancas */}
        <Card>
          <CardHeader>
            <CardTitle>Bancas Cadastradas</CardTitle>
            <CardDescription>Lista de todas as bancas examinadoras</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Carregando...</p>
            ) : (
              <div className="space-y-4">
                {bancas.map((banca) => (
                  <div
                    key={banca.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <h3 className="font-medium">{banca.nome}</h3>
                      <p className="text-sm text-gray-600">
                        {banca.sigla} - {banca.estilo_de_prova}
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(banca.id)}
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
