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

#### 2.2. Variáveis de ambiente da raiz

Crie o arquivo:

```text
.env
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
│
├── frontend/
│   └── .env
│
├── scripts/
│   └── init.sql
│
└── docker-compose.yml
|── .env
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

## Testes

O projeto possui testes utilizando **JUnit 6**, **Mockito** e os recursos de teste do **Spring Boot**.

Os testes têm como objetivo validar as principais regras de negócio da aplicação e garantir que a camada de Controller responda corretamente às requisições HTTP, sem a necessidade de utilizar um banco de dados real durante os testes.

### 1. Testes unitários — `SolicitacaoServiceTest`

Os testes da classe `SolicitacaoServiceTest` têm como objetivo validar as **regras de negócio relacionadas à alteração do status de uma solicitação**.

Para isso, os repositórios são simulados utilizando Mockito:

```java
@Mock
private SolicitacaoRepository solicitacaoRepository;

@Mock
private SolicitanteRepository solicitanteRepository;

@Mock
private CategoriaRepository categoriaRepository;
```

O `@InjectMocks` cria uma instância real do `SolicitacaoService` e injeta nela os mocks dos repositórios:

```java
@InjectMocks
private SolicitacaoService solicitacaoService;
```

Dessa forma, o teste consegue executar a lógica real do Service sem realizar consultas ou alterações em um banco de dados.

#### Teste de transição válida

O teste:

```text
deveAtualizarStatusComSucesso
```

verifica se uma solicitação com status `SOLICITADO` pode ser alterada para `LIBERADO`.

O teste simula uma solicitação existente no banco:

```text
SOLICITADO → LIBERADO
```

Em seguida, executa o método `atualizarStatus()` e verifica se:

- O status foi alterado corretamente para `LIBERADO`;
- O método `save()` do repositório foi chamado;
- A solicitação foi efetivamente preparada para ser persistida.

Esse teste garante que uma **transição de status permitida pela regra de negócio** seja executada corretamente.

#### Teste de transição inválida

O teste:

```text
deveBararTransicaoInvalida
```

verifica o comportamento quando é solicitada uma alteração de status que não é permitida.

Nesse caso, a solicitação está em:

```text
SOLICITADO
```

e tenta avançar diretamente para:

```text
APROVADO
```

Essa transição não é permitida, pois a solicitação deveria passar primeiro por `LIBERADO`.

O teste verifica se:

- Uma `RegraNegocioException` é lançada;
- A mensagem retornada identifica a transição como inválida;
- O método `save()` **não é chamado**.

Assim, o teste garante que o Service impeça que uma solicitação avance para um status que não é permitido pela regra de negócio.

### 2. Teste da camada Controller — `SolicitacaoControllerTest`

A classe `SolicitacaoControllerTest` utiliza o recurso `@WebMvcTest` do Spring Boot para testar especificamente a camada Web/Controller.

Nesse teste, o `SolicitacaoService` é substituído por um mock:

```java
@MockitoBean
private SolicitacaoService solicitacaoService;
```

Isso permite testar o comportamento do Controller de forma isolada, sem executar a lógica do Service e sem acessar o banco de dados.

#### Teste de validação do cadastro

O teste:

```text
deveRetornarErro400AoCadastrarComDadosInvalidos
```

envia uma requisição `POST` para:

```text
/api/solicitacoes
```

com dados inválidos.

Nesse cenário, a descrição é enviada vazia:

```java
""
```

e o valor é enviado como:

```java
BigDecimal.ZERO
```

Esses valores violam as regras de validação definidas no DTO, como `@NotBlank` e `@DecimalMin`.

O teste verifica se a API:

- Retorna HTTP `400 Bad Request`;
- Retorna a mensagem `"Erro de Validação"`;
- Informa que a descrição é obrigatória;
- Informa que o valor deve ser maior que zero.

Esse teste garante que o **Controller e o mecanismo de validação do Spring** rejeitem requisições inválidas antes que elas sejam processadas pela camada de Service.

---

### 3. Intuito dos testes

Os testes foram implementados para garantir que as principais regras da aplicação continuem funcionando corretamente durante futuras alterações no código.

De forma resumida:

| Teste                                             | Objetivo                                                                                 |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `deveAtualizarStatusComSucesso`                   | Garante que uma transição de status válida seja realizada corretamente                   |
| `deveBararTransicaoInvalida`                      | Garante que uma transição de status não permitida gere uma exceção e não seja persistida |
| `deveRetornarErro400AoCadastrarComDadosInvalidos` | Garante que o Controller rejeite dados inválidos e retorne HTTP 400                      |

Os testes de **Service** focam principalmente nas **regras de negócio**, enquanto o teste de **Controller** verifica o comportamento da API, incluindo **validação dos dados de entrada e códigos de resposta HTTP**.

## Integração Contínua (CI) e Qualidade de Código

Para garantir a estabilidade e a qualidade do código entregue, este projeto conta com um pipeline de **Integração Contínua (CI)** configurado através do **GitHub Actions**.

Sempre que ocorrer push ou merge na branch **main**, o GitHub Actions provisiona automaticamente um ambiente isolado, compila a aplicação e executa a bateria de testes utilizando o Maven.

### Como funciona o Pipeline

- **Gatilhos (Triggers):** O fluxo de CI é acionado automaticamente em eventos de `Push` ou abertura de `Pull Requests` direcionados à branch `main`.
- **Testes Executados:**
  - **Testes Unitários:** Validação estrita das regras de negócio e transições de status na camada de serviço (`Service`), utilizando _Mockito_.
  - **Testes de Integração (Web Layer):** Verificação de rotas, validações de payload de entrada e formatação de respostas de erro na camada de controle (`Controller`), utilizando _MockMvc_.

### Benefícios

Esta automação atua como uma barreira de segurança, impedindo que regressões ou códigos que quebrem as regras de negócio sejam mesclados na branch principal, mantendo a integridade da aplicação sempre em 100%.

## Entrega Contínua (CD) - [Em Desenvolvimento]

Além da Integração Contínua (CI), iniciei a configuração de uma esteira de **Deploy Automatizado (CD)** utilizando **GitHub Actions** em conjunto com um **Self-Hosted Runner** hospedado em uma máquina Linux local (simulando um ambiente de real de deploy).

### Arquitetura do Deploy (Proposta)

O objetivo desta esteira é automatizar o deploy do sistema com a seguinte lógica:

1. Ao realizar um merge na branch `main`, o GitHub Actions aciona o Runner local.
2. O Runner executa o `docker-compose up --build`, orquestrando a subida unificada do Banco de Dados (PostgreSQL), da API (Spring Boot) e do Frontend (React + Nginx).
3. O Nginx atua como Proxy Reverso, resolvendo os arquivos estáticos na raiz (`/`) e roteando as requisições de API (`/api`) para o backend de forma isolada na rede do Docker.

### Status Atual e Próximos Passos (Melhorias Futuras)

A infraestrutura do Runner e os scripts YAML já estão configurados no repositório. Contudo, o fluxo ainda não está 100% concluído devido a instabilidades de rede (falhas de _TLS handshake_ na resolução de DNS do Docker Hub no ambiente físico local).

Para finalizar a entrega contínua com sucesso, os próximos passos mapeados são:

- [ ] **Estabilização de Rede:** Resolver os gargalos de conexão do servidor local com o Docker.
- [ ] **Exposição via Cloudflare Tunnels:** Configurar um túnel reverso (Zero Trust) para expor a porta 80 do Nginx de forma segura para a internet pública, permitindo o acesso ao sistema completo sem a necessidade de um IP fixo.

## Escolhas Técnicas

Durante o desenvolvimento foram adotadas algumas decisões técnicas com o objetivo de manter o código organizado, reduzir acoplamentos desnecessários e facilitar a manutenção e evolução da aplicação.

### 1. Arquitetura em camadas

Foi utilizada uma arquitetura em camadas, conforme solicitado no desafio, separando as responsabilidades da aplicação em diferentes componentes:

- **Controller:** responsável por receber as requisições HTTP e retornar as respostas;
- **Service:** responsável pelas regras de negócio e pelo fluxo das operações;
- **Repository:** responsável pelo acesso e persistência dos dados;
- **DTO:** responsável pela comunicação de dados entre as diferentes camadas e pela definição dos dados de entrada e saída da API;
- **Entidade:** responsável pela representação das entidades persistidas no banco de dados.

Essa separação permite que cada camada tenha uma responsabilidade bem definida, reduzindo o acoplamento entre as partes da aplicação e facilitando a manutenção e a realização de testes.

A arquitetura em camadas também foi escolhida por estar alinhada ao requisito definido no desafio.

> **Possível evolução:** caso a aplicação cresça significativamente, uma arquitetura organizada por funcionalidades (_feature-based_) poderia ser avaliada. Nesse modelo, os componentes relacionados a uma mesma funcionalidade, como Controller, Service, Repository e DTOs,  ficariam agrupados por domínio, facilitando a localização e manutenção do código em projetos maiores. Essa mudança, entretanto, não é necessária para o escopo atual e não foi adotada para manter a arquitetura solicitada pelo desafio.

### 2. Interfaces nos Repositories

Os repositories foram definidos como interfaces, utilizando os recursos disponibilizados pelo Spring Data JPA:

```java
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {
    // ...
}
```

Essa abordagem permite trabalhar com **composição e injeção de dependência**, em vez de criar implementações próprias e estabelecer acoplamentos desnecessários entre as classes.

O Service depende da abstração fornecida pelo repository e não precisa conhecer os detalhes de sua implementação:

```java
private final SolicitacaoRepository solicitacaoRepository;
```

Dessa forma, cada componente utiliza apenas aquilo de que realmente necessita. O repository não precisa conhecer ou executar responsabilidades de outras camadas para que possa ser utilizado por elas.

Essa separação facilita a substituição de implementações, a realização de testes unitários utilizando mocks e a manutenção do código.

### 3. Injeção de Dependência

A aplicação utiliza **Injeção de Dependência**, recurso disponibilizado pelo Spring, para fornecer às classes as dependências necessárias para seu funcionamento.

Por exemplo, o `SolicitacaoService` recebe seus repositories por meio do mecanismo de injeção de dependência, em vez de instanciá-los diretamente.

Isso evita que uma classe seja responsável pela criação de suas próprias dependências e reduz o acoplamento entre os componentes.

Além de melhorar a organização do código, essa abordagem facilita os testes unitários, pois as dependências reais podem ser substituídas por mocks como foi feito nos testes criados:

```java
@Mock
private SolicitacaoRepository solicitacaoRepository;
```

Dessa forma, é possível testar a regra de negócio do Service sem depender de um banco de dados real.

### 4. Utilização de DTOs

Foram utilizados **Data Transfer Objects (DTOs)** para definir os dados recebidos e enviados pela API.

A utilização de DTOs evita a exposição direta das entidades JPA nas requisições e respostas, criando uma separação entre o modelo utilizado internamente pela aplicação e o contrato disponibilizado pela API.

Por exemplo, a aplicação possui DTOs específicos para diferentes operações:

```text
SolicitacaoRequestDTO
SolicitacaoResponseDTO
StatusUpdateRequestDTO
```

Essa separação traz algumas vantagens:

- Define de forma explícita quais dados a API recebe;
- Define quais dados a API retorna;
- Permite aplicar validações diretamente nos dados de entrada;
- Evita expor diretamente as entidades do banco;
- Facilita alterações futuras no contrato da API;
- Mantém um padrão previsível para as requisições e respostas.

As validações também ficam centralizadas nos DTOs de entrada, utilizando as validações, como `@NotBlank` e `@DecimalMin`. Dessa forma, as regras relacionadas à validade dos dados recebidos ficam próximas à própria definição desses dados.

#### Uso de `record`

Os DTOs foram implementados utilizando `record`, recurso introduzido no Java 16 e utilizado no projeto com Java 17.

O `record` é adequado para objetos que representam dados, pois fornece uma estrutura concisa e imutável para esse tipo de finalidade. Isso reduz código repetitivo e deixa explícito que o DTO tem como principal responsabilidade transportar informações.

Além disso, a utilização de `record` contribui para manter um padrão consistente na definição dos contratos de entrada e saída da API.

### 5. Utilização de Projection

Para a consulta principal de solicitações foi utilizado o recurso de **Projection do Spring Data JPA**, por meio da interface `SolicitacaoResumoProjection`.

Em vez de recuperar necessariamente toda a entidade `Solicitacao` e seus relacionamentos para depois montar a resposta, a Projection define explicitamente os campos necessários para aquela consulta:

```java
public interface SolicitacaoResumoProjection {

    Long getId();

    String getSolicitanteNome();

    String getSolicitanteDocumento();

    String getCategoriaNome();

    String getStatus();

    BigDecimal getValor();

    LocalDateTime getDataSolicitacao();
}
```

Essa abordagem torna explícito o formato esperado para o resultado da consulta e evita que informações desnecessárias da entidade sejam utilizadas na resposta.

A Projection também funciona como uma forma de estabelecer um contrato claro entre a consulta realizada no banco e os dados que serão disponibilizados nessa operação.

Para manter a resposta organizada e padronizada, foi utilizada a anotação `@JsonPropertyOrder`:

```java
@JsonPropertyOrder({
    "id",
    "solicitanteNome",
    "solicitanteDocumento",
    "categoriaNome",
    "status",
    "valor",
    "dataSolicitacao"
})
```

Com isso, a serialização do resultado segue uma ordem previamente definida, tornando o JSON retornado mais previsível e legível.

A utilização de Projection é especialmente útil nesse cenário porque a consulta de listagem possui um formato de resposta específico, composto por informações da própria solicitação e dados relacionados de solicitante e categoria. Assim, a aplicação consegue retornar somente as informações necessárias para aquela operação, mantendo a estrutura da resposta clara e controlada.

### 6. Separação entre modelo de persistência e contrato da API

A combinação entre **Entities, DTOs e Projections** permite separar diferentes responsabilidades dentro da aplicação:

```text
Entity
   ↓
