import React from "react";
import { Link } from "react-router-dom";

export const Header: React.FC = () => {
  return (
    <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="text-xl font-bold text-white tracking-tight">
          Sistema de Gestão de Solicitações
        </div>
        <nav className="flex gap-4">
          <Link
            to="/"
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Listar
          </Link>
          <Link
            to="/cadastro"
            className="text-slate-300 hover:text-cyan-400 transition"
          >
            Nova Solicitação
          </Link>
        </nav>
      </div>
    </header>
  );
};
