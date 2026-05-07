import { ProductController } from "../controllers/product.controller";
import { createProductSchema } from "../schemas/product.schema";
import { verifyJwt, verifyProfile } from "../middlewares/auth.middleware";
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const controller = new ProductController();

export const productRoutes: FastifyPluginAsyncZod = async (app) => {
  app.post("/produtos", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE"])],
    schema: {
      tags: ['Products'],
      security: [{ bearerAuth: [] }],
      body: createProductSchema
    },
    handler: controller.create.bind(controller)
  });

  app.get("/produtos", {
    schema: {
      tags: ['Products']
    },
    handler: controller.list.bind(controller)
  });
};
