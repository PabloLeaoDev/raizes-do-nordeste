import { z } from "zod";

export const createProductSchema = z.object({
  nome: z.string().min(3),
  descricao: z.string().optional(),
  preco: z.number().positive(),
  estoque_total: z.number().int().nonnegative().default(0),
  unidade_id: z.uuid(),
});

export const updateProductSchema = z.object({
  nome: z.string().min(3).optional(),
  descricao: z.string().optional(),
  preco: z.number().positive().optional(),
  estoque_total: z.number().int().nonnegative().optional(),
  unidade_id: z.uuid().optional(),
});
