import { UserService } from "@src/services/user.service";
import { logEvent } from "@src/utils/logger";
import { FastifyRequest, FastifyReply } from "fastify";

export class UserController {
  private service = new UserService();

  async create(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.createUser(req.body);
      logEvent("User was created: ", { user_id: result.id });

      return reply.code(201).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Create user error occurred", message);

      return reply.code(400).send({ error: message });
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

      logEvent("User was updated: ", { user_id: result.id });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Update user error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async delete(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const user = await this.service.findById(req.params.id);
      if (!user) throw new Error("Usuário não encontrado");
      const result = await this.service.deleteUser(req.params.id);

      logEvent("User was deleted: ", message);

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Delete user error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async list(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.list();
      logEvent("Users was listed");

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] List users error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async findById(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = (await this.service.findById(req.params.id)) || null;
      logEvent("User was finded: ", message);

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Find user error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }
}
