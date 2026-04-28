import { ProductRepository } from "../infra/repositories/product.repository";

export class ProductService {
  private repo = new ProductRepository();

  async createProduct(data: any) {
    return await this.repo.create(data);
  }
  async list() {
    return await this.repo.findAll();
  }
}