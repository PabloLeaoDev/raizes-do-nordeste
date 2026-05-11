import { ProductRepository } from "../infra/repositories/product.repository";
import { Product } from '../domain/entities';

export class ProductService {
  private repo = new ProductRepository();

  async createProduct(data: any) {
    return await this.repo.create(data);
  }

  async updateProduct(id: string, data: Partial<Product>) {
    await this.repo.update(id, data);
  }

  async deleteProduct(id: string) {
    await this.repo.delete(id);
  }

  async list() {
    return await this.repo.findAll();
  }

  async findById(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new Error("Produto não encontrado");
    return product;
  }

  async checkStock(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new Error("Produto não encontrado");
    return product.estoque_total;
  }
}