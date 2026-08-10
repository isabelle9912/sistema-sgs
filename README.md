**Pré-requisitos:**

- Ter o [Docker](https://docs.docker.com/get-docker/) instalado.
- Ter o [Docker Compose](https://docs.docker.com/compose/install/) instalado.

**OU**

- Ter o npm e java 17 (Vesão utilizada no projeto)
- Portas `80`, `8080` e `5432` liberadas no seu computador.

**Passos para rodar o projeto:**

1. **Clone o repositório e acesse a raiz:**

```bash
git clone https://github.com/isabelle9912/sistema-sgs.git
cd sistema-sgs

```

### 2. Configure as variáveis de ambiente

Antes de subir os containers, é necessário criar os arquivos `.env` do **frontend** e do **backend**.

#### 2.1. Variáveis de ambiente do Frontend

Crie o arquivo:

```text
/frontend/.env
```

Adicione o seguinte conteúdo:

```env
VITE_API_URL=http://localhost:8080/api
```

Essa variável define a URL base utilizada pelo frontend para realizar as requisições à API.

---

#### 2.2. Variáveis de ambiente do Backend

Crie o arquivo:

```text
/backend/.env
```

Adicione:

```env
# Configurações do Banco de Dados PostgreSQL
DB_NAME=sgs_database
DB_USER=sgs_user
DB_PASSWORD=sgs_password_123

# Configurações do Backend
BACKEND_PORT=8080

# Configurações do Frontend
FRONTEND_PORT=80
VITE_API_URL=http://localhost:8080
```

> **Importante:** os valores acima devem ser mantidos de acordo com as configurações utilizadas pelo `docker-compose.yml` e pela aplicação.
>
> Caso alguma porta ou credencial seja alterada, verifique se a alteração também foi realizada nas configurações correspondentes.

Ao final dessa etapa, a estrutura deverá estar semelhante a:

```text
sistema-sgs/
├── backend/
│   └── .env
│
├── frontend/
│   └── .env
│
├── scripts/
│   └── init.sql
│
└── docker-compose.yml
```

### 3. **Verifique os scripts de Banco de Dados:**

Certifique-se de colocar seus scripts de criação (DDL) e inserção dos 5 registros obrigatórios de Solicitantes e Categorias (DML) dentro da pasta `/scripts`, com o nome `init.sql` caso o arquivo não exista.

### 4. **Suba os containers:**

No terminal, na raiz do projeto (onde está o `docker-compose.yml`), execute:

```bash
docker compose up -d --build

```

_O parâmetro `-d` roda em background (detached mode) e o `--build` garante que as imagens sejam compiladas com a versão mais recente do código._

### 5. **Acesse as aplicações:**

- **Frontend:** Abra seu navegador em `http://localhost:80`
- **Backend (API):** Disponível em `http://localhost:8080`
- **Banco de Dados (Postgres):** Disponível em `localhost:5432` (conecte via DBeaver/PgAdmin usando as credenciais do arquivo `.env`).

### 6. **Para parar a aplicação:**

```bash
docker compose down

```

_Se quiser remover também o volume do banco de dados (resetar os dados), adicione a flag `-v`: `docker-compose down -v`._

### 7. Estrutura de Diretórios do Backend

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

### 8. Estrutura de diretórios do Frontend

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

---

## 9. Extras

O projeto possui alguns arquivos adicionais para facilitar a utilização e os testes:

### DER

O arquivo `DER.png` contém o **Diagrama de Entidade-Relacionamento (DER)** do projeto, apresentando as entidades, seus atributos e os relacionamentos existentes entre elas.

### Insomnia

O arquivo `insomnia-routes.yaml` contém as **rotas da API e suas respectivas variáveis**, facilitando a importação e realização dos testes utilizando o Insomnia.

---

## Observações

Caso ocorram problemas durante a inicialização dos containers, verifique:

1. Se as portas `80`, `8080` e `5432` estão disponíveis.
2. Se os arquivos `.env` foram criados nos diretórios corretos.
3. Se as credenciais do banco estão iguais às utilizadas no `docker-compose.yml`.
4. Se o arquivo `/scripts/init.sql` existe e contém os scripts necessários.
5. Se os containers foram inicializados corretamente utilizando:

```bash
docker compose ps
```

Para reconstruir completamente as imagens após alterações no código:

```bash
docker compose up -d --build
```
