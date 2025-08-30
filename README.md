#  Freelancer Hub 🚀

![Freelancer Hub](https://i.imgur.com/your-image-placeholder.png) O **Freelancer Hub** é uma plataforma automatizada projetada para centralizar e monitorar oportunidades de trabalho freelancer de diversas fontes. Em vez de navegar por múltiplos sites diariamente, o usuário configura suas palavras-chave de interesse e recebe um feed personalizado e em tempo real com as vagas mais relevantes, além de notificações por e-mail.

Este projeto foi construído utilizando uma stack moderna e robusta, focada em reatividade, automação e uma excelente experiência de desenvolvimento.

## ✨ Funcionalidades Principais

* **Feed em Tempo Real:** Novas oportunidades aparecem na tela instantaneamente, sem a necessidade de recarregar a página.
* **Filtros Personalizados:** A busca é refinada com base nas palavras-chave definidas pelo usuário.
* **Gerenciamento de Vagas:** Sistema para salvar vagas favoritas e visualizá-las em uma lista separada.
* **Automação Inteligente:** Um workflow no n8n busca, processa e armazena novas vagas automaticamente.
* **Notificações Proativas:** Uma API customizada em Node.js analisa as novas vagas e envia resumos por e-mail para os usuários interessados.
* **Autenticação Segura:** Gerenciamento de contas de usuário via Supabase Auth.

## 🛠️ Tecnologias Utilizadas

Este projeto integra diversas tecnologias de ponta, cada uma com um papel específico:

* **Frontend:**
    * **React:** Biblioteca para construção da interface de usuário.
    * **TypeScript:** Garante a tipagem e a robustez do código.
    * **Vite:** Ferramenta de build extremamente rápida para o ambiente de desenvolvimento.
    * **Tailwind CSS:** Framework CSS utility-first para estilização rápida e customizável.
    * **Shadcn/ui:** Coleção de componentes de UI reutilizáveis e acessíveis.
* **Backend (API Customizada):**
    * **Node.js:** Ambiente de execução para o JavaScript no servidor.
    * **Express.js:** Framework para a construção da API REST.
* **Banco de Dados & BaaS (Backend-as-a-Service):**
    * **Supabase:** Plataforma open-source que utiliza **PostgreSQL** e provê:
        * Banco de Dados relacional.
        * APIs instantâneas.
        * Autenticação.
        * Inscrições em tempo real (Realtime Subscriptions).
* **Automação de Workflows:**
    * **n8n:** Ferramenta para automação de tarefas, responsável por buscar e processar os dados das vagas.
* **Envio de E-mails:**
    * **Resend:** Plataforma para envio de e-mails transacionais.
* **Gerenciador de Pacotes:**
    * **pnpm:** Rápido e eficiente no uso de espaço em disco.

## 🏁 Rodando o Projeto Localmente

Siga os passos abaixo para configurar e executar o Freelancer Hub no seu ambiente de desenvolvimento.

### Pré-requisitos

Antes de começar, certifique-se de que você tem os seguintes softwares instalados:
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* [pnpm](https://pnpm.io/installation) (instalado via `npm install -g pnpm`)
* [Git](https://git-scm.com/)
* [Docker](https://www.docker.com/products/docker-desktop/) (para rodar o n8n facilmente)

### Passo a Passo

**1. Clone o Repositório**
```bash
git clone [https://github.com/KutzWilliam/freelancer-hub](https://github.com/KutzWilliam/freelancer-hub)
cd freelancer-hub
```

**2. Configure o Supabase**
* Crie um projeto em [Supabase.com](https://supabase.com).
* Use o **SQL Editor** para executar os scripts SQL de criação de tabelas (`profiles`, `opportunities`, etc.) e as funções/triggers de sincronização de e-mail.
* Vá para **Authentication -> Policies** e ative o **Row Level Security (RLS)** para as tabelas `profiles`, `keywords` e `saved_opportunities`, criando as políticas de acesso necessárias.

**3. Configure as Variáveis de Ambiente**
* Você precisará de dois arquivos `.env`. Crie-os e preencha com suas chaves.

    * **Para o Frontend (`/frontend/.env`):**
        ```env
        VITE_SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
        VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_PUBLICA_DO_SUPABASE
        ```

    * **Para o Backend (`/api/.env`):**
        ```env
        SUPABASE_URL=SUA_URL_DO_PROJETO_SUPABASE
        SUPABASE_SERVICE_KEY=SUA_CHAVE_SERVICE_ROLE_SECRETA_DO_SUPABASE
        RESEND_API_KEY=SUA_CHAVE_DE_API_DO_RESEND
        ```

**4. Instale as Dependências**
* Execute o comando de instalação para o frontend e o backend.
    ```bash
    # Instalar dependências do Frontend
    cd frontend
    pnpm install

    # Voltar para a raiz e instalar dependências da API
    cd ../api
    pnpm install
    ```

**5. Configure e Rode o n8n**
* Na raiz do projeto, crie um arquivo `docker-compose.yml` (se ainda não existir) para o n8n:
    ```yaml
    version: '3'
    services:
      n8n:
        image: n8nio/n8n
        restart: always
        ports:
          - "5678:5678"
        volumes:
          - ./n8n_data:/home/node/.n8n
    ```
* Inicie o contêiner do n8n:
    ```bash
    docker-compose up -d
    ```
* Acesse o n8n em `http://localhost:5678`.
* Importe o JSON do seu workflow (do diretório `/n8n-workflows`).
* Configure as credenciais do Supabase dentro do n8n.
* **Importante:** No nó "HTTP Request" do workflow, certifique-se de que a URL da API Node.js é `http://host.docker.internal:3001/api/notify` para que o contêiner Docker consiga acessar sua máquina local.

**6. Execute a Aplicação**
* Você precisará de **dois terminais** abertos na raiz do projeto.

* **Terminal 1: Rodar o Frontend (React)**
    ```bash
    cd frontend
    pnpm run dev
    ```
    * O frontend estará acessível em `http://localhost:5173`.

* **Terminal 2: Rodar o Backend (Node.js API)**
    ```bash
    cd api
    pnpm run dev
    ```
    * A API estará rodando em `http://localhost:3001`.

Agora você tem todo o ambiente do Freelancer Hub rodando localmente!

## 📂 Estrutura do Projeto

```
/
├── api/                # Código da API backend em Node.js/Express
├── frontend/           # Código do Dashboard em React/Vite
├── n8n-workflows/      # Arquivos JSON com os workflows do n8n
├── n8n_data/           # Dados persistentes do n8n (via Docker volume)
└── README.md
```

## 🚀 Próximos Passos e Melhorias

* Fazer o deploy de cada serviço (Frontend na Vercel, API no Render, n8n em uma VPS).
* Adicionar mais fontes de dados no workflow do n8n.
* Criar templates de e-mail mais avançados com o Resend.
* Implementar um sistema de tracking de aplicações.
* Adicionar um onboarding para novos usuários.