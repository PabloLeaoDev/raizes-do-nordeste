import { z } from "zod";

export const createProductSchema = z.object({
    nome: z.string(),
    descricao: z.string().optional(),
    preco: z.number().min(0)
});