"use client";

import { EnqueteCard, EnqueteProps } from "@/components/EnqueteCard";
import { fetchApi } from "@/lib/api";
import { useState } from "react";

const dados = [
  {
    id: "1",
    title: "Quem vai ser Presidente do Brasil?",
    deadline: "40 dias restante",
    opcoes: [
      { id: "opt-1", text: "Prendeu matou", votos: 12 },
      { id: "opt-2", text: "Lule", votos: 20 },
      { id: "opt-3", text: "Rachads", votos: 6 },
    ],
  },
  {
    id: "2",
    title: "Onde vamos almoçar na sexta-feira?",
    deadline: "3 dias restantes",
    opcoes: [
      { id: "opt-4", text: "Pizza", votos: 15 },
      { id: "opt-5", text: "Hamburguer", votos: 10 },
      { id: "opt-6", text: "Comida Japonesa", votos: 8 },
    ],
  },
  {
    id: "2",
    title: "Onde vamos almoçar na sexta-feira?",
    deadline: "3 dias restantes",
    opcoes: [
      { id: "opt-4", text: "Pizza", votos: 15 },
      { id: "opt-5", text: "Hamburguer", votos: 10 },
      { id: "opt-6", text: "Comida Japonesa", votos: 8 },
    ],
  },
  {
    id: "2",
    title: "Onde vamos almoçar na sexta-feira?",
    deadline: "3 dias restantes",
    opcoes: [
      { id: "opt-4", text: "Pizza", votos: 15 },
      { id: "opt-5", text: "Hamburguer", votos: 10 },
      { id: "opt-6", text: "Comida Japonesa", votos: 8 },
    ],
  },
];

export default function HomePage() {
  const [enquetes, setEnquetes] = useState<EnqueteProps[]>([]);

  fetchApi<EnqueteProps[]>("/enquete")
    .then((data) => {
      data.sort((a, b) => new Date(a.dataLimite).getTime() - new Date(b.dataLimite).getTime());
      setEnquetes(data);
    })
    .catch((error) => {
      console.error("Erro ao buscar enquetes:", error);
    });
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
    })
  };
  function calcularDiasRestantes(dataLimite: string): string {
    const hoje = new Date();
    const limite = new Date(dataLimite);
    const diferenca = limite.getTime() - hoje.getTime();
    const diasRestantes = Math.ceil(diferenca / (1000 * 60 * 60 * 24));

    if (diasRestantes < 0) {
      return "Enquete encerrada";
    } else if (diasRestantes === 0) {
      return "Último dia para votar";
    } else if (diasRestantes === 1) {
      return "1 dia restante";
    } else {
      return `${diasRestantes} dias restantes`;
    }
  }
  return (
    <div>
      <header className="p-5 m-0 bg-blue-950">
        <h1 className="text-4xl text-white text-center">VOTAÍ</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
      
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
    </div>
  );
}