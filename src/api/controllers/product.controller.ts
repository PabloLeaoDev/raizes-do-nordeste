import { ProductService } from "@src/services/product.service";
import { logEvent } from "@src/utils/logger";
import { FastifyRequest, FastifyReply } from "fastify";

export class ProductController {
  private service = new ProductService();

  async create(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = await this.service.createProduct(req.body);
      logEvent("Product was created", { product_id: result.id });

      return reply.code(201).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Create product error occurred", message);

      return reply.code(400).send({ error: message });
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

      logEvent("Product was updated", { product_id: result });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Update product error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async delete(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const unit = await this.service.findById(req.params.id);

      if (!unit)
        throw new Error("Unidade não encontrada");

      const result = await this.service.deleteProduct(req.params.id);

      logEvent("Product was deleted", { product_name: result.nome });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Delete product error occurred", message);

      return reply.code(404).send({ error: message });
    }
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    try {
      const result = await this.service.list();
      logEvent("Products was listed");

      return reply.send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] List products error occurred", message);

      return reply.code(400).send({ error: message });
    }
  }

  async findById(req: FastifyRequest | any, reply: FastifyReply) {
    try {
      const result = (await this.service.findById(req.params.id)) || null;
      logEvent("Products was finded", { product_id: result.id });

      return reply.code(200).send(result);
    } catch (error) {
      const { message } = (error as Error);
      logEvent("[ERROR] Find product error occurred", message);

      return reply.code(404).send({ error: message });
    }
  }
}
