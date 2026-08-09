import React, { useEffect, useState } from "react";
import { CalendarDays, FileText, Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
  type ListarSolicitacoesParams,
  type Solicitacao,
  type StatusSolicitacao,
} from "../types/solicitacao";
import type { Categoria } from "../types/categoria";
import { solicitacaoService } from "../services/solicitacaoService";
import { categoriaService } from "../services/categoriaService";
import { Card } from "../components/ui/Card";
import { FiltrosSolicitacoes } from "../components/ui/FiltrosSolicitacoes";
import {
  displayValue,
  formatCpfCnpj,
  formatDateToPtBR,
} from "../utils/formatters";
import { STATUS_COLORS } from "../utils/constants";

const ListarSolicitacoes: React.FC = () => {
  const [solicitacoes, setSolicitacoes] = useState<Solicitacao[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [status, setStatus] = useState<StatusSolicitacao | "">(
    (searchParams.get("status") as StatusSolicitacao) || "",
  );

  const [categoriaId, setCategoriaId] = useState(
    searchParams.get("categoriaId") || "",
  );

  const [dataInicio, setDataInicio] = useState(
    searchParams.get("dataInicio") || "",
  );

  const [dataFim, setDataFim] = useState(searchParams.get("dataFim") || "");

  const fetchSolicitacoes = async (
    filtroStatus: StatusSolicitacao | "" = status,
    filtroCategoriaId: string = categoriaId,
    filtroDataInicio: string = dataInicio,
    filtroDataFim: string = dataFim,
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params: ListarSolicitacoesParams = {};

      if (filtroStatus) params.status = filtroStatus;
      if (filtroCategoriaId) params.categoriaId = Number(filtroCategoriaId);
      if (filtroDataInicio) params.dataInicio = filtroDataInicio;
      if (filtroDataFim) params.dataFim = filtroDataFim;

      const response = await solicitacaoService.listarSolicitacoes(params);
      setSolicitacoes(response);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro ao carregar solicitações.",
      );
    } finally {
      setLoading(false);
    }
  };

  const carregarCategorias = async () => {
    try {
      const response = await categoriaService.listarCategorias();
      setCategorias(response);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const handleFiltrar = () => {
    const params = new URLSearchParams();

    if (status) params.set("status", status);
    if (categoriaId) params.set("categoriaId", categoriaId);
    if (dataInicio) params.set("dataInicio", dataInicio);
    if (dataFim) params.set("dataFim", dataFim);

    setSearchParams(params);
    fetchSolicitacoes(status, categoriaId, dataInicio, dataFim);
  };

  const handleLimparFiltros = () => {
    setStatus("");
    setCategoriaId("");
    setDataInicio("");
    setDataFim("");

    setSearchParams({});
    // Dispara a busca com valores vazios
    fetchSolicitacoes("", "", "", "");
  };

  useEffect(() => {
    carregarCategorias();
    fetchSolicitacoes(status, categoriaId, dataInicio, dataFim);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading && solicitacoes.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-6xl">
          <Card>
            <div className="flex min-h-80 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
                <p className="text-sm text-slate-400">
                  Carregando solicitações...
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  if (error && solicitacoes.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
        <div className="mx-auto max-w-6xl">
          <Card>
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
                <FileText className="h-7 w-7 text-red-400" />
              </div>

              <h2 className="text-lg font-semibold text-white">
                Não foi possível carregar as solicitações
              </h2>

              <p className="mt-2 max-w-md text-sm text-slate-400">{error}</p>

              <button
                type="button"
                onClick={() => window.location.reload()}
                className="mt-6 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
              >
                Tentar novamente
              </button>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-6xl">
        {/* Cabeçalho */}
        <header className="mb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-cyan-400">
                Gestão
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Solicitações
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Visualize e acompanhe todas as solicitações cadastradas.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/50 px-4 py-2.5">
              <FileText className="h-5 w-5 text-cyan-400" />
              <span className="text-sm text-slate-400">Total:</span>
              <span className="font-semibold text-white">
                {solicitacoes.length}
              </span>
            </div>
          </div>
        </header>

        {/* Componente de Filtros */}
        <div className="mb-6">
          <FiltrosSolicitacoes
            status={status}
            categoriaId={categoriaId}
            dataInicio={dataInicio}
            dataFim={dataFim}
            categorias={categorias}
            onStatusChange={setStatus}
            onCategoriaChange={setCategoriaId}
            onDataInicioChange={setDataInicio}
            onDataFimChange={setDataFim}
            onFiltrar={handleFiltrar}
            onLimpar={handleLimparFiltros}
            loading={loading}
          />
        </div>

        {/* Tabela de Resultados */}
        {solicitacoes.length === 0 ? (
          <Card>
            <div className="flex min-h-80 flex-col items-center justify-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-800">
                <FileText className="h-7 w-7 text-slate-500" />
              </div>

              <h2 className="text-lg font-semibold text-white">
                Nenhuma solicitação encontrada
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Altere os filtros acima ou aguarde novos cadastros no sistema.
              </p>
            </div>
          </Card>
        ) : (
          <Card>
            <div className="relative overflow-x-auto">
              {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-slate-900/50 backdrop-blur-sm">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-700 border-t-cyan-400" />
                </div>
              )}
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr className="border-b border-slate-700 bg-slate-800/60">
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      ID
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Categoria
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Solicitante
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Status
                    </th>
                    <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Data
                    </th>
                    <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Ações
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800">
                  {solicitacoes.map((solicitacao) => {
                    const statusColor =
                      STATUS_COLORS[
                        solicitacao.status as keyof typeof STATUS_COLORS
                      ];

                    return (
                      <tr
                        key={solicitacao.id}
                        onClick={() => navigate(`/detalhes/${solicitacao.id}`)}
                        className="group cursor-pointer transition hover:bg-slate-800/50"
                      >
                        <td className="px-5 py-4">
                          <span className="font-mono text-sm text-slate-400">
                            #{solicitacao.id}
                          </span>
                        </td>

                        <td className="max-w-xs px-5 py-4">
                          <p className="truncate font-medium text-slate-100">
                            {solicitacao.categoriaNome || "Sem categoria"}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="font-medium text-slate-200">
                              {displayValue(solicitacao.solicitanteNome)}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {solicitacao.solicitanteDocumento
                                ? formatCpfCnpj(
                                    solicitacao.solicitanteDocumento,
                                  )
                                : displayValue(
                                    solicitacao.solicitanteDocumento,
                                  )}
                            </p>
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className="inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold"
                            style={{
                              color: statusColor,
                              borderColor: `${statusColor}40`,
                              backgroundColor: `${statusColor}15`,
                            }}
                          >
                            {displayValue(solicitacao.status)}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 text-sm text-slate-400">
                            <CalendarDays className="h-4 w-4 text-slate-500" />
                            <span>
                              {solicitacao.dataSolicitacao
                                ? formatDateToPtBR(solicitacao.dataSolicitacao)
                                : "—"}
                            </span>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(`/detalhes/${solicitacao.id}`);
                            }}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm font-medium text-slate-300 opacity-70 transition group-hover:border-cyan-400/50 group-hover:text-cyan-400 group-hover:opacity-100 hover:border-cyan-400 hover:text-cyan-400"
                          >
                            <Eye className="h-4 w-4" />
                            Ver
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        )}
      </section>
    </main>
  );
};

export default ListarSolicitacoes;
