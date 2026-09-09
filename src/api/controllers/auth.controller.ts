import { AuthService } from "@src/services/auth.service";
import { loginSchema, signupSchema } from "@src/api/schemas/auth.schema";
import { logEvent } from "@src/utils/logger";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";

const service = new AuthService();

export class AuthController {
  async login(
    req: FastifyRequest<{ Body: z.infer<typeof loginSchema> }>,
    reply: FastifyReply,
  ) {
    try {
      const { email, senha } = req.body;
      const result = await service.login(email, senha);
      logEvent("User was logged: ", { user_id: result.user.id });

      return reply.send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Login error occurred: ", message);

      return reply.code(401).send({ error: message });
    }
  }

  async signup(
    req: FastifyRequest<{ Body: z.infer<typeof signupSchema> }>,
    reply: FastifyReply,
  ) {
    try {
      const { nome, email, senha, perfil } = req.body;
      const result = await service.signup(nome, email, senha, perfil);
      logEvent("User was registered: ", { user_email: result.user.email });

      return reply.send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] User register error occurred: ", message);

      return reply.code(401).send({ error: message });
    }
  }
}
