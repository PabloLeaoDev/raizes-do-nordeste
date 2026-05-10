import { z } from "zod";

export const createUnitSchema = z.object({
    nome: z.string(),
    endereco: z.string(),
});

export const updateUnitSchema = z.object({
    nome: z.string().optional(),
    endereco: z.string().optional(),
}).strict();