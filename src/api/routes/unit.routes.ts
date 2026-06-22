import { UnitController } from "@src/api/controllers/unit.controller";
import {
  createUnitSchema,
  updateUnitSchema,
} from "@src/api/schemas/unit.schema";
import { verifyJwt, verifyProfile } from "@src/api/middlewares/auth.middleware";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const controller = new UnitController();

export const unitRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/unidades", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Units"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.list.bind(controller),
  });

  app.get("/unidades/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Units"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.findById.bind(controller),
  });

  app.get("/unidades/:unitId/produtos/:productId?", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Units"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.getUnitProduct.bind(controller),
  });

  app.post("/unidades", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Units"],
      security: [{ bearerAuth: [] }],
      body: createUnitSchema,
    },
    handler: controller.create.bind(controller),
  });

  app.put("/unidades/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Units"],
      security: [{ bearerAuth: [] }],
      body: updateUnitSchema,
    },
    handler: controller.update.bind(controller),
  });

  app.delete("/unidades/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Units"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.delete.bind(controller),
  });
};
