import { ProductService } from "@src/services/product.service";
import { FastifyRequest, FastifyReply } from "fastify";

export class ProductController {
  private service = new ProductService();

  async create(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.createProduct(req.body);
      return reply.code(201).send(result);
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async update(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const product = await this.service.findById(req.params.id),
        productData = req.body;

      if (!product) {
        throw new Error("Produto não encontrado");
      } else if (
        !productData.nome &&
        !productData.preco &&
        !productData.descricao &&
        !productData.estoque_total
      ) {
        throw new Error("Dados inválidos para atualizar");
      } else if (
        productData.nome === product.nome &&
        productData.preco === product.preco &&
        productData.descricao === product.descricao &&
        productData.estoque_total === product.estoque_total
      ) {
        throw new Error("Produto já atualizado");
      }

      const result = await this.service.updateProduct(
        req.params.id,
        productData,
      );

      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async delete(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const unit = await this.service.findById(req.params.id);

      if (!unit) {
        throw new Error("Unidade não encontrada");
      }

      const result = await this.service.deleteProduct(req.params.id);

      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(404).send({ error: (error as Error).message });
    }
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.service.list();
      return reply.send(result);
    } catch (error) {
      return reply.code(400).send({ error: (error as Error).message });
    }
  }

  async findById(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = (await this.service.findById(req.params.id)) || null;
      return reply.code(200).send(result);
    } catch (error) {
      return reply.code(404).send({ error: (error as Error).message });
    }
  }
}
