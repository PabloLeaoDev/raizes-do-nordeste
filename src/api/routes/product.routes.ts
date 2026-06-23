import { ProductController } from "@src/api/controllers/product.controller";
import {
  createProductSchema,
  updateProductSchema,
} from "@src/api/schemas/product.schema";
import { verifyJwt, verifyProfile } from "@src/api/middlewares/auth.middleware";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const controller = new ProductController();

export const productRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/produtos", {
    preHandler: [
      verifyJwt,
      verifyProfile(["ADMIN", "GERENTE", "ATENDENTE", "CLIENTE"]),
    ],
    schema: {
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.list.bind(controller),
  });

  app.get("/produtos/:id", {
    preHandler: [
      verifyJwt,
      verifyProfile(["ADMIN", "GERENTE", "ATENDENTE", "CLIENTE"]),
    ],
    schema: {
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.findById.bind(controller),
  });

  app.post("/produtos", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE"])],
    schema: {
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      body: createProductSchema,
    },
    handler: controller.create.bind(controller),
  });

  app.put("/produtos/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE"])],
    schema: {
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
      body: updateProductSchema,
    },
    handler: controller.update.bind(controller),
  });

  app.delete("/produtos/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE"])],
    schema: {
      tags: ["Products"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.delete.bind(controller),
  });
};
