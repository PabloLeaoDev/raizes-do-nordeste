import { AuthService } from "../../services/auth.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

const service = new AuthService();

export class AuthController {
  async login(req: FastifyRequest<{ Body: z.infer<typeof loginSchema> }>, reply: FastifyReply) {
    const { email, senha } = req.body;

    const result = await service.login(email, senha);
    return reply.send(result);
  }

  async signup(req: FastifyRequest<{ Body: z.infer<typeof signupSchema> }>, reply: FastifyReply) {
    const { nome, email, senha, perfil } = req.body;

    const result = await service.signup(nome, email, senha, perfil);
    return reply.send(result);
  }
}