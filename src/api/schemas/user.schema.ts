import { z } from "zod";

export const createUserSchema = z.object({
  nome: z.string(),
  email: z.email(),
  senha: z.string().min(6),
  perfil: z
    .enum(["ADMIN", "GERENTE", "ATENDENTE", "CLIENTE"])
    .default("CLIENTE"),
});

export const updateUserSchema = z
  .object({
    nome: z.string().optional(),
    email: z.email().optional(),
    senha: z.string().min(6).optional(),
    perfil: z.enum(["ADMIN", "GERENTE", "ATENDENTE", "CLIENTE"]).optional(),
  })
  .strict();
