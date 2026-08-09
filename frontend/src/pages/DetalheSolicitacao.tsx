import React, { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, FileText, User } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import type { Solicitacao, StatusSolicitacao } from "../types/solicitacao";
import {
  displayValue,
  formatCpfCnpj,
  formatCurrencyBRL,
  formatDateToPtBR,
} from "../utils/formatters";
import { solicitacaoService } from "../services/solicitacaoService";
import { Card } from "../components/ui/Card";
import Loading from "../components/ui/Loading";
import { Select } from "../components/ui/Select";
import { Button } from "../components/ui/Button";
import { ErrorFallBack } from "../components/ui/ErrorFallBack";
import {
  obterStatusDisponiveis,
  podeAlterarStatus,
} from "../utils/solicitacaoStatus";
import { STATUS_COLORS } from "../utils/constants";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

const InfoItem = ({ label, value }: InfoItemProps) => {
  return (
    <div className="rounded-xl border border-slate-700/70 bg-slate-800/50 p-4">
      <dt className="mb-1 text-sm font-medium text-slate-400">{label}</dt>

      <dd className="text-base font-medium text-slate-100">{value}</dd>
    </div>
  );
};

const DetalheSolicitacao: React.FC = () => {
  const [solicitacao, setSolicitacao] = useState<Solicitacao | null>(null);
  const [novoStatus, setNovoStatus] = useState<StatusSolicitacao | "">("");
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSolicitacao = async () => {
      if (!id) {
        setError("ID da solicitação não fornecido.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const response = await solicitacaoService.detalharSolicitacao(id);

        setSolicitacao(response);
        setNovoStatus(response.status);
      } catch (error) {
        console.error("Erro ao carregar solicitação:", error);

        setError(
          "Não foi possível carregar os dados da solicitação. Tente novamente mais tarde.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSolicitacao();
  }, [id]);

  const handleAtualizarStatus = async () => {
    if (!id || !solicitacao || !novoStatus) {
      return;
    }

    const statusAtual = solicitacao.status;

    const transicaoValida = podeAlterarStatus(statusAtual, novoStatus);

    if (!transicaoValida) {
      setError(
        `Não é permitido alterar o status de "${statusAtual}" para "${novoStatus}".`,
      );

      return;
    }

    try {
      setUpdatingStatus(true);
      setError(null);

      const response = await solicitacaoService.atualizarStatus(id, {
        status: novoStatus,
      });

      setSolicitacao(response);
      setNovoStatus("");
    } catch (err) {
      console.error("Erro ao atualizar status:", err);

      setError("Não foi possível atualizar o status da solicitação.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const statusPermitidos = solicitacao
    ? obterStatusDisponiveis(solicitacao.status as StatusSolicitacao)
    : [];

  const statusOptions = statusPermitidos.map((status) => ({
    value: status,
    label: status,
  }));

  if (loading) {
    return <Loading title="Carregando detalhes da solicitação..." />;
  }

  if (error) {
    return (
      <ErrorFallBack error={error} onRetry={() => window.location.reload()} />
    );
  }

  if (!solicitacao) {
    return null;
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <section className="mx-auto max-w-4xl">
        {/* Cabeçalho */}
        <header className="mb-6">
          <button
            type="button"
            onClick={() => navigate("/listagem")}
            className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-400 transition hover:text-cyan-400"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para listagem
          </button>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="mb-2 text-sm font-medium uppercase tracking-wider text-cyan-400">
                Solicitação
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-white">
                Detalhes da Solicitação
              </h1>

              <p className="mt-2 text-sm text-slate-400">
                Visualize todas as informações da solicitação selecionada.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">ID</span>

              <span className="rounded-lg bg-slate-800 px-3 py-1.5 font-mono text-sm text-slate-300">
                #{solicitacao.id}
              </span>
            </div>
          </div>
        </header>

        <Card>
          {/* Resumo */}
          <div className="border-b border-slate-700/70 p-6">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-500/10">
                  <FileText className="h-6 w-6 text-cyan-400" />
                </div>

                <div>
                  <p className="text-sm text-slate-400">
                    Solicitação #{solicitacao.id}
                  </p>

                  <p className="mt-1 text-lg font-semibold text-white">
                    {solicitacao.categoriaNome || "Sem categoria"}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                    Status atual
                  </p>

                  <span
                    className="inline-flex items-center rounded-full border px-3 py-2 text-sm font-semibold"
                    style={{
                      color: STATUS_COLORS[solicitacao.status],
                      borderColor: `${STATUS_COLORS[solicitacao.status]}40`,
                      backgroundColor: `${STATUS_COLORS[solicitacao.status]}15`,
                    }}
                  >
                    <span
                      className="mr-2 h-2 w-2 rounded-full"
                      style={{
                        backgroundColor: STATUS_COLORS[solicitacao.status],
                      }}
                    />
                    {solicitacao.status}
                  </span>
                </div>

                {statusOptions.length > 0 && (
                  <div className="flex items-end gap-3">
                    <Select
                      id="status"
                      label="Alterar para"
                      aria-label="Novo status da solicitação"
                      value={novoStatus}
                      onChange={(event) =>
                        setNovoStatus(event.target.value as StatusSolicitacao)
                      }
                      options={statusOptions}
                      placeholder="Selecione"
                      className="min-w-40"
                    />
                    {novoStatus !== solicitacao.status && novoStatus && (
                      <Button
                        type="button"
                        onClick={handleAtualizarStatus}
                        disabled={updatingStatus}
                        className="rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updatingStatus ? "Salvando..." : "Salvar"}
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Informações */}
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <User className="h-5 w-5 text-cyan-400" />

              <h2 className="text-lg font-semibold text-white">
                Informações do solicitante
              </h2>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Solicitante"
                value={displayValue(solicitacao.solicitanteNome)}
              />

              <InfoItem
                label="Documento"
                value={formatCpfCnpj(solicitacao.solicitanteDocumento)}
              />

              <InfoItem
                label="ID do Solicitante"
                value={solicitacao.solicitanteId}
              />

              <InfoItem
                label="Categoria"
                value={solicitacao.categoriaNome || "Não informada"}
              />
            </dl>

            {/* Dados da solicitação */}
            <div className="mb-5 mt-8 flex items-center gap-3">
              <CalendarDays className="h-5 w-5 text-cyan-400" />

              <h2 className="text-lg font-semibold text-white">
                Dados da solicitação
              </h2>
            </div>

            <dl className="grid gap-4 sm:grid-cols-2">
              <InfoItem
                label="Valor"
                value={formatCurrencyBRL(solicitacao.valor)}
              />

              <InfoItem
                label="Data da solicitação"
                value={formatDateToPtBR(solicitacao.dataSolicitacao)}
              />
            </dl>

            {/* Descrição */}
            <div className="mt-8">
              <h2 className="mb-3 text-lg font-semibold text-white">
                Descrição
              </h2>

              <div className="rounded-xl border border-slate-700/70 bg-slate-800/50 p-5">
                <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                  {solicitacao.descricao || "Nenhuma descrição informada."}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </section>
    </main>
  );
};

export default DetalheSolicitacao;
