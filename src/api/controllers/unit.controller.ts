import { UnitService } from "../../services/unit.service";
import { FastifyRequest, FastifyReply } from "fastify";

const service = new UnitService();

export class UnitController {
    async create(req: FastifyRequest | any, reply: FastifyReply) {
        const result = await service.createUnit(req.body);

        return reply.code(201).send(result);
    }

    async update(req: FastifyRequest | any, reply: FastifyReply) {
        const unit = await service.findById(req.params.id);

        if (!unit) {
            throw new Error('Unidade não encontrada');
        } else if (!req.body.nome && !req.body.endereco) {
            throw new Error('Dados inválidos para atualizar');
        } else if (req.body.nome === unit.nome && req.body.endereco === unit.endereco) {
            throw new Error('Unidade já atualizada');
        }

        const result = await service.updateUnit(req.params.id, req.body);

        return reply.code(200).send(result);
    }

    async delete(req: FastifyRequest | any, reply: FastifyReply) {
        const unit = await service.findById(req.params.id);

        if (!unit) {
            throw new Error('Unidade não encontrada');
        }

        const result = await service.deleteUnit(req.params.id);

        return reply.code(200).send(result);
    }

    async list(req: FastifyRequest | any, reply: FastifyReply) {
        const result = await service.list();

        return reply.code(200).send(result);
    }

    async findById(req: FastifyRequest | any, reply: FastifyReply) {
        const result = await service.findById(req.params.id);

        return reply.code(200).send(result);
    }
}
