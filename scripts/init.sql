-- ====================================================================
-- DDL - CRIAÇÃO DAS TABELAS
-- ====================================================================

-- Tabela de Solicitantes
CREATE TABLE IF NOT EXISTS solicitante (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(150) NOT NULL,
    cpf_cnpj VARCHAR(20) UNIQUE NOT NULL
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categoria (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

-- Tabela de Solicitações
CREATE TABLE IF NOT EXISTS solicitacao (
    id SERIAL PRIMARY KEY,
    solicitante_id INT NOT NULL,
    categoria_id INT NOT NULL,
    descricao TEXT,
    valor DECIMAL(15, 2) NOT NULL, -- 15 dígitos no total e 2 para as casas decimais
    data_solicitacao TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    
    -- Chaves Estrangeiras
    CONSTRAINT fk_solicitacao_solicitante FOREIGN KEY (solicitante_id) REFERENCES solicitante(id) ON DELETE RESTRICT, -- Impede que o solicitante seja removido se ele tiver solicitações vinculadas.
    CONSTRAINT fk_solicitacao_categoria FOREIGN KEY (categoria_id) REFERENCES categoria(id) ON DELETE RESTRICT, -- impede que a categoria seja removida se ela tiver solicitações vinculadas.
    
    -- Restrição para garantir que o status seja apenas um dos permitidos pelo fluxo de negócio
    CONSTRAINT chk_status CHECK (
        status IN ('SOLICITADO', 'LIBERADO', 'APROVADO', 'REJEITADO', 'CANCELADO')
    )
);

-- ====================================================================
-- DML - INSERÇÃO DE DADOS INICIAIS
-- ====================================================================

-- Populando Solicitantes (Mínimo de 5 registros)
INSERT INTO solicitante (nome, cpf_cnpj) VALUES
('João da Silva', '111.222.333-44'),
('Maria Oliveira', '555.666.777-88'),
('Empresa XYZ LTDA', '12.345.678/0001-90'),
('Carlos Souza', '999.888.777-66'),
('Tech Solutions S.A.', '98.765.432/0001-10')
ON CONFLICT (cpf_cnpj) DO NOTHING;

-- Populando Categorias (Mínimo de 5 registros)
INSERT INTO categoria (nome) VALUES
('Serviços'),
('Material de Consumo'),
('Transporte'),
('Equipamentos de TI'),
('Manutenção Predial')
ON CONFLICT (id) DO NOTHING;

-- Populando Solicitações Iniciais para facilitar os testes de Consulta
-- Todas iniciam com o status 'SOLICITADO', conforme regra de negócio
INSERT INTO solicitacao (solicitante_id, categoria_id, descricao, valor, status) VALUES
(1, 3, 'Reembolso de Uber para reunião presencial', 125.50, 'SOLICITADO'),
(3, 1, 'Pagamento referente à consultoria de software', 4500.00, 'SOLICITADO'),
(2, 2, 'Compra de resmas de papel para o escritório', 250.00, 'SOLICITADO'),
(5, 4, 'Aquisição de 5 monitores para a equipe de desenvolvimento', 6000.00, 'SOLICITADO'),
(4, 5, 'Conserto do ar-condicionado da sala de reuniões', 850.00, 'SOLICITADO');