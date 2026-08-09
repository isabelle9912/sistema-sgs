**Pré-requisitos:**

- Ter o [Docker](https://docs.docker.com/get-docker/) instalado.
- Ter o [Docker Compose](https://docs.docker.com/compose/install/) instalado.

                    OU

- Ter o npm e java 17 (Vesão utilizada no projeto)
- Portas `80`, `8080` e `5432` liberadas no seu computador.

**Passos para rodar o projeto:**

1. **Clone o repositório e acesse a raiz:**

```bash
git clone https://github.com/isabelle9912/sistema-sgs.git
cd sistema-sgs

```

2. **Verifique os scripts de Banco de Dados:**
   Certifique-se de colocar seus scripts de criação (DDL) e inserção dos 5 registros obrigatórios de Solicitantes e Categorias (DML) dentro da pasta `/scripts`, com o nome `init.sql` caso o arquivo não exista.
3. **Suba os containers:**
   No terminal, na raiz do projeto (onde está o `docker-compose.yml`), execute:

```bash
docker compose up -d --build

```

_O parâmetro `-d` roda em background (detached mode) e o `--build` garante que as imagens sejam compiladas com a versão mais recente do código._

4. **Acesse as aplicações:**

- **Frontend:** Abra seu navegador em `http://localhost:80`
- **Backend (API):** Disponível em `http://localhost:8080`
- **Banco de Dados (Postgres):** Disponível em `localhost:5432` (conecte via DBeaver/PgAdmin usando as credenciais do arquivo `.env`).

5. **Para parar a aplicação:**

```bash
docker compose down

```

_Se quiser remover também o volume do banco de dados (resetar os dados), adicione a flag `-v`: `docker-compose down -v`._

6. Estrutura de Diretórios do Backend

```text
backend/
├── pom.xml
├── Dockerfile
└── src/
    └── main/
        ├── resources/
        │   └── application.yml
        └── java/
            └── com/
                └── sgs/
                    └── sistema/
                        ├── SgsApplication.java
                        │
                        ├── config/
                        │   └── CorsConfig.java
                        │
                        ├── entidade/
                        │   ├── Categoria.java
                        │   ├── Solicitacao.java
                        │   ├── Solicitante.java
                        │   └── StatusSolicitacao.java
                        │
                        ├── dto/
                        │   ├── SolicitacaoRequestDTO.java
                        │   ├── SolicitacaoResponseDTO.java
                        │   └── StatusUpdateRequestDTO.java
                        │
                        ├── repository/
                        │   ├── CategoriaRepository.java
                        │   ├── SolicitacaoRepository.java
                        │   ├── SolicitanteRepository.java
                        │   └── projection/
                        │       └── SolicitacaoResumoProjection.java
                        │
                        ├── exception/
                        │   ├── GlobalExceptionHandler.java
                        │   └── RegraNegocioException.java
                        │
                        ├── service/
                        │   └── SolicitacaoService.java
                        │
                        └── controller/
                            └── SolicitacaoController.java

```

7. Estrutura de diretórios do Frontend

```text
frontend/
├── src/
    ├── components/
    │   ├── layout/
    │   │   └── Footer.tsx
    │   │   └── Header.tsx
    │   │   └── Layout.tsx
    │   │
    │   └── ui/
    │       ├── Button.tsx
    │       ├── Card.tsx
    │       ├── ErrorFallBack.tsx
    │       ├── FiltrosSolicitacoes.tsx
    │       ├── Input.tsx
    │       ├── Loading.tsx
    │       ├── Select.tsx
    │
    ├── pages/
    │   ├── CadastroSolicitacoes.tsx
    │   ├── DetalheSolicitacao.tsx
    │   └── ListarSolicitacoes.tsx
    │
    ├── services/
    │   └── api.ts
    │   └── categoriaService.ts
    │   └── solicitacaoService.ts
    │   └── solicitanteService.ts
    │
    ├── types/
    │   └── categoria.ts
    │   └── solicitacao.ts
    │   └── solicitante.ts
    │
    └── utils/
        ├── constants.ts
        ├── formatters.ts
        └── solicitacaoStatus.ts
    ├── .env
    ├── App.tsx
    ├── index.css
    ├── main.tsx

```

8. Extras:

   O arquivo DER.png contém o diagrama de entidades e relacionamentos do projeto.
   o arquivo insomnia-routes.yaml contém as rotas e variáveis para facilitar o teste da api.
