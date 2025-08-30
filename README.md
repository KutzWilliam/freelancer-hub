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

* Adicionar mais fontes de dados no workflow do n8n.
* Criar templates de e-mail mais avançados com o Resend.
* Implementar um sistema de tracking de aplicações.
* Adicionar um onboarding para novos usuários.