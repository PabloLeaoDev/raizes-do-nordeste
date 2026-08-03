import { OrderService } from "@src/services/order.service";
import { logEvent } from "@src/utils/logger";
import { FastifyRequest, FastifyReply } from "fastify";

const service = new OrderService();

export class OrderController {
  async create(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const user = (req as any).user;

      const result = await service.createOrder({
        ...req.body,
        usuario_id: user.id,
      });

      logEvent("Create order success: ", result);
      return reply.code(201).send(result);
    } catch (error) {
      let message = (error as Error).message,
        statusCode = 404;
      logEvent("Create order error: ", message);
      if (message.includes("insuficiente")) statusCode = 409;
      return reply.code(statusCode).send({ error: (error as Error).message });
    }
  }

  async list(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await service.list();
      logEvent("List orders success: ", result);
      return reply.send(result);
    } catch (error) {
      logEvent("List orders error: ", error.message);
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async updateStatus(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const user = (req as any).user,
        { id } = req.params,
        { status } = req.body;

      const result = await service.updateStatus(id, status as any, user);
      logEvent("Update order success: ", result);
      return reply.send(result);
    } catch (error) {
      logEvent("Update order error: ", error.message);
      return reply.code(400).send({ error: (error as Error).message });
    }
  }
}
