# Trabalho - Testes Backend (resumo)

Resumo rápido do projeto e instruções para rodar os testes.

---

Descrição
- Projeto de exemplo para exercícios de testes em aplicações server-side usando Node.js.
- Contém uma pequena API e uma camada de serviço que implementa transferências entre usuários.

Estrutura principal
- `src/bankService.js`: lógica de negócio responsável por gerenciar usuários e executar a função `transfer(senderId, receiverId, amount)`; também exporta `getBalance(id)` e `__getUsersForTesting()` (apenas para facilitar testes).
- `src/api.js`: servidor (Express) que expõe a rota `POST /transfer` e delega a lógica para `bankService`.
- `src/tests/bankService.test.js`: testes unitários para a função `transfer` (cobre caminho feliz, saldo insuficiente, valores inválidos e usuários inexistentes).
- `src/tests/api.test.js`: testes de integração usando `supertest` para validar a rota `POST /transfer` (verifica respostas HTTP e integridade dos dados).

Configuração e dependências
- `jest` e `supertest` estão listados em `devDependencies` no `package.json`.
- Scripts úteis no `package.json`:
  - `npm test` — executa os testes (`jest --verbose`)
  - `npm run test:watch` — executa Jest em modo watch
  - `npm run test:coverage` — gera relatório de cobertura

Como rodar localmente (PowerShell):
```powershell
npm install
npm test
```

O que os testes cobrem (mapa para requisitos da disciplina)
- Cenário Positivo (Caminho Feliz): transferência válida desconta corretamente o saldo do remetente e credita o receptor.
- Cenário Negativo (Saldo Insuficiente): tentativa de transferir mais que o saldo lança erro e não altera saldos.
- Teste de Limite (Boundary): valores `0` ou negativos são rejeitados e não alteram saldos.
- Teste de Entrada (Input): IDs de usuários inexistentes causam erro apropriado e mantêm integridade dos saldos.


---


