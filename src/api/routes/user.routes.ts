import { UserController } from "../controllers/user.controller";
import { createUserSchema, updateUserSchema } from "../schemas/user.schema";
import { verifyJwt, verifyProfile } from "../middlewares/auth.middleware";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const controller = new UserController();

export const userRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/usuarios", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE"])],
    schema: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.list.bind(controller),
  });

  app.get("/usuarios/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE"])],
    schema: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.findById.bind(controller),
  });

  app.post("/usuarios", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      body: createUserSchema,
    },
    handler: controller.create.bind(controller),
  });

  app.patch("/usuarios/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
      body: updateUserSchema,
    },
    handler: controller.update.bind(controller),
  });

  app.delete("/usuarios/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN"])],
    schema: {
      tags: ["Users"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.delete.bind(controller),
  });
};
