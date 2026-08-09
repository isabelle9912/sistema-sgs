import React from "react";

export const Footer: React.FC = () => (
  <footer className="border-t border-slate-800 mt-auto py-6 text-center text-slate-500 text-sm">
    <p>
      &copy; {new Date().getFullYear()} SGS - Sistema de Gestão de Solicitações.
      Todos os direitos reservados.
    </p>
  </footer>
);
