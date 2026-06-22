import { UserService } from "@src/services/user.service";
import { FastifyRequest, FastifyReply } from "fastify";

export class UserController {
  private service = new UserService();

  async create(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.createUser(req.body);
      return reply.code(201).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
    }
  }

  async update(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const userForUpdate = await this.service.findById(req.params.id),
        userForUpdateData = req.body;

      if (!userForUpdate) {
        throw new Error("Usuário não encontrado");
      } else if (
        !userForUpdateData.nome &&
        !userForUpdateData.email &&
        !userForUpdateData.perfil &&
        !userForUpdateData.senha
      ) {
        throw new Error("Dados inválidos para atualizar");
      } else if (
        userForUpdateData.nome === userForUpdate.nome &&
        userForUpdateData.email === userForUpdate.email &&
        userForUpdateData.perfil === userForUpdate.perfil
      ) {
        throw new Error("Usuário já atualizado");
      }

      const result = await this.service.updateUser((req as any).user, {
        id: req.params.id,
        ...userForUpdateData,
      });
      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
    }
  }

  async delete(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const user = await this.service.findById(req.params.id);
      if (!user) throw new Error("Usuário não encontrado");
      const result = await this.service.deleteUser(req.params.id);
      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
    }
  }

  async list(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.list();
      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
    }
  }

  async findById(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = (await this.service.findById(req.params.id)) || null;
      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
    }
  }
}
