import { randomUUID } from "crypto";
import { UnitRepository } from "@src/infra/repositories/unit.repository";

export const generateProduct = async (overrides = {}) => {
  const id = randomUUID();
  const units = await new UnitRepository().findAll();
  return {
    nome: `Produto ${id.substring(0, 8)}`,
    descricao: "Descrição de teste",
    preco: parseFloat((Math.random() * 100).toFixed(2)) || 10.5,
    estoque_total: Math.floor(Math.random() * 100) + 10,
    unidade_id: units[0].id || randomUUID(),
    ...overrides,
  };
};
