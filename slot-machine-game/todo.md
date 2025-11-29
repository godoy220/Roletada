# Caça-níqueis Transparente: A Ruína do Jogador - TODO

## Funcionalidades Principais

- [x] Componente principal do Caça-níqueis (Slot Machine) com 3 rolos
- [x] Lógica de sorteio e cálculo de símbolos (Cereja, Bar, Sino, 7)
- [x] Sistema de saldo e apostas (capital inicial, aposta por rodada)
- [x] Cálculo do Valor Esperado (House Edge) e exibição ao usuário
- [x] Dashboard de Estatísticas com gráfico em tempo real (Chart.js)
- [x] Histórico de Jogadas detalhado
- [x] Modo Manual (clique para girar)
- [x] Modo Automático (simulação de 1000+ rodadas)
- [x] Mensagens Educativas sobre a Ruína do Jogador
- [x] Animações de giro da máquina (Framer Motion)
- [x] Interface responsiva (Tailwind CSS)
- [x] Painel de Saldo em tempo real
- [x] Condições de Fim de Jogo (Ruína ou Vitória Temporária)
- [x] Probabilidades Configuráveis (dificuldade do jogo)

## Bugs Corrigidos

- [x] BUG: Lógica de win/loss invertida (ganha aparece como perda e vice-versa)
- [x] BUG: Sistema de apostas não permite mudar o valor da aposta
- [x] BUG: Estatísticas não estavam funcionando corretamente
- [x] BUG: Histórico de jogadas não estava registrando corretamente

## Design e Melhorias

- [x] FEATURE: Redesign inspirado em plataformas modernas (Blaze-style)
- [x] FEATURE: Melhorar paleta de cores e visual geral
- [x] FEATURE: Sistema de apostas personalizadas (botões +/-, input direto, botão Máx)
- [x] FEATURE: Interface com tema escuro (dark mode nativo)
- [x] FEATURE: Melhor feedback visual de vitória/derrota

## Funcionalidades Extras (Futuro)

- [ ] Modo Escuro/Claro (alternável)
- [ ] Sistema de Conquistas (Medalhas)
- [ ] Leaderboard Local
- [ ] Exportar Histórico em CSV
- [ ] Efeitos Sonoros (vitória, derrota, giro)

## Testes

- [x] Validar lógica de sorteio (probabilidades corretas) - 22 testes passando
- [x] Validar cálculo de saldo e House Edge
- [x] Testar Modo Automático (saldo tende a zero)
- [x] Testar responsividade em mobile/desktop
- [x] Testar animações e performance

## Documentação

- [ ] Documentar regras de negócio
- [ ] Documentar arquitetura do sistema
- [ ] Criar guia de uso para o usuário


## Bugs Reportados (Correção Urgente)

- [x] BUG: Modo AUTO faz all-in de uma vez ao invés de rodar rodada por rodada
- [x] BUG: Saldo fica negativo após all-in, causando ruína prematura
- [x] FEATURE: Modal para escolher quantidade de rodadas automáticas
- [x] FEATURE: Botão de parar durante modo automático


## Bugs Reportados (Correção Urgente - Velocidade)

- [x] BUG: Modo AUTO está muito rápido, sem animação de giro dos rolos
- [x] FEATURE: Sincronizar velocidade do AUTO com modo manual (800ms de animação)


## Bugs Reportados (Correção Crítica)

- [x] BUG: Game over prematuro após rodadas automáticas, impedindo continuar jogando
- [x] BUG: Velocidade ainda está muito rápida, não dá para entender início/fim de cada rodada


## Bugs Críticos (Pós Auto-Giro)

- [x] BUG: Jogo travado após auto-giro terminar, sem possibilidade de girar ou fazer qualquer ação
- [x] BUG: Estatísticas e histórico vazios após auto-giro
- [x] BUG: Botão de redefinir não funciona
- [x] FEATURE: Redesenhar rolos com moldura 3D dourada estilo caça-níquel real


## Bugs Finais (Removidos/Corrigidos)

- [x] BUG: Três chocolates marcando como derrota (CORRIGIDO)
- [x] REMOVER: Sistema de som (não funciona corretamente - REMOVIDO)
- [x] REMOVER: Modo auto-giro (não funciona corretamente - REMOVIDO)
