import { OrderService } from "../../services/order.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";

const service = new OrderService();

export class OrderController {
  async create(req: FastifyRequest | any, reply: FastifyReply) {
    const user = (req as any).user;
    
    const result = await service.criarPedido({
      ...req.body,
      usuario_id: user.id
    });
    
    return reply.code(201).send(result);
  }

  async list(req: FastifyRequest | any, reply: FastifyReply) {
    const result = await service.list();
    return reply.send(result);
  }

  async updateStatus(req: FastifyRequest | any, reply: FastifyReply) {
    const user = (req as any).user;
    const { id } = req.params;
    const { status } = req.body;

    const result = await service.updateStatus(id, status as any, user.perfil);
    return reply.send(result);
  }
}
