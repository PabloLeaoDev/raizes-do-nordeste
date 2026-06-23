import { randomUUID } from "crypto";

export const generateUnit = (overrides = {}) => {
  const id = randomUUID();
  return {
    nome: `Unidade ${id.substring(0, 8)}`,
    endereco: `Rua Teste, ${Math.floor(Math.random() * 1000)}`,
    ...overrides,
  };
};
