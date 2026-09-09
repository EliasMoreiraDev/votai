"use client";

import { EnqueteCard, EnqueteProps } from "@/components/EnqueteCard";
import { fetchApi } from "@/lib/api";
import { useState, useEffect } from "react";

export default function HomePage() {
  const [enquetes, setEnquetes] = useState<EnqueteProps[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Estados do formulário do modal
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataLimite, setDataLimite] = useState("");
  const [opcoes, setOpcoes] = useState<string[]>(["", ""]);

  // Carrega as enquetes apenas na inicialização
  useEffect(() => {
    fetchApi<EnqueteProps[]>("/enquete")
      .then((data) => {
        data.sort((a, b) => new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime());
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

    fetchApi(`/enquete/${enqueteId}/votar`, {
      metodo: "POST",
      body: { opcaoId },
    }).catch((error) => {
      console.error("Erro ao computar voto:", error);
      setEnquetes(enquetesAnteriores);
      alert("Não foi possível registrar seu voto. Tente novamente.");
    });
  };

function calcularDiasRestantes(dataLimite?: string | null): string {
  if (!dataLimite) {
    return "Data não informada";
  }

  const limite = new Date(dataLimite);

  // Se a data for inválida, getTime() resulta em NaN
  if (isNaN(limite.getTime())) {
    return "Data inválida";
  }

  const agora = new Date();
  const diferencaMs = limite.getTime() - agora.getTime();

  if (diferencaMs <= 0) {
    return "Enquete encerrada";
  }

  const minutosRestantes = Math.floor(diferencaMs / (1000 * 60));
  const horasRestantes = Math.floor(diferencaMs / (1000 * 60 * 60));
  const diasRestantes = Math.floor(diferencaMs / (1000 * 60 * 60 * 24));

  if (minutosRestantes < 60) {
    return minutosRestantes <= 1
      ? "Menos de 1 minuto restante"
      : `${minutosRestantes} minutos restantes`;
  }

  if (horasRestantes < 24) {
    return horasRestantes === 1
      ? "1 hora restante"
      : `${horasRestantes} horas restantes`;
  }

  return diasRestantes === 1
    ? "1 dia restante"
    : `${diasRestantes} dias restantes`;
}

  const handleOpcaoChange = (index: number, valor: string) => {
    const novasOpcoes = [...opcoes];
    novasOpcoes[index] = valor;
    setOpcoes(novasOpcoes);
  };

  const handleAdicionarOpcao = () => {
    setOpcoes([...opcoes, ""]);
  };

  const handleRemoverOpcao = (index: number) => {
    if (opcoes.length > 2) {
      setOpcoes(opcoes.filter((_, i) => i !== index));
    }
  };

  const resetarFormulario = () => {
    setTitulo("");
    setDescricao("");
    setDataLimite("");
    setOpcoes(["", ""]);
    setIsModalOpen(false);
  };

  const handleSubmitCriarEnquete = async (e: React.FormEvent) => {
  e.preventDefault();

  const opcoesValidas = opcoes.map((op) => op.trim()).filter(Boolean);
  if (opcoesValidas.length < 2) {
    alert("Informe ao menos 2 opções válidas.");
    return;
  }

  if (!dataLimite) {
    alert("Por favor, selecione uma data e horário limite.");
    return;
  }

  const dataConvertida = new Date(dataLimite);
  if (isNaN(dataConvertida.getTime())) {
    alert("Data inválida. Por favor, selecione novamente.");
    return;
  }

  const dataIso = dataConvertida.toISOString();

  setIsLoading(true);

  try {
    const payload = {
      titulo: titulo.trim(),
      descricao: descricao.trim(),
      dataLimite: dataIso, 
      opcoes: opcoesValidas.map((tituloOpcao) => ({ texto: tituloOpcao })),
    };

    console.log("Enviando payload para criar enquete:", payload);

    const response = await fetchApi<any>("/enquete", {
      metodo: "POST",
      body: payload,
    });

    const enqueteCriada = response?.enquete || response?.data || response;

    const novaEnqueteFormatada: EnqueteProps = {
      ...enqueteCriada,
      dataLimite: enqueteCriada.dataLimite || enqueteCriada.data_limite || dataIso,
    };

    setEnquetes((prev) =>
      [...prev, novaEnqueteFormatada].sort(
        (a, b) => new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime()
      )
    );

    resetarFormulario();
  } catch (error) {
    console.error("Erro ao criar enquete:", error);
    alert("Erro ao criar enquete." + (error instanceof Error ? ` ${error.message}` : ""));
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="p-5 m-0 bg-blue-950">
        <h1 className="text-4xl text-white text-center font-bold">VOTAÍ</h1>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800">Enquetes Disponíveis</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-950 hover:bg-blue-800 text-white font-semibold py-2 px-4 rounded-md shadow-sm transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2  "
          >
            + Nova Enquete
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enquetes.map((enquete) => (
            <EnqueteCard
              key={enquete._id}
              _id={enquete._id}
              titulo={enquete.titulo}
              descricao={enquete.descricao}
              dataLimite={calcularDiasRestantes(enquete.dataLimite)}
              opcoes={enquete.opcoes}
              onVoto={(opcaoId) => handleVotar(enquete._id, opcaoId)}
            />
          ))}
        </div>
      </main>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Criar Nova Enquete</h3>

            <form onSubmit={handleSubmitCriarEnquete} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                <input
                  type="text"
                  required
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Ex: Melhor framework JS em 2026?"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Contexto adicional sobre a votação..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Limite</label>
                <input
                  type="datetime-local"
                  required
                  value={dataLimite}
                  onChange={(e) => setDataLimite(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Opções de Voto</label>
                <div className="space-y-2">
                  {opcoes.map((opcao, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={opcao}
                        onChange={(e) => handleOpcaoChange(index, e.target.value)}
                        placeholder={`Opção ${index + 1}`}
                        className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {opcoes.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoverOpcao(index)}
                          className="px-3 py-2 text-red-500 hover:text-red-700 border border-red-300 hover:border-red-500 rounded-md text-sm"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAdicionarOpcao}
                  className="mt-2 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Adicionar mais uma opção
                </button>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={resetarFormulario}
                  className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {isLoading ? "Salvando..." : "Criar Enquete"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}