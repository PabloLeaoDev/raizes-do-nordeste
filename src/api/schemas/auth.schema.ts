import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(6),
});

export const signupSchema = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  perfil: z.enum(["ADMIN", "GERENTE", "ATENDENTE", "CLIENTE"]).default("CLIENTE"),
});