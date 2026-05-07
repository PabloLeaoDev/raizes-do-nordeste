import { FastifyRequest, FastifyReply } from 'fastify';
import jwt from 'jsonwebtoken';

export async function verifyJwt(request: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = request.headers.authorization;
    if (!authHeader) {
      throw new Error('Token não fornecido');
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    
    (request as any).user = decoded;
  } catch (err) {
    reply.code(401).send({ error: 'Não autorizado' });
  }
}

export function verifyProfile(allowedProfiles: string[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const user = (request as any).user;
      if (!user || !allowedProfiles.includes(user.perfil)) {
        reply.code(403).send({ error: 'Acesso negado' });
      }
    } catch (err) {
      reply.code(403).send({ error: 'Acesso negado' });
    }
  };
}
