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
import { Clock, CheckCircle2, Circle } from "lucide-react";

export interface EnqueteOpcao {
  _id: string;
  texto: string;
  votos: number;
}

export interface EnqueteProps {
  _id: string;
  titulo: string;
  descricao?: string;
  dataLimite: string;
  opcoes: EnqueteOpcao[];
  onVoto?: (opcaoId: string) => void;
}

export function EnqueteCard({ _id, titulo, descricao, dataLimite, opcoes, onVoto }: EnqueteProps) {
  const [selectedOpcao, setSelectedOpcao] = useState<string | null>(null);

  const totalVotos = opcoes.reduce((acc, curr) => acc + curr.votos, 0);

  const handleSelect = (opcaoId: string) => {
    if (selectedOpcao) return;

    setSelectedOpcao(opcaoId);
    if (onVoto) {
      onVoto(opcaoId);
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

      <CardFooter className="pt-0">
        <Button
          variant="outline"
          className="w-full bg-blue-900 text-sm font-bold text-amber-50 hover:text-white hover:bg-blue-950 border-transparent"
        >
          Ver Comentários
        </Button>
      </CardFooter>
    </Card>
  );
}