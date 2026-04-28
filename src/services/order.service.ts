import { withTransaction } from "../infra/db/transaction";
import { processPaymentMock } from "../infra/providers/payment.mock";
import { StockRepository } from "../infra/repositories/ stock.repository";
// import { OrderRepository } from "../infra/repositories/order.repository";
// import { logTransaction } from "../utils/logger";

export class OrderService {
  private estoqueRepo = new StockRepository();
  // private orderRepo = new OrderRepository();

  async criarPedido(data: any) {
    return await withTransaction(async (client) => {
      // 1 — Reservar itens
      for (const item of data.itens) {
        const produto = await this.estoqueRepo.findForUpdate(
          item.produto_id,
          client,
        );

        if (!produto || produto.estoque_total < item.quantidade) {
          throw new Error("Estoque insuficiente");
        }

        const novoEstoque = produto.estoque_total - item.quantidade;
        await this.estoqueRepo.updateStock(produto.id, novoEstoque, client);
      }

      // 2 — Simular Pagamento
      const payment = await processPaymentMock();

      // logTransaction({
      //   evento: "pagamento",
      //   pedido: data,
      //   resultado: payment
      // });

      if (!payment.success) throw new Error("Pagamento recusado");

      // 3 — Criar pedido
      // const pedidoCriado = await this.orderRepo.create(data, client);

      // return pedidoCriado;
    });
  }
}

function logTransaction(arg0: {
  evento: string;
  pedido: any;
  resultado: { success: boolean; transactionId: number; timestamp: Date };
}) {
  throw new Error("Function not implemented.");
}
