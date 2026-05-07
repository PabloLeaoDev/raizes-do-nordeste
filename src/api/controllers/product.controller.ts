import { ProductService } from "../../services/product.service";
import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { createProductSchema } from "../schemas/product.schema";

const service = new ProductService();

export class ProductController {
  async create(req: FastifyRequest | any, reply: FastifyReply) {
    const result = await service.createProduct(req.body);
    return reply.code(201).send(result);
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    const result = await service.list();
    return reply.send(result);
  }
}
