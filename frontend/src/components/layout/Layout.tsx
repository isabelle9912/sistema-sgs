import React from "react";
import { Outlet } from "react-router-dom";
import { Header } from "./Header";
import { Footer } from "./Footer";

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100">
      <Header />
      <main className="flex-1 container mx-auto p-4 sm:p-6 lg:p-8">
        {/* O Outlet renderizará a rota atual (Cadastro, Listagem, etc) */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};
