import { FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card } from "./Card";

interface ErrorFallBackProps {
  error: string;
  onRetry?: () => void;
  redirectTo?: string;
}

export function ErrorFallBack({
  error,
  onRetry,
  redirectTo = "/listagem",
}: ErrorFallBackProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onRetry) {
      onRetry();
    } else {
      navigate(redirectTo);
    }
  };

  return (
    <Card>
      <div className="flex min-h-80 flex-col items-center justify-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10">
          <FileText className="h-7 w-7 text-red-400" />
        </div>

        <h2 className="text-lg font-semibold text-slate-100">
          Não foi possível carregar a solicitação
        </h2>

        <p className="mt-2 max-w-md text-sm text-slate-400">{error}</p>

        <button
          type="button"
          onClick={handleClick}
          className="mt-6 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-200 transition hover:border-cyan-400 hover:text-cyan-400"
        >
          {onRetry ? "Tentar novamente" : "Voltar para listagem"}
        </button>
      </div>
    </Card>
  );
}
