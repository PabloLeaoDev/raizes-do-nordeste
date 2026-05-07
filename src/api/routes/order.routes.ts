import { OrderController } from "../controllers/order.controller";
import { createOrderSchema, updateOrderStatusSchema } from "../schemas/order.schema";
import { verifyJwt, verifyProfile } from "../middlewares/auth.middleware";
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from "zod";

const controller = new OrderController();

export const orderRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post("/pedidos", {
    preHandler: [verifyJwt],
    schema: {
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      body: createOrderSchema
    },
    handler: controller.create.bind(controller)
  });

  app.get("/pedidos", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE", "ATENDENTE"])],
    schema: {
      tags: ['Orders'],
      security: [{ bearerAuth: [] }]
    },
    handler: controller.list.bind(controller)
  });

  app.patch("/pedidos/:id/status", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE", "ATENDENTE"])],
    schema: {
      tags: ['Orders'],
      security: [{ bearerAuth: [] }],
      params: z.object({ id: z.string().uuid() }),
      body: updateOrderStatusSchema
    },
    handler: controller.updateStatus.bind(controller)
  });
};
