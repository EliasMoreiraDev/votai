import { EnqueteCard } from "@/components/EnqueteCard";

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
  return (
    <div>
      <header className="p-5 m-0 bg-blue-950">
        <h1 className="text-4xl text-white text-center">VOTAÍ</h1>
      </header>
      <main className="container mx-auto px-4 py-8">
      
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dados.map((enquete) => (
            <EnqueteCard
              key={enquete.id}
              id={enquete.id}
              title={enquete.title}
              deadline={enquete.deadline}
              opcoes={enquete.opcoes}
            />
          ))}
        </div>
      </main>
    </div>
  );
}