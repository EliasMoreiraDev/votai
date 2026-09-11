"use client";

import { useEffect, useState } from "react";
import { EnqueteCard, EnqueteProps } from "@/components/EnqueteCard";
import { fetchApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Calendar, ListPlus, X } from "lucide-react";

export default function HomePage() {
  const [enquetes, setEnquetes] = useState<EnqueteProps[]>([]);
  const [modalAberto, setModalAberto] = useState(false);

  const [novoTitulo, setNovoTitulo] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");
  const [novaDataLimite, setNovaDataLimite] = useState("");
  const [opcoes, setOpcoes] = useState<string[]>(["", ""]);
  const [salvandoEnquete, setSalvandoEnquete] = useState(false);

  useEffect(() => {
    fetchApi<EnqueteProps[]>("/enquete")
      .then((data) => {
        data.sort(
          (a, b) =>
            new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime()
        );
        setEnquetes(data);
      })
      .catch((error) => {
        console.error("Erro ao buscar enquetes:", error);
      });
  }, []);


  const handleVotar = async (enqueteId: string, opcaoId: string) => {
    const enquetesAnteriores = [...enquetes];

    setEnquetes((prevEnquetes) =>
      prevEnquetes.map((enquete) => {
        if (enquete._id !== enqueteId) return enquete;

        return {
          ...enquete,
          opcoes: enquete.opcoes.map((opcao) => {
            if (opcao._id === opcaoId) {
              return { ...opcao, votos: opcao.votos + 1 };
            }
            return opcao;
          }),
        };
      })
    );

    try {
      await fetchApi(`/enquete/${enqueteId}/votar`, {
        metodo: "POST",
        body: { opcaoId },
      });
    } catch (error) {
      console.error("Erro ao computar voto:", error);
      setEnquetes(enquetesAnteriores);
      alert("Não foi possível registrar seu voto. Tente novamente.");
    }
  };

  const handleComentar = async (enqueteId: string, texto: string) => {
    const comentario = await fetchApi<NonNullable<EnqueteProps["comentarios"]>[number]>(
      `/enquete/${enqueteId}/comentarios`,
      {
        metodo: "POST",
        body: { texto },
      }
    );

    setEnquetes((prevEnquetes) =>
      prevEnquetes.map((enquete) => {
        if (enquete._id !== enqueteId) return enquete;

        return {
          ...enquete,
          comentarios: [...(enquete.comentarios ?? []), comentario],
        };
      })
    );
  };

  const handleAdicionarOpcao = () => {
    setOpcoes([...opcoes, ""]);
  };

  const handleRemoverOpcao = (index: number) => {
    if (opcoes.length <= 2) {
      alert("A enquete precisa ter no mínimo 2 opções.");
      return;
    }
    setOpcoes(opcoes.filter((_, i) => i !== index));
  };

  const handleMudarOpcao = (index: number, valor: string) => {
    const novas = [...opcoes];
    novas[index] = valor;
    setOpcoes(novas);
  };

  const handleFecharModal = () => {
    setModalAberto(false);
    setNovoTitulo("");
    setNovaDescricao("");
    setNovaDataLimite("");
    setOpcoes(["", ""]);
  };

  const handleCriarEnquete = async (e: React.FormEvent) => {
    e.preventDefault();

    const opcoesValidas = opcoes.map((o) => o.trim()).filter(Boolean);
    if (opcoesValidas.length < 2) {
      alert("Informe pelo menos 2 opções válidas.");
      return;
    }

    if (!novoTitulo.trim() || !novaDataLimite) {
      alert("Preencha o título e a data limite.");
      return;
    }

    try {
      setSalvandoEnquete(true);

      const novaEnquete = await fetchApi<EnqueteProps>("/enquete", {
        metodo: "POST",
        body: {
          titulo: novoTitulo.trim(),
          descricao: novaDescricao.trim() || undefined,
          dataLimite: new Date(novaDataLimite).toISOString(),
          opcoes: opcoesValidas.map((texto) => ({ texto })),
        },
      });

      console.log("DEBUG: Enquete criada pelo backend:", novaEnquete);

      setEnquetes((prev) => [novaEnquete, ...prev]);
      handleFecharModal();
    } catch (error) {
      console.error("Erro ao criar enquete:", error);
      alert("Não foi possível criar a enquete. Verifique os dados e tente novamente.");
    } finally {
      setSalvandoEnquete(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <header className="p-5 bg-blue-950 shadow-md">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-extrabold text-white tracking-wider">VOTAÍ</h1>

          <Button
            onClick={() => setModalAberto(true)}
            className="bg-blue-800 hover:bg-blue-700 text-amber-50 font-bold border border-blue-600/50 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Nova Enquete
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {enquetes.map((enquete) => (
            <div
              key={enquete._id}
              className="mb-6 break-inside-avoid"
            >
              <EnqueteCard
                _id={enquete._id}
                titulo={enquete.titulo}
                descricao={enquete.descricao}
                dataLimite={enquete.dataLimite}
                opcoes={enquete.opcoes}
                comentarios={enquete.comentarios}
                onVoto={(opcaoId) => handleVotar(enquete._id, opcaoId)}
                onComentario={(texto) => handleComentar(enquete._id, texto)}
              />
            </div>
          ))}
        </div>
      </main>

      {modalAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleFecharModal}
        >
          <div
            className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <button
              onClick={handleFecharModal}
              className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <ListPlus className="text-blue-900 w-6 h-6" /> Criar Nova Enquete
            </h2>

            <form onSubmit={handleCriarEnquete} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Título da Enquete *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Qual o tema do próximo evento?"
                  value={novoTitulo}
                  onChange={(e) => setNovoTitulo(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Descrição (opcional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Escreva detalhes adicionais..."
                  value={novaDescricao}
                  onChange={(e) => setNovaDescricao(e.target.value)}
                  className="w-full border rounded-lg p-2.5 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-4 h-4 text-blue-900" /> Data Limite *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={novaDataLimite}
                  onChange={(e) => setNovaDataLimite(e.target.value)}
                  className="w-full sm:w-auto border rounded-lg p-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Opções de Voto (Mínimo 2) *
                </label>
                <div className="space-y-2">
                  {opcoes.map((opcao, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        type="text"
                        required
                        placeholder={`Opção ${idx + 1}`}
                        value={opcao}
                        onChange={(e) => handleMudarOpcao(idx, e.target.value)}
                        className="flex-1 border rounded-lg p-2 text-sm border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-900"
                      />
                      {opcoes.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoverOpcao(idx)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAdicionarOpcao}
                  className="mt-3 text-xs border-dashed border-slate-300 text-slate-600 hover:text-blue-900"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" /> Adicionar Opção
                </Button>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleFecharModal}
                  disabled={salvandoEnquete}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-900 hover:bg-blue-950 text-amber-50 font-bold"
                  disabled={salvandoEnquete}
                >
                  {salvandoEnquete ? "Criando..." : "Publicar Enquete"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}