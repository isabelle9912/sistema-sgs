import React from "react";
import { Search, X } from "lucide-react";
import type { StatusSolicitacao } from "../../types/solicitacao";
import { Select } from "./Select";
import { Button } from "./Button";

interface Categoria {
  id: number;
  nome: string;
}

interface Option {
  value: string;
  label: string;
}

interface FiltrosSolicitacoesProps {
  status: StatusSolicitacao | "";
  categoriaId: string;
  dataInicio: string;
  dataFim: string;

  categorias: Categoria[];

  onStatusChange: (status: StatusSolicitacao | "") => void;
  onCategoriaChange: (categoriaId: string) => void;
  onDataInicioChange: (data: string) => void;
  onDataFimChange: (data: string) => void;

  onFiltrar: () => void;
  onLimpar: () => void;

  loading?: boolean;
}

export const FiltrosSolicitacoes = ({
  status,
  categoriaId,
  dataInicio,
  dataFim,
  categorias,
  onStatusChange,
  onCategoriaChange,
  onDataInicioChange,
  onDataFimChange,
  onFiltrar,
  onLimpar,
  loading = false,
}: FiltrosSolicitacoesProps) => {
  const statusOptions: Option[] = [
    { value: "SOLICITADO", label: "Solicitado" },
    { value: "LIBERADO", label: "Liberado" },
    { value: "APROVADO", label: "Aprovado" },
    { value: "REJEITADO", label: "Rejeitado" },
    { value: "CANCELADO", label: "Cancelado" },
  ];

  const categoriaOptions: Option[] = categorias.map((categoria) => ({
    value: String(categoria.id),
    label: categoria.nome,
  }));

  return (
    <div className="rounded-2xl border border-slate-700/70 bg-slate-900/60 p-5">
      <div className="mb-5 flex items-center gap-3">
        <Search className="h-5 w-5 text-cyan-400" />

        <div>
          <h2 className="font-semibold text-white">Filtrar solicitações</h2>

          <p className="text-sm text-slate-400">
            Refine a listagem utilizando os filtros abaixo.
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Select
          id="filtro-status"
          label="Status"
          value={status}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            onStatusChange(event.target.value as StatusSolicitacao | "")
          }
          options={statusOptions}
          placeholder="Todos os status"
        />

        <Select
          id="filtro-categoria"
          label="Categoria"
          value={categoriaId}
          onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
            onCategoriaChange(event.target.value)
          }
          options={categoriaOptions}
          placeholder="Todas as categorias"
        />

        <div>
          <label
            htmlFor="dataInicio"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Data inicial
          </label>

          <input
            id="dataInicio"
            type="datetime-local"
            value={dataInicio}
            onChange={(event) => onDataInicioChange(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>

        <div>
          <label
            htmlFor="dataFim"
            className="mb-2 block text-sm font-medium text-slate-300"
          >
            Data final
          </label>

          <input
            id="dataFim"
            type="datetime-local"
            value={dataFim}
            onChange={(event) => onDataFimChange(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          />
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          onClick={onLimpar}
          disabled={loading}
          className="border border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white"
        >
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>

        <Button
          type="button"
          onClick={onFiltrar}
          disabled={loading}
          className="bg-cyan-500 text-slate-950 hover:bg-cyan-400"
        >
          <Search className="mr-2 h-4 w-4" />
          {loading ? "Filtrando..." : "Filtrar"}
        </Button>
      </div>
    </div>
  );
};
