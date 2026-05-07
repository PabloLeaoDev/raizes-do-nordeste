import pool from "../infra/db/database";
import { ProductRepository } from "../infra/repositories/product.repository";
import { OrderRepository } from "../infra/repositories/order.repository";
import { PaymentMockProvider } from "../infra/providers/payment-mock.provider";
import { OrderStatus, UserProfile } from "../domain/entities";

export class OrderService {
  private productRepo = new ProductRepository();
  private orderRepo = new OrderRepository();
  private paymentMock = new PaymentMockProvider();

  async criarPedido(data: { usuario_id: string; unidade_id: string; canal: string; itens: { produto_id: string; quantidade: number; preco_unitario: number }[] }) {
    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      let total = 0;

      // 1. Reserva de estoque
      for (const item of data.itens) {
        const produto = await this.productRepo.findByIdForUpdate(item.produto_id, client);
        
        if (!produto) {
          throw new Error(`Produto ${item.produto_id} não encontrado`);
        }
        
        if (produto.estoque_total < item.quantidade) {
          throw new Error(`Estoque insuficiente para o produto ${produto.nome}`);
        }

        const novoEstoque = produto.estoque_total - item.quantidade;
        await this.productRepo.updateStock(produto.id, novoEstoque, client);
        
        total += item.quantidade * Number(produto.preco);
        item.preco_unitario = Number(produto.preco); // Usa preço real
      }

      // 2. Prepara pedido
      const order = await this.orderRepo.create({
        usuario_id: data.usuario_id,
        unidade_id: data.unidade_id,
        canal: data.canal as any,
        status: OrderStatus.AGUARDANDO_PAGAMENTO,
        total
      }, data.itens, client);

      // 3. Pagamento
      const paymentResult = await this.paymentMock.processPayment(order.id, total);

      if (!paymentResult.success) {
        throw new Error("Pagamento recusado");
      }

      // Atualiza status se pago
      await client.query("UPDATE pedido SET status = $1 WHERE id = $2", [OrderStatus.RECEBIDO, order.id]);
      
      await client.query("COMMIT");
      return { ...order, status: OrderStatus.RECEBIDO, payment: paymentResult };
      
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  }

  async list() {
    return this.orderRepo.findAll();
  }

  async updateStatus(pedidoId: string, newStatus: OrderStatus, userProfile: UserProfile) {
    const order = await this.orderRepo.findById(pedidoId);
    if (!order) throw new Error("Pedido não encontrado");

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.AGUARDANDO_PAGAMENTO]: [OrderStatus.RECEBIDO, OrderStatus.CANCELADO],
      [OrderStatus.RECEBIDO]: [OrderStatus.EM_PREPARACAO, OrderStatus.CANCELADO],
      [OrderStatus.EM_PREPARACAO]: [OrderStatus.PRONTO, OrderStatus.CANCELADO],
      [OrderStatus.PRONTO]: [OrderStatus.FINALIZADO],
      [OrderStatus.FINALIZADO]: [],
      [OrderStatus.CANCELADO]: []
    };

    if (!validTransitions[order.status as OrderStatus].includes(newStatus)) {
      throw new Error(`Transição inválida de ${order.status} para ${newStatus}`);
    }

    // Regras de perfil
    if (newStatus === OrderStatus.CANCELADO && userProfile !== UserProfile.GERENTE && userProfile !== UserProfile.ADMIN) {
      throw new Error("Apenas gerentes e admins podem cancelar pedidos");
    }

    return this.orderRepo.updateStatus(pedidoId, newStatus);
  }
}
