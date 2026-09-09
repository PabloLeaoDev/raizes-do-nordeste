import { UnitService } from "@src/services/unit.service";
import { logEvent } from "@src/utils/logger";
import { FastifyRequest, FastifyReply } from "fastify";

export class UnitController {
  private service = new UnitService();

  async getUnitProduct(req: FastifyRequest | any, reply: FastifyReply) {
    const { productId } = req.params;
    return await (productId
      ? this.findUnitProductById(req, reply)
      : this.listUnitProducts(req, reply));
  }

  async create(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.createUnit(req.body);
      logEvent("Unit was created: ", { unit_id: result.id });

      return reply.code(201).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Create unit error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async update(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const unit = await this.service.findById(req.params.id),
        unitData = req.body;

      if (!unit) {
        throw new Error("Unidade não encontrada");
      } else if (!unitData.nome && !unitData.endereco) {
        throw new Error("Dados inválidos para atualizar");
      } else if (
        unitData.nome === unit.nome &&
        unitData.endereco === unit.endereco
      ) {
        throw new Error("Unidade já atualizada");
      }

      const result = await this.service.updateUnit(req.params.id, req.body);

      logEvent("Unit was updated: ", { unit_id: result.id });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Update unit error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async delete(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const unit = await this.service.findById(req.params.id);
      if (!unit) throw new Error("Unidade não encontrada");
      const result = await this.service.deleteUnit(req.params.id);

      logEvent("Unit was deleted: ", { unit_name: result.nome });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Delete unit error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async list(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.list();
      logEvent("Unit was listed: ", { unit_id: result.id });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] List units error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async listUnitProducts(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const { unitId } = req.params;
      const result = await this.service.listUnitProducts(unitId);

      logEvent("Unit products was listed");

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] List unit products error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async findById(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = (await this.service.findById(req.params.id)) || null;
      logEvent("Unit was finded: ", { unit_id: result });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Find unit error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async findUnitProductById(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const { unitId, productId } = req.params;
      const result = await this.service.findUnitProductById(unitId, productId);

      logEvent("Unit product was finded: ", { unit_id: result });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Find unit product error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }
}
