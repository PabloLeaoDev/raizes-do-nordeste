import { UnitService } from "@src/services/unit.service";
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
      return reply.code(201).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
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
      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
    }
  }

  async delete(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const unit = await this.service.findById(req.params.id);
      if (!unit) throw new Error("Unidade não encontrada");
      const result = await this.service.deleteUnit(req.params.id);
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

  async listUnitProducts(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const { unitId } = req.params;
      const result = await this.service.listUnitProducts(unitId);

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

  async findUnitProductById(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const { unitId, productId } = req.params;
      const result = await this.service.findUnitProductById(unitId, productId);
      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ message: (error as Error).message });
    }
  }
}
