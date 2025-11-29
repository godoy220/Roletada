# 🎰 Caça-níqueis Transparente: A Ruína do Jogador

Projeto educativo que demonstra interativamente a Teoria da Ruína do Jogador através de um caça-níqueis transparente.

## 🚀 Como Instalar e Executar

### Pré-requisitos
- **Node.js** 18+ (recomendado 22.13.0)
- **pnpm** (gerenciador de pacotes)

### Passos de Instalação

1. **Extraia o arquivo ZIP** (se recebeu em ZIP):
   ```bash
   unzip slot-machine-game.zip
   cd slot-machine-game
   ```

2. **Instale as dependências**:
   ```bash
   pnpm install
   ```

3. **Inicie o servidor de desenvolvimento**:
   ```bash
   pnpm dev
   ```

4. **Abra no navegador**:
   - O servidor iniciará em `http://localhost:3000`
   - Abra este endereço no seu navegador

## 📁 Estrutura do Projeto

```
slot-machine-game/
├── client/
│   ├── src/
│   │   ├── components/        # Componentes React (SlotMachine, SlotReel, etc)
│   │   ├── contexts/          # Context API (GameContext)
│   │   ├── lib/               # Lógica do jogo (gameLogic.ts)
│   │   ├── pages/             # Páginas (Home, NotFound)
│   │   ├── App.tsx            # Componente raiz
│   │   └── index.css          # Estilos globais
│   └── public/                # Arquivos estáticos
├── vitest.config.ts           # Configuração de testes
├── vite.config.ts             # Configuração do Vite
└── package.json               # Dependências do projeto
```

## 🎮 Como Jogar

1. **Defina a dificuldade** (5%, 10% ou 15% House Edge)
2. **Ajuste sua aposta** usando os botões +/- ou digitando o valor
3. **Clique em GIRAR** para fazer uma rodada manual
4. **Clique em AUTO** para rodadas automáticas (escolha a quantidade)
5. **Acompanhe as estatísticas** em tempo real no dashboard

## 🧪 Executar Testes

```bash
pnpm test
```

Todos os testes devem passar (18/18).

## 📊 Funcionalidades

- ✅ Simulação realista de caça-níqueis com probabilidades configuráveis
- ✅ Modo manual (girar um a um) e automático (múltiplas rodadas)
- ✅ Dashboard de estatísticas com gráfico em tempo real
- ✅ Histórico detalhado de todas as rodadas
- ✅ Demonstração visual da Teoria da Ruína do Jogador
- ✅ Interface responsiva com design moderno (inspirado em Blaze)
- ✅ Rolos com animação vertical 3D

## 🛠️ Tecnologias Utilizadas

- **React 19** - Framework UI
- **Tailwind CSS 4** - Estilos
- **Framer Motion** - Animações
- **Chart.js** - Gráficos
- **TypeScript** - Tipagem
- **Vitest** - Testes unitários
- **Vite** - Build tool

## 📝 Notas Importantes

- O jogo usa **números aleatórios** para cada rodada
- A **House Edge** é configurável (5%, 10%, 15%)
- As **estatísticas** são calculadas em tempo real
- O **histórico** mostra cada rodada com detalhes completos

## 🐛 Troubleshooting

**Porta 3000 já está em uso?**
```bash
pnpm dev -- --port 3001
```

**Erro ao instalar dependências?**
```bash
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Testes falhando?**
```bash
pnpm test -- --reporter=verbose
```

## 📧 Suporte

Para dúvidas ou problemas, verifique o arquivo `todo.md` para histórico de correções.

---

**Desenvolvido com ❤️ como ferramenta educativa sobre Teoria da Ruína do Jogador**
