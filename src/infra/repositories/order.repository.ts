import database from "@src/infra/db/database";
import { Order, OrderItem, OrderStatus } from "@src/domain/entities";

export class OrderRepository {
  async create(
    orderData: Partial<Order>,
    items: Partial<OrderItem>[],
  ): Promise<Order> {
    const orderResult = await database.query({
      text: `INSERT INTO pedido (usuario_id, unidade_id, status, canal, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      values: [
        orderData.usuario_id,
        orderData.unidade_id,
        orderData.status,
        orderData.canal,
        orderData.total,
      ],
    });

    const order = orderResult.rows[0];

    for (const item of items) {
      await database.query({
        text: `INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        values: [
          order.id,
          item.produto_id,
          item.quantidade,
          item.preco_unitario,
        ],
      });
    }

    return order;
  }

  async processPayment(orderId: string) {
    try {
      await database.query({ text: "BEGIN" });
      await database.query({
        text: "UPDATE pedido SET status = $1, updated_at = NOW() WHERE id = $2",
        values: [OrderStatus.RECEBIDO, orderId],
      });
      await database.query({ text: "COMMIT" });
    } catch (error) {
      await database.query({ text: "ROLLBACK" });
      throw error;
    }
  }

  async findById(id: string): Promise<Order | undefined> {
    const result = await database.query({
      text: "SELECT * FROM pedido WHERE id = $1",
      values: [id],
    });
    const order = result.rows[0];

    if (order) {
      const itemsResult = await database.query({
        text: "SELECT * FROM item_pedido WHERE pedido_id = $1",
        values: [order.id],
      });
      order.itens = itemsResult.rows;
    }

    return order;
  }

  async findAll(): Promise<Order[]> {
    const result = await database.query({
      text: "SELECT * FROM pedido ORDER BY created_at DESC",
    });
    return result.rows;
  }

  async updateStatus(
    id: string,
    status: OrderStatus,
  ): Promise<Order | undefined> {
    const result = await database.query({
      text: "UPDATE pedido SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *",
      values: [status, id],
    });
    return result.rows[0];
  }
}
