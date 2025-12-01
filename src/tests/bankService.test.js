const { transfer, getBalance, __getUsersForTesting } = require("../bankService");

describe("BankService - Testes Unitários (refatorado)", () => {
  const restoreBalances = () => {
    const users = __getUsersForTesting();
    if (!users) return;
    const u1 = users.find((u) => u.id === 1);
    const u2 = users.find((u) => u.id === 2);
    if (u1) u1.balance = 1000;
    if (u2) u2.balance = 500;
  };

  beforeEach(() => restoreBalances());

  const expectBalancesUnchangedOnError = (senderId, receiverId, fn, expectedMessage) => {
    const beforeSender = getBalance(senderId);
    const beforeReceiver = getBalance(receiverId);
    try {
      fn();
    } catch (err) {
      expect(getBalance(senderId)).toBe(beforeSender);
      expect(getBalance(receiverId)).toBe(beforeReceiver);
      expect(err.message).toBe(expectedMessage);
      return;
    }
    throw new Error("Erro esperado, mas não ocorreu");
  };

  describe("Caminhos de sucesso", () => {
    test("realiza transferência quando há saldo suficiente", () => {
      const res = transfer(1, 2, 300);
      expect(res.success).toBe(true);
      expect(res.message).toBe("Transferência realizada");
      expect(res.newSenderBalance).toBe(700);
      expect(getBalance(2)).toBe(800);
    });

    test("permite transferir todo o saldo disponível", () => {
      const res = transfer(2, 1, 500);
      expect(res.success).toBe(true);
      expect(res.newSenderBalance).toBe(0);
      expect(getBalance(1)).toBe(1500);
    });
  });

  describe("Falhas por saldo", () => {
    test("rejeita quando saldo é insuficiente", () => {
      expect(() => transfer(2, 1, 600)).toThrow("Saldo insuficiente");
    });

    test("mantém saldos inalterados quando falha por saldo insuficiente", () => {
      expectBalancesUnchangedOnError(2, 1, () => transfer(2, 1, 1000), "Saldo insuficiente");
    });
  });

  describe("Validações de valor (boundary)", () => {
    test.each([[0], [-50]])("rejeita transferência com valor inválido: %i", (amount) => {
      expect(() => transfer(1, 2, amount)).toThrow("Valor inválido");
    });

    test("mantém saldos quando valor inválido causa falha", () => {
      expectBalancesUnchangedOnError(1, 2, () => transfer(1, 2, -100), "Valor inválido");
    });
  });

  describe("Usuários inexistentes", () => {
    test("remetente não existente", () => {
      expect(() => transfer(999, 2, 100)).toThrow("Usuário não encontrado");
    });

    test("destinatário não existente", () => {
      expect(() => transfer(1, 999, 100)).toThrow("Usuário não encontrado");
    });

    test("ambos não existentes", () => {
      expect(() => transfer(888, 999, 100)).toThrow("Usuário não encontrado");
    });

    test("mantém saldos de outros usuários quando falha por usuário inexistente", () => {
      expectBalancesUnchangedOnError(1, 2, () => transfer(999, 1, 100), "Usuário não encontrado");
    });
  });

  describe("getBalance", () => {
    test("retorna saldo correto para usuário existente", () => {
      expect(getBalance(1)).toBe(1000);
    });

    test("retorna null para usuário inexistente", () => {
      expect(getBalance(999)).toBeNull();
    });
  });
});
