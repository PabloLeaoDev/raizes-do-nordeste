import { ProductRepository } from "../infra/repositories/product.repository";

export class ProductService {
  private repo = new ProductRepository();

  async createProduct(data: any) {
    return await this.repo.create(data);
  }

  async list() {
    return await this.repo.findAll();
  }

  async checkStock(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new Error("Produto não encontrado");
    return product.estoque_total;
  }
}