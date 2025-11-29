<div align="center">
  <h1>🎰 Caça-níqueis Transparente</h1>
  <h3>A Ruína do Jogador</h3>

  <p align="center">
    Um projeto educativo e interativo que demonstra visualmente a Teoria da Ruína do Jogador através de um simulador de Slot Machine transparente.
    <br />
    <br />
    <a href="#-como-jogar">Ver Demo</a>
    ·
    <a href="https://github.com/godoy220/roletada/issues">Reportar Bug</a>
    ·
    <a href="https://github.com/godoy220/roletada/issues">Solicitar Feature</a>
  </p>
</div>

<div align="center">

![Status](https://img.shields.io/badge/status-concluído-success?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Node](https://img.shields.io/badge/node-18%2B-green?style=for-the-badge)

</div>

---

<details>
  <summary>📝 Tabela de Conteúdos</summary>
  <ol>
    <li><a href="#-sobre-o-projeto">Sobre o Projeto</a></li>
    <li><a href="#-funcionalidades">Funcionalidades</a></li>
    <li><a href="#-tecnologias-utilizadas">Tecnologias Utilizadas</a></li>
    <li><a href="#-começando">Começando</a></li>
    <li><a href="#-como-jogar">Como Jogar</a></li>
    <li><a href="#-estrutura-do-projeto">Estrutura</a></li>
    <li><a href="#-troubleshooting">Troubleshooting</a></li>
  </ol>
</details>

---

### 💻 Sobre o Projeto

Este é um **simulador de caça-níqueis (Slot Machine)** desenvolvido com foco educativo. Diferente dos jogos de azar comuns, este projeto é "transparente": ele expõe as probabilidades e demonstra na prática como a casa sempre ganha a longo prazo, ilustrando o conceito matemático da **Teoria da Ruína do Jogador**.

O sistema conta com animações realistas, controle de _House Edge_ (vantagem da casa) e um dashboard estatístico em tempo real.

---

### ✨ Funcionalidades

* ✅ **Simulação Realista:** Probabilidades configuráveis e sistema de RNG (Random Number Generator).
* ✅ **Controle de Risco:** Defina a dificuldade com *House Edge* de 5%, 10% ou 15%.
* ✅ **Modos de Jogo:** * *Manual:* Gire um a um para sentir a tensão.
    * *Automático:* Configure múltiplas rodadas para ver o resultado a longo prazo.
* ✅ **Dashboard Analytics:** Gráficos e estatísticas calculadas em tempo real.
* ✅ **Histórico Detalhado:** Log completo de todas as jogadas realizadas.
* ✅ **UX/UI Moderna:** Interface responsiva, animações verticais 3D nos rolos e design inspirado em plataformas modernas.

---

### 🛠 Tecnologias Utilizadas

Este projeto foi construído com uma stack moderna e robusta:

* ![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
* ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
* ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
* ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
* **Framer Motion** (Animações fluidas)
* **Chart.js** (Visualização de dados)
* **Vitest** (Testes Unitários)
* **Express** (Servidor simples para produção)

---

### 🚀 Começando

Siga os passos abaixo para rodar o projeto localmente.

#### Pré-requisitos

* **Node.js** (Versão 18 ou superior - recomendado 22.13.0)
* **pnpm** (Gerenciador de pacotes)

#### Instalação

1.  **Clone o repositório**
    ```bash
    git clone [https://github.com/godoy220/roletada.git](https://github.com/godoy220/roletada.git)
    cd slot-machine-game
    ```

2.  **Instale as dependências**
    ```bash
    pnpm install
    ```

3.  **Inicie o servidor de desenvolvimento**
    ```bash
    pnpm dev
    ```

4.  **Acesse no navegador**
    O projeto estará rodando em: `http://localhost:3000`

---

### 🎮 Como Jogar

1.  **Defina a Dificuldade:** No painel, escolha a *House Edge* desejada (5%, 10% ou 15%).
2.  **Faça sua Aposta:** Use os botões `+/-` ou digite o valor que deseja arriscar.
3.  **Gire:**
    * Clique em **GIRAR** para uma rodada única.
    * Clique em **AUTO** para simular várias rodadas consecutivas.
4.  **Analise:** Observe o gráfico no dashboard atualizar em tempo real e veja a "Ruína do Jogador" acontecer.

---

### 📂 Estrutura do Projeto

```bash
slot-machine-game/
├── client/
│   ├── src/
│   │   ├── components/    # SlotMachine, SlotReel, Dashboard
│   │   ├── contexts/      # GameContext (Gerenciamento de estado)
│   │   ├── lib/           # gameLogic.ts (Lógica matemática)
│   │   ├── pages/         # Home, NotFound
│   │   └── App.tsx        # Rotas e Setup
│   └── public/
├── server/                # Servidor Express para deploy
├── vitest.config.ts       # Configuração de Testes
└── package.json
🐛 Troubleshooting
Porta 3000 em uso? Rode: pnpm dev -- --port 3001

Erro nas dependências? Rode: rm -rf node_modules pnpm-lock.yaml && pnpm install

Executar Testes: Rode: pnpm test (O projeto conta com 18 testes unitários cobrindo a lógica).

📄 Licença
Distribuído sob a licença MIT. Veja package.json para mais informações.

<div align="center"> <p>Desenvolvido com ❤️ como ferramenta educativa.</p> </div>
