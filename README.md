# Petas — Minecraft Server Landing Page

Uma landing page moderna, responsiva e dinâmica para o servidor de Minecraft **Petas**. O site permite que os jogadores verifiquem o status do servidor em tempo real, explorem o mapa interativo, consultem o Leaderboard de tempo jogado, copiem o IP facilmente e baixem o modpack oficial.

## 🌟 Funcionalidades

- **Status em Tempo Real:** Consulta a API do `mcsrvstat.us` para mostrar se o servidor está online, a quantidade de jogadores conectados e a versão do servidor.
- **Leaderboard de Tempo Online:** Um ranking dinâmico dos jogadores mais ativos ("Os mais viciados"). O sistema soma 5 minutos automaticamente a cada jogador online a cada ciclo de 5 minutos, garantindo um acompanhamento preciso do tempo de jogo sem precisar de plugins complexos no servidor.
- **Mapa Interativo (Live Map):** Incorporação do mapa do servidor em 3D, permitindo a exploração do mundo persistente diretamente do navegador (Proxy configurado pelo Vercel para evitar bloqueios).
- **Cópia Rápida de IP:** Botões com feedback visual para copiar o IP principal (`petas.xyz`) e o IP alternativo (`br-ded-2.enxadahost.com:10829`).
- **Download do Modpack:** Acesso direto ao download do arquivo `.mrpack` (`takeda_1.1.0.mrpack`).
- **Design Moderno:** Interface com estética "dark mode", animações suaves, tipografia bem definida (Space Grotesk e Inter) e responsividade para dispositivos móveis.

## 🛠 Tecnologias Utilizadas

- **HTML5 & CSS3:** Estruturação e estilização (variáveis CSS, flexbox, grid, animações keyframes) sem frameworks adicionais.
- **JavaScript (Vanilla):** Lógicas de manipulação da área de transferência (Clipboard API), consumo de APIs externas (Fetch API) e renderização dinâmica do Leaderboard.
- **Node.js (Serverless Functions):** APIs customizadas (`api/cron.js` e `api/leaderboard.js`) hospedadas no Vercel para gerenciar a lógica do Leaderboard.
- **Vercel KV (Redis) & Vercel Cron:** Banco de dados de alta performance em memória fornecido pelo Upstash para guardar o tempo dos jogadores, e agendador de tarefas para verificar os jogadores online a cada 5 minutos.
- **Vercel Hosting:** Hospedagem do site e configuração de rotas/rewrites (`vercel.json`) para o proxy do mapa e disparo do cron.

## ⚙️ Como funciona o Leaderboard

O Leaderboard não requer nenhum banco de dados na máquina do servidor de Minecraft. Ele funciona 100% de forma independente no Vercel:
1. **O Agendador (Cron):** A cada 5 minutos, o Vercel Cron aciona secretamente a rota `/api/cron`.
2. **A Verificação:** A API `/api/cron` consulta quem está online no momento através do `mcsrvstat.us`.
3. **A Soma:** Para cada jogador online encontrado, a API soma +5 minutos de pontuação no banco de dados **Vercel KV** (usando a estrutura de Sorted Sets na chave `leaderboard:playtime`).
4. **A Exibição:** Quando um usuário acessa o site, o frontend chama a rota `/api/leaderboard` para ler o Top 10 e exibir o ranking formatando os minutos para horas/minutos reais e buscando a cabeça do jogador via Minotar.

## 🚀 Como rodar o projeto localmente

Para rodar localmente com suporte completo às APIs Serverless e ao banco KV, você deve utilizar o Vercel CLI.

1. Instale o Vercel CLI globalmente (se não tiver):
   ```bash
   npm i -g vercel
   ```
2. Instale as dependências locais (o pacote `@vercel/kv`):
   ```bash
   npm install
   ```
3. Vincule seu projeto ao Vercel e puxe as variáveis de ambiente (Isso fará o download das senhas do KV para o seu computador):
   ```bash
   vercel link
   vercel env pull .env.development.local
   ```
4. Rode o ambiente de desenvolvimento local do Vercel:
   ```bash
   vercel dev
   ```
O site estará disponível em `http://localhost:3000`.

## 🌐 Implantação (Deploy)

O projeto foi construído para ser hospedado na plataforma **Vercel**. 
Para o sistema funcionar corretamente:
- A configuração do `vercel.json` deve estar presente na raiz do projeto (cuidando do proxy do mapa e do cron).
- Um banco de dados **KV (Redis)** deve ser criado e vinculado ao projeto através da aba *Storage* no painel da Vercel.

## 🎮 Informações do Servidor (Petas)

- **IP Principal:** `petas.xyz`
- **IP Alternativo:** `br-ded-2.enxadahost.com:10829`
- **Versão:** Java Edition (compatível com launcher oficial)

---
*© 2026 Petas. Todos os direitos reservados.*
