import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

import CadastroSolicitacoes from "./pages/CadastroSolicitacoes";
import ListarSolicitacoes from "./pages/ListarSolicitacoes";
import DetalheSolicitacao from "./pages/DetalheSolicitacao";
import { Layout } from "./components/layout/Layout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Rota principal: redireciona para a listagem */}
          <Route path="/" element={<Navigate to="/listagem" replace />} />

          {/* Rota da Listagem */}
          <Route path="/listagem" element={<ListarSolicitacoes />} />

          {/* Rota de Cadastro */}
          <Route path="/cadastro" element={<CadastroSolicitacoes />} />

          {/* Rota de Detalhes */}
          <Route path="/detalhes/:id" element={<DetalheSolicitacao />} />

          {/* Rota de fallback */}
          <Route path="*" element={<div>Página não encontrada (404)</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
