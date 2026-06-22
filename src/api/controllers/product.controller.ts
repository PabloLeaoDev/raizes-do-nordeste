import { ProductService } from "../../services/product.service";
import { FastifyRequest, FastifyReply } from "fastify";

const service = new ProductService();

export class ProductController {
  async create(req: FastifyRequest | any, reply: FastifyReply) {
    const result = await service.createProduct(req.body);
    return reply.code(201).send(result);
  }

  async update(req: FastifyRequest | any, reply: FastifyReply) {
    const product = await service.findById(req.params.id),
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

    const result = await service.updateProduct(req.params.id, productData);

    return reply.code(200).send(result);
  }

  async delete(req: FastifyRequest | any, reply: FastifyReply) {
    const unit = await service.findById(req.params.id);

    if (!unit) {
      throw new Error("Unidade não encontrada");
    }

    const result = await service.deleteProduct(req.params.id);

    return reply.code(200).send(result);
  }

  async list(req: FastifyRequest, reply: FastifyReply) {
    const result = await service.list();
    return reply.send(result);
  }
}
