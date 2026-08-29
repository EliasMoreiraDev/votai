"use client";

import  { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, Circle } from "lucide-react";

export interface EnqueteOpcao {
  id: string;
  text: string;
  votos: number;
}

export interface EnqueteProps {
  id: string;
  title: string;
  deadline: string;
  opcoes: EnqueteOpcao[];
  onVoto?: (opcaoId: string) => void;
}

export function EnqueteCard({ id, title, deadline, opcoes, onVoto }: EnqueteProps) {
  const [selectedOpcao, setSelectedOpcao] = useState<string | null>(null);

  const totalVotos = opcoes.reduce((acc, curr) => acc + curr.votos, 0);

  const handleSelect = (opcaoId: string) => {
    setSelectedOpcao(opcaoId);
    if (onVoto) {
      onVoto(opcaoId);
    }
  };

  return (
    <Card className="w-full max-w-md border border-slate-200 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
      
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2 mb-2">
          <Badge
            className="flex items-center gap-1 text-xs font-normal text-amber-50 bg-blue-900"
          >
            <Clock className="w-5 h-5 text-ambar-50" />
            <span className="text-xm font-bold">{deadline}</span>
          </Badge>
          <span className="text-xm  text-slate-400 font-bold">
            {totalVotos} {totalVotos === 1 ? "voto" : "votos"}
          </span>
        </div>
        <CardTitle className="text-xl font-semibold text-slate-800 leading-snug">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2.5 pb-4">
        {opcoes.map((opcao) => {
          const isSelected = selectedOpcao === opcao.id;
          const percentage =
            totalVotos > 0 ? Math.round((opcao.votos / totalVotos) * 100) : 0;

          return (
            <div
              key={opcao.id}
              onClick={() => handleSelect(opcao.id)}
              className={`relative overflow-hidden rounded-lg border p-3 cursor-pointer transition-all duration-150 select-none ${
                isSelected
                  ? "border-sky-500 bg-sky-50/40"
                  : "border-slate-200 hover:border-slate-300 bg-slate-50/50"
              }`}
            >
              <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-500 ease-out rounded-l-md ${
                  isSelected ? "bg-sky-200/50" : "bg-slate-200/60"
                }`}
                style={{ width: `${percentage}%` }}
              />

              <div className="relative z-10 flex items-center justify-between gap-3 text-sm">
                <div className="flex items-center gap-2.5 min-w-0">
                  {isSelected ? (
                    <CheckCircle2 className="w-4 h-4 text-blue-800 shrink-0" />
                  ) : (
                    <Circle className="w-4 h-4 text-blue-700 shrink-0" />
                  )}
                  <span
                    className={`font-medium truncate ${
                      isSelected ? "text-sky-950" : "text-slate-700"
                    }`}
                  >
                    {opcao.text}
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

    <Button
        variant="outline"
        className="w-[80%] m-auto p-5 bg-blue-900 text-xm font-bold text-amber-50 hover:text-slate-900 border-slate-200 hover:bg-slate-100"
    >
        Ver Comentários
    </Button>
    </Card>
  );
}