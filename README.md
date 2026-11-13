# 📚 Littera — Sistema de Gestão de Biblioteca

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.1.1-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)

O **Littera** é uma aplicação full-stack moderna para gerenciamento de acervos bibliográficos, controle de empréstimos, devoluções, reservas e gestão de usuários. O sistema automatiza regras de negócio essenciais de uma biblioteca, como cálculo dinâmico de prazos por tipo de obra (livros e revistas), controle de disponibilidade em estoque e sistema automatizado de penalidades/bloqueios por atraso.

---

## ✨ Funcionalidades Principais

* **🔐 Autenticação & Segurança:** Login seguro com criptografia de senhas (`BCrypt`) e controle de sessão via Spring Security.
* **📖 Gestão de Acervo:** Cadastro, consulta, atualização e remoção de obras (`Livro` e `Revista`), incluindo busca integrada por ISBN.
* **🔄 Controle de Empréstimos & Devoluções:**
  * Cálculo automático da data de devolução prevista (**14 dias** para livros e **7 dias** para revistas).
  * Baixa e reposição automática da quantidade disponível no acervo.
  * **Sistema de Penalidades:** Cálculo automático de dias de atraso na devolução, aplicando bloqueio temporário ao usuário equivalente ao dobro dos dias de atraso.
* **👥 Gestão de Usuários:** Controle de leitores, histórico de itens emprestados e status de bloqueio.
* **🩺 Monitoramento:** Health check ativo via Spring Boot Actuator (`/actuator/health`).

---

## 🛠️ Tecnologias Utilizadas

### Back-end (`littera-api`)
* **Linguagem:** Java 21
* **Framework:** Spring Boot 4.1.1 (Web, Data JPA, Security, Actuator, Validation)
* **Banco de Dados:** PostgreSQL 17
* **Migrações:** Flyway (`V1__` scripts automáticos)
* **Build & Testes:** Gradle, JUnit 5, Mockito e AssertJ

### Front-end (`littera`)
* **Biblioteca:** React JS (com Vite)
* **Estilização:** CSS3
* **Comunicação HTTP:** Axios

---

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:
* **Para execução via Docker:** [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/).
* **Para execução Local:**
  * [Java JDK 21](https://adoptium.net/)
  * [Node.js 18+](https://nodejs.org/) (e npm/yarn)
  * [PostgreSQL 17](https://www.postgresql.org/) rodando localmente

---

## ⚙️ Configuração de Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto (baseado no `.env.example`). **Nunca envie este arquivo para o GitHub.**

### Back-end (`.env` ou variáveis do sistema)
```env
DB_URL=jdbc:postgresql://localhost:5432/littera_db
DB_USERNAME=postgres
DB_PASSWORD=sua_senha_aqui
CORS_ORIGINS=http://localhost:5173
JWT_SECRET=sua_chave_secreta_super_segura
```

### Documentação

Disponível em /documentation_littera
<br>API: disponível em https://littera-api-tzsr.onrender.com/swagger-ui/index.html

### Front-end (`.env`)
```env
VITE_API_URL=http://localhost:8080
```

---

## 🚀 Como Executar o Projeto

### 🐳 Opção 1: Rodando via Docker (Recomendado)

A maneira mais rápida de subir toda a infraestrutura (Banco de Dados + Back-end + Front-end) sem precisar instalar Java ou PostgreSQL na máquina:

1. **Clone os repositórios:**
   ```bash
   git clone https://github.com/lucas-brum545/littera.git
   git clone https://github.com/lucas-brum545/littera-api.git
   ```

2. **Suba os containers com Docker Compose:**
   Na pasta onde se encontra o seu `docker-compose.yml`, execute:
   ```bash
   docker-compose up --build -d
   ```

3. **Acesse a aplicação:**
   * **Front-end:** `http://localhost:5173` (ou porta configurada no compose)
   * **API Back-end:** `http://localhost:8080`
   * **Health Check:** `http://localhost:8080/actuator/health`

---

### 💻 Opção 2: Rodando Localmente (Passo a Passo)

#### 1. Configurar o Banco de Dados
Crie um banco de dados vazio no PostgreSQL chamado `littera_db`. As tabelas serão criadas automaticamente pelo **Flyway** na primeira inicialização do back-end.

#### 2. Iniciar o Back-end (`littera-api`)
```bash
# Entre na pasta da API
cd littera-api

# Execute a aplicação via Gradle Wrapper
./gradlew bootRun
# (No Windows PowerShell, use: .\gradlew.bat bootRun)
```
> A API estará disponível em `http://localhost:8080`.

#### 3. Iniciar o Front-end (`littera`)
```bash
# Entre na pasta do front-end
cd littera

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```
> O sistema abrirá em `http://localhost:5173`.

---

## 🧪 Executando os Testes Automatizados

O back-end conta com suíte de testes unitários cobrindo as regras de negócio de autenticação e empréstimos:

```bash
cd littera-api
./gradlew test
```

---

## 🌿 Fluxo de Contribuição (Git Flow)

O projeto segue o fluxo baseado em branches para manter a estabilidade em produção:
* `main`: Código estável em produção (Deploy contínuo via Vercel / Render).
* `develop`: Branch de integração para novas funcionalidades e correções.

1. Crie uma branch a partir de `develop` (`git checkout -b feature/minha-feature develop`).
2. Faça suas alterações e commits.
3. Abra um **Pull Request** direcionado para `develop`.

---

## 👨‍💻 Autoria

Desenvolvido por 
**Lucas Brum**<br>
**Luiz Lobato**<br>
**Joyce Cruz**<br>
**Milton Martins**<br>
**Karoline Oliveira**
