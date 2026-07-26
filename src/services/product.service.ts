import { ProductRepository } from "@src/infra/repositories/product.repository";
import { Product } from "@src/domain/entities";

export class ProductService {
  private repo = new ProductRepository();

  async createProduct(data: any) {
    const product = await this.repo.create(data);
    return { ...product, preco: Number(product.preco) };
  }

  async updateProduct(id: string, data: Partial<Product>) {
    const product = await this.repo.update(id, data);
    return { ...product, preco: Number(product.preco) };
  }

  async deleteProduct(id: string) {
    const product = await this.repo.delete(id);
    return { ...product, preco: Number(product.preco) };
  }

  async list() {
    const products = await this.repo.findAll();
    return products.map((product) => ({
      ...product,
      preco: Number(product.preco),
    }));
  }

  async findById(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new Error("Produto não encontrado");
    return { ...product, preco: Number(product.preco) };
  }

  async checkStock(id: string) {
    const product = await this.repo.findById(id);
    if (!product) throw new Error("Produto não encontrado");
    return product.estoque_total;
  }
}
