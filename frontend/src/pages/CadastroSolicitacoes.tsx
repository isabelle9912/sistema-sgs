import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { CreateSolicitacaoPayload } from "../types/solicitacao";
import type { Solicitante } from "../types/solicitante";
import type { Categoria } from "../types/categoria";
import { solicitanteService } from "../services/solicitanteService";
import { categoriaService } from "../services/categoriaService";
import { solicitacaoService } from "../services/solicitacaoService";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Select";

const CadastroSolicitacoes: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSolicitacaoPayload>({
    defaultValues: {
      solicitanteId: 0,
      categoriaId: 0,
      descricao: "",
      valor: 0,
      dataSolicitacao: null,
    },
  });

  const [solicitantes, setSolicitantes] = useState<Solicitante[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadSolicitantes();
    loadCategorias();
  }, []);

  const loadSolicitantes = async () => {
    try {
      const solicitantes = await solicitanteService.listarSolicitantes();
      setSolicitantes(solicitantes);
    } catch (error) {
      console.error("Erro ao carregar solicitantes:", error);
    }
  };

  const loadCategorias = async () => {
    try {
      const categorias = await categoriaService.listarCategorias();
      setCategorias(categorias);
    } catch (error) {
      console.error("Erro ao carregar categorias:", error);
    }
  };

  const onSubmit = async (data: CreateSolicitacaoPayload) => {
    setLoading(true);
    setMessage("");

    try {
      console.log(data);
      const response = await solicitacaoService.criarSolicitacao(data);

      if (!response) {
        throw new Error("Erro ao cadastrar solicitação");
      }

      setMessage("Solicitação cadastrada com sucesso!");
      reset();
    } catch (error) {
      setMessage("Erro ao cadastrar solicitação. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  };

  const messageClasses = message.includes("sucesso")
    ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
    : "border-red-500/30 bg-red-500/10 text-red-300";

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-2xl flex-col rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30 backdrop-blur">
        <h1 className="mb-8 text-3xl font-semibold tracking-tight text-white">
          Cadastro de Solicitação
        </h1>

        {message && (
          <div
            className={`mb-6 rounded-xl border px-4 py-3 text-sm ${messageClasses}`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Select
            id="solicitanteId"
            label="Solicitante"
            options={solicitantes.map((sol) => ({
              value: sol.id,
              label: sol.nome,
            }))}
            placeholder="Selecione um solicitante"
            error={errors.solicitanteId?.message}
            {...register("solicitanteId", {
              required: "Solicitante é obrigatório",
              validate: (value) => value !== 0 || "Selecione um solicitante",
            })}
          />
          {errors.solicitanteId && (
            <span className="text-sm text-red-400">
              {errors.solicitanteId.message}
            </span>
          )}

          <Select
            id="categoriaId"
            label="Categoria"
            options={categorias.map((cat) => ({
              value: cat.id,
              label: cat.nome,
            }))}
            placeholder="Selecione uma categoria"
            error={errors.categoriaId?.message}
            {...register("categoriaId", {
              required: "Categoria é obrigatória",
              validate: (value) => value !== 0 || "Selecione uma categoria",
            })}
          />
          {errors.categoriaId && (
            <span className="text-sm text-red-400">
              {errors.categoriaId.message}
            </span>
          )}

          <div className="space-y-2">
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-slate-300"
            >
              Descrição *
            </label>
            <textarea
              id="descricao"
              {...register("descricao", {
                required: "Descrição é obrigatória",
                minLength: {
                  value: 10,
                  message: "Descrição deve ter no mínimo 10 caracteres",
                },
              })}
              placeholder="Digite a descrição da solicitação"
              className={`min-h-32 w-full rounded-xl border bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 ${
                errors.descricao ? "border-red-500" : "border-slate-700"
              }`}
              rows={5}
            />
            {errors.descricao && (
              <span className="text-sm text-red-400">
                {errors.descricao.message}
              </span>
            )}
          </div>

          <Input
            id="valor"
            type="number"
            label="Valor *"
            step="0.01"
            {...register("valor", {
              required: "Valor é obrigatório",
              min: {
                value: 0,
                message: "Valor deve ser maior que 0",
              },
            })}
            placeholder="0.00"
          />
          {errors.valor && (
            <span className="text-sm text-red-400">{errors.valor.message}</span>
          )}

          <Input
            id="dataSolicitacao"
            label="Data"
            type="datetime-local"
            {...register("dataSolicitacao")}
            className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20"
          />
          {errors.dataSolicitacao && (
            <span className="text-sm text-red-400">
              {errors.dataSolicitacao.message}
            </span>
          )}

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Cadastrando..." : "Cadastrar Solicitação"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => reset()}
              disabled={loading}
            >
              Limpar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CadastroSolicitacoes;
