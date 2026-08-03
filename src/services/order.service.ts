import { ProductRepository } from "@src/infra/repositories/product.repository";
import { OrderRepository } from "@src/infra/repositories/order.repository";
import { PaymentMockProvider } from "@src/infra/providers/payment-mock.provider";
import { OrderStatus, UserProfile } from "@src/domain/entities";
import { UserRepository } from "@src/infra/repositories/user.repository";

export class OrderService {
  private productRepo = new ProductRepository();
  private orderRepo = new OrderRepository();
  private paymentMock = new PaymentMockProvider();

  async createOrder(data: {
    usuario_id: string;
    unidade_id: string;
    canal: string;
    itens: { produto_id: string; quantidade: number; preco_unitario: number }[];
  }) {
    let total = 0;

    for (const item of data.itens) {
      const produto = await this.productRepo.findByIdForUpdate(item.produto_id);

      if (!produto) {
        throw new Error(`Produto ${item.produto_id} não encontrado`);
      }

      if (produto.estoque_total < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${produto.nome}`);
      }

      const novoEstoque = produto.estoque_total - item.quantidade;
      await this.productRepo.updateStock(produto.id, novoEstoque);

      total += item.quantidade * Number(produto.preco);
      item.preco_unitario = Number(produto.preco);
    }

    const order = await this.orderRepo.create(
      {
        usuario_id: data.usuario_id,
        unidade_id: data.unidade_id,
        canal: data.canal as any,
        status: OrderStatus.AGUARDANDO_PAGAMENTO,
        total,
      },
      data.itens,
    );

    const paymentResult = await this.paymentMock.processPayment(
      order.id,
      total,
    );

    if (!paymentResult.success) {
      throw new Error("Pagamento recusado");
    }

    const process = await this.orderRepo.processPayment(order.id);

    return { ...order, status: OrderStatus.RECEBIDO, payment: paymentResult };
  }

  async list() {
    return this.orderRepo.findAll();
  }

  async updateStatus(
    pedidoId: string,
    newStatus: OrderStatus,
    user: { id: string },
  ) {
    const order = await this.orderRepo.findById(pedidoId);
    if (!order) throw new Error("Pedido não encontrado");

    const validTransitions: Record<OrderStatus, OrderStatus[]> = {
      [OrderStatus.AGUARDANDO_PAGAMENTO]: [
        OrderStatus.RECEBIDO,
        OrderStatus.CANCELADO,
      ],
      [OrderStatus.RECEBIDO]: [
        OrderStatus.EM_PREPARACAO,
        OrderStatus.CANCELADO,
      ],
      [OrderStatus.EM_PREPARACAO]: [OrderStatus.PRONTO, OrderStatus.CANCELADO],
      [OrderStatus.PRONTO]: [OrderStatus.FINALIZADO],
      [OrderStatus.FINALIZADO]: [],
      [OrderStatus.CANCELADO]: [],
    };

    if (!validTransitions[order.status as OrderStatus].includes(newStatus)) {
      throw new Error(
        `Transição inválida de ${order.status} para ${newStatus}`,
      );
    }

    const { perfil: userProfile } = (await new UserRepository().findById(
      user.id,
    )) as {
      perfil: UserProfile;
    };

    if (
      newStatus === OrderStatus.CANCELADO &&
      userProfile !== UserProfile.GERENTE &&
      userProfile !== UserProfile.ADMIN
    ) {
      throw new Error("Apenas gerentes e admins podem cancelar pedidos");
    }

    return this.orderRepo.updateStatus(pedidoId, newStatus);
  }
}
