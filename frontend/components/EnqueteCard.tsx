"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Circle, MessageCircle } from "lucide-react";

export interface EnqueteOpcao {
  _id: string;
  texto: string;
  votos: number;
}

export interface EnqueteComentario {
  _id: string;
  texto: string;
  createdAt: string;
}

export interface EnqueteProps {
  _id: string;
  titulo: string;
  descricao?: string;
  dataLimite: string;
  opcoes: EnqueteOpcao[];
  comentarios?: EnqueteComentario[];
  onVoto?: (opcaoId: string) => void;
  onComentario?: (texto: string) => Promise<void>;
}

export function EnqueteCard({ titulo, descricao, dataLimite, opcoes, comentarios = [], onVoto, onComentario }: EnqueteProps) {
  const [selectedOpcao, setSelectedOpcao] = useState<string | null>(null);
  const [mostrarComentarios, setMostrarComentarios] = useState(false);
  const [textoComentario, setTextoComentario] = useState("");
  const [enviandoComentario, setEnviandoComentario] = useState(false);

  const totalVotos = opcoes.reduce((acc, curr) => acc + curr.votos, 0);

  const handleSelect = (opcaoId: string) => {
    if (selectedOpcao) return;

    setSelectedOpcao(opcaoId);
    if (onVoto) {
      onVoto(opcaoId);
    }
  };

  const handleComentario = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const texto = textoComentario.trim();
    if (!texto || !onComentario) return;

    try {
      setEnviandoComentario(true);
      await onComentario(texto);
      setTextoComentario("");
    } catch (error) {
      console.error("Erro ao registrar comentário:", error);
      alert("Não foi possível registrar seu comentário. Tente novamente.");
    } finally {
      setEnviandoComentario(false);
    }
  };

  return (
    <Card className="w-full max-w-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge className="flex items-center gap-1 o-xs font-normal o-amber-50 bg-blue-900">
            <Clock className="w-4 h-4 text-amber-50" />
            <span className="text-xs font-bold">{dataLimite}</span>
          </Badge>
          <span className="text-xs text-slate-400 font-bold">
            {totalVotos} {totalVotos === 1 ? "voto" : "votos"}
          </span>
        </div>
        <CardTitle className="text-xl font-semibold text-slate-800 leading-snug">
          {titulo}
        </CardTitle>
        {descricao && (
          <CardDescription className="text-sm text-slate-500">
            {descricao}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-2.5 pb-4">
        {opcoes.map((opcao) => {
          const isSelected = selectedOpcao === opcao._id;
          const percentage =
            totalVotos > 0 ? Math.round((opcao.votos / totalVotos) * 100) : 0;

          return (
            <div
              key={opcao._id}
              onClick={() => handleSelect(opcao._id)}
              className={`relative overflow-hidden rounded-lg border p-3 transition-all duration-150 select-none ${
                selectedOpcao ? "cursor-default" : "cursor-pointer"
              } ${
                isSelected
                  ? "border-blue-600 bg-blue-50/40"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              {/* Barra de Progresso */}
              <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out rounded-l-md ${
                  isSelected ? "bg-blue-200/60" : "bg-slate-200/60"
                }`}
                style={{ width: `${percentage}%` }}
              />

              {/* Informações da Opção */}
              <div className="relative z-10 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                  <span
                    className={`font-medium truncate ${
                      isSelected ? "text-blue-950 font-semibold" : "text-slate-700"
                    }`}
                  >
                    {opcao.texto}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 shrink-0">
                  <span>{percentage}%</span>
                  <span className="text-slate-400 font-normal">
                    ({opcao.votos})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </CardContent>

      <CardFooter className="pt-0 flex-col gap-4">
        <Button
          type="button"
          variant="outline"
          className="w-full bg-blue-900 text-sm font-bold text-amber-50 hover:text-white hover:bg-blue-950 border-transparent"
          aria-expanded={mostrarComentarios}
          onClick={() => setMostrarComentarios((mostrar) => !mostrar)}
        >
          <MessageCircle />
          {mostrarComentarios ? "Ocultar Comentários" : `Ver Comentários (${comentarios.length})`}
        </Button>

        {mostrarComentarios && (
          <div className="w-full space-y-4">
            <div className="max-h-48 space-y-2 overflow-y-auto">
              {comentarios.length === 0 ? (
                <p className="text-center text-sm text-slate-500">
                  Nenhum comentário ainda.
                </p>
              ) : (
                comentarios.map((comentario) => (
                  <div key={comentario._id} className="rounded-lg bg-white p-3 ring-1 ring-slate-200">
                    <p className="text-xs font-bold text-blue-900">Anônimo</p>
                    <p className="mt-1 break-words text-sm text-slate-700">{comentario.texto}</p>
                  </div>
                ))
              )}
            </div>

            <form className="space-y-2" onSubmit={handleComentario}>
              <textarea
                value={textoComentario}
                onChange={(event) => setTextoComentario(event.target.value)}
                placeholder="Escreva um comentário anônimo"
                aria-label="Comentário anônimo"
                rows={3}
                maxLength={500}
                disabled={enviandoComentario}
                className="w-full resize-none rounded-lg border border-slate-300 bg-white p-3 text-sm text-slate-800 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100 disabled:opacity-60"
              />
              <Button
                type="submit"
                className="w-full bg-blue-900 text-amber-50 hover:bg-blue-950"
                disabled={enviandoComentario || !textoComentario.trim()}
              >
                {enviandoComentario ? "Enviando..." : "Comentar anonimamente"}
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
