import { LoyaltyService } from "@src/services/loyalty.service";
import { logEvent } from "@src/utils/logger";
import { isUuid } from "@src/utils/validators";
import { FastifyRequest, FastifyReply } from "fastify";

const service = new LoyaltyService();

export class LoyaltyController {
  async userHasLoyaltyProgram(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const { id } = req.params;
      if (!id || !isUuid(id)) throw new Error("The user indentifier is invalid: " + id);
      const result = await service.userHasLoyaltyProgram(id);
      logEvent("List loyaltys successfully");

      return reply.send({ "programa_fidelidade": result });
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] List Loyaltys error: ", message);

      return reply.code(400).send({ error: message });
    }
  }
}
