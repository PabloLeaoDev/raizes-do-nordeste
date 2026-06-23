import { FastifyRequest, FastifyReply } from "fastify";
import { UserRepository } from "@src/infra/repositories/user.repository";
import jwt from "jsonwebtoken";

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      return reply.code(401).send({
        error: "Token não fornecido",
      });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    (request as any).user = decoded;
  } catch (err) {
    return reply.code(401).send({ error: "Não autorizado" });
  }
}

export function verifyProfile(allowedProfiles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = (request as any).user,
        error = "Acesso negado";

      if (!user) {
        return reply.code(403).send({ error });
      }

      const userExists = await new UserRepository().findById(user.id);

      if (!userExists) {
        return reply.code(403).send({ error });
      }

      if (!allowedProfiles.includes(userExists.perfil)) {
        return reply.code(403).send({ error });
      }
    } catch (err) {
      return reply.code(403).send({ error: (err as Error).message });
    }
  };
}
