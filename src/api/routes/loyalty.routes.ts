import { LoyaltyController } from "@src/api/controllers/loyalty.controller";
import { verifyJwt, verifyProfile } from "@src/api/middlewares/auth.middleware";
import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";

const controller = new LoyaltyController();

export const loyaltyRoutes: FastifyPluginAsyncZod = async (app) => {
  app.get("/programa-fidelidade/:id", {
    preHandler: [verifyJwt, verifyProfile(["ADMIN", "GERENTE", "ATENDENTE", "CLIENTE"])],
    schema: {
      tags: ["loyalties"],
      security: [{ bearerAuth: [] }],
    },
    handler: controller.userHasLoyaltyProgram.bind(controller),
  });
};
