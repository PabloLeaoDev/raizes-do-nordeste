import pool from '../db/database';
import { Order, OrderItem, OrderStatus } from '../../domain/entities';
import { PoolClient } from 'pg';

export class OrderRepository {
  async create(orderData: Partial<Order>, items: Partial<OrderItem>[], client: PoolClient): Promise<Order> {
    const orderResult = await client.query(
      `INSERT INTO pedido (usuario_id, unidade_id, status, canal, total)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [orderData.usuario_id, orderData.unidade_id, orderData.status, orderData.canal, orderData.total]
    );

    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO item_pedido (pedido_id, produto_id, quantidade, preco_unitario)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.produto_id, item.quantidade, item.preco_unitario]
      );
    }

    return order;
  }

  async findById(id: string): Promise<Order | undefined> {
    const result = await pool.query('SELECT * FROM pedido WHERE id = $1', [id]);
    const order = result.rows[0];

    if (order) {
      const itemsResult = await pool.query('SELECT * FROM item_pedido WHERE pedido_id = $1', [order.id]);
      order.itens = itemsResult.rows;
    }

    return order;
  }

  async findAll(): Promise<Order[]> {
    const result = await pool.query('SELECT * FROM pedido ORDER BY data_criacao DESC');
    return result.rows;
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order | undefined> {
    const result = await pool.query(
      'UPDATE pedido SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    return result.rows[0];
  }
}
