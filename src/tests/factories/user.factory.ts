import { randomUUID } from "crypto";

export const generateUser = (overrides = {}) => {
  const id = randomUUID();
  return {
    nome: `User ${id.substring(0, 8)}`,
    email: `test_${id.substring(0, 8)}@mail.com`,
    senha: "password123",
    perfil: "CLIENTE",
    ...overrides,
  };
};