Representa os dados persistidos no banco

DTO
   ↓
Define os dados recebidos e enviados pela API

Projection
   ↓
Define os dados necessários para consultas específicas
```

Essa separação evita que uma única estrutura seja responsável por representar simultaneamente o banco de dados, as requisições e as respostas da API.

Como consequência, mudanças em uma dessas representações podem ser realizadas com menor impacto nas demais partes do sistema.

## Melhorias Futuras

Embora a aplicação atenda aos requisitos propostos, algumas melhorias podem ser implementadas futuramente para aumentar a robustez, a cobertura funcional e a aderência às regras de negócio.

### 1. Melhorias na identificação das solicitações

Atualmente, o ID das solicitações é gerado de forma incremental pelo banco de dados. Como melhoria, pode ser avaliada a adoção de um identificador com geração independente da sequência do banco, como um UUID.

Essa abordagem pode trazer benefícios em cenários de sistemas distribuídos e também dificultar a inferência da quantidade de registros existentes a partir do identificador.

### 2. Ampliação da cobertura de testes

Atualmente, existem testes unitários para algumas das principais regras de negócio e validações da aplicação.

Como melhoria, seria interessante ampliar a cobertura para contemplar todas as funcionalidades e regras de negócio do sistema, incluindo:

- Todas as transições possíveis de status;
- Regras de criação e atualização de solicitações;
- Validações de dados;
- Tratamento de exceções;
- Consultas e filtros;
- Regras envolvendo categorias e solicitantes;
- Cenários de sucesso e de erro.

Além dos testes unitários, poderia ser implementada uma suíte de **testes de integração de ponta a ponta (E2E)**, permitindo validar o fluxo completo da aplicação, desde a interação com o frontend até o processamento no backend e a persistência no banco de dados.

Dessa forma, seria possível verificar não apenas cada componente individualmente, mas também se todas as partes do sistema funcionam corretamente em conjunto.

### 3. CRUD completo de Categorias e Solicitantes

Atualmente, categorias e solicitantes são utilizados pela aplicação, mas uma evolução natural seria disponibilizar o gerenciamento completo desses recursos.

No backend, seriam adicionados os endpoints necessários para:

- Criar categorias e solicitantes;
- Listar categorias e solicitantes;
- Consultar um registro específico;
- Atualizar registros;
- Excluir registros;
- Validar regras de negócio relacionadas a esses recursos.

No frontend, seriam criadas as interfaces necessárias para realizar o **CRUD completo de Categorias e Solicitantes**, permitindo que esses dados sejam gerenciados diretamente pela aplicação, sem depender da inserção manual no banco de dados.

### 4. Validações relacionadas à data da solicitação

Uma possível evolução é aprimorar as regras de negócio relacionadas à data da solicitação.

Atualmente, existe uma implementação alternativa, disponível em uma branch separada (feature/data-solicitacao), que permite informar a data da solicitação durante o cadastro. Nessa implementação, a data é opcional: caso o usuário não informe uma data, o sistema utiliza automaticamente a data atual.

Como melhoria futura, poderiam ser definidas regras de negócio mais específicas para determinar quais datas são válidas. Por exemplo:

- Não permitir o cadastro de solicitações em finais de semana;
- Restringir o horário de criação para o horário comercial;
- Não permitir datas muito anteriores à data atual;
- Não permitir datas muito posteriores à data atual;
- Definir um intervalo máximo permitido para a data informada;
- Validar a data de acordo com regras específicas do processo de solicitação.

Essas regras dependeriam das necessidades reais do negócio e deveriam ser definidas antes da implementação, evitando a criação de restrições que não tenham justificativa no contexto da aplicação.

### 5. Evolução das regras de negócio

Com o crescimento da aplicação, novas regras de negócio podem ser incorporadas conforme os processos reais do sistema forem definidos.

A ideia é manter essas regras concentradas na camada de serviço, garantindo que sejam aplicadas independentemente de a operação ser realizada pelo frontend, por uma ferramenta como o Insomnia ou diretamente por outro consumidor da API.

Essas melhorias permitiriam evoluir o projeto de uma aplicação que atende aos requisitos atuais para uma solução mais completa, com maior cobertura de testes, gerenciamento integral dos dados auxiliares e regras de negócio mais consistentes.

## Extras

O projeto possui alguns arquivos adicionais para facilitar a utilização e os testes:

### DER

O arquivo `DER.png` contém o **Diagrama de Entidade-Relacionamento (DER)** do projeto, apresentando as entidades, seus atributos e os relacionamentos existentes entre elas.

### Insomnia

O arquivo `insomnia-routes.yaml` contém as **rotas da API e suas respectivas variáveis**, facilitando a importação e realização dos testes utilizando o Insomnia.

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
