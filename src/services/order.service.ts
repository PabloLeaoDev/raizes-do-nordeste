import { ProductRepository } from "@src/infra/repositories/product.repository";
import { OrderRepository } from "@src/infra/repositories/order.repository";
import { PaymentMockProvider } from "@src/infra/providers/payment-mock.provider";
import { OrderStatus, UserProfile } from "@src/domain/entities";
import { UserRepository } from "@src/infra/repositories/user.repository";
import { LoyaltyService } from "@src/services/loyalty.service";


export class OrderService {
  private productRepo = new ProductRepository();
  private orderRepo = new OrderRepository();
  private loyaltyService = new LoyaltyService();
  private paymentMock = new PaymentMockProvider();

  async createOrder(data: {
    usuario_id: string;
    unidade_id: string;
    canal: string;
    itens: { produto_id: string; quantidade: number; preco_unitario: number }[];
  }) {
    let total = 0;

    for (const item of data.itens) {
      const product = await this.productRepo.findByIdForUpdate(item.produto_id);

      if (!product) {
        throw new Error(`Produto ${item.produto_id} não encontrado`);
      }

      if (product.estoque_total < item.quantidade) {
        throw new Error(`Estoque insuficiente para o produto ${product.nome}`);
      }

      const newStock = product.estoque_total - item.quantidade;
      await this.productRepo.updateStock(product.id, newStock);

      total += item.quantidade * Number(product.preco);
      item.preco_unitario = Number(product.preco);
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

    const hasLoyaltyProgram = await this.loyaltyService.userHasLoyaltyProgram(data.usuario_id);

    let getDiscount = { discount: 0, totalWithDiscount: total };
    if (hasLoyaltyProgram)
      getDiscount = this.loyaltyService.applyLoyaltyProgramDiscount(total);

    const paymentResult = await this.paymentMock.processPayment(
      order.id,
      getDiscount.totalWithDiscount,
    );

    if (!paymentResult.success) {
      throw new Error("Pagamento recusado");
    }

    await this.orderRepo.processPayment(order.id);

    return { ...order, status: OrderStatus.RECEBIDO, programa_fidelidade: hasLoyaltyProgram, preco_desconto: getDiscount.discount, preco_final: getDiscount.totalWithDiscount, payment: paymentResult };
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
