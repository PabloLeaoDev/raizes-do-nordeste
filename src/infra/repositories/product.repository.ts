import pool from '../db/database';
import { Product } from '../../domain/entities';
import { PoolClient, QueryResult } from 'pg';
import { CLIENT_RENEG_LIMIT } from 'tls';

export class ProductRepository {
  async create(data: any, client: PoolClient | typeof pool = pool): Promise<Product> {
    const result = await client.query(
      `INSERT INTO produto (nome, descricao, preco, estoque_total)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [data.nome, data.descricao ?? "", data.preco, data.estoque_total ?? 0]
    );
    return result.rows[0];
  }

  async update(id: string, data: { nome?: string, descricao?: string, preco?: number, estoque_total?: number; }): Promise<Product> {
    let productResult = {} as QueryResult<Product>,
      query = "UPDATE produto SET ",
      queryValues: Array<string | number> = [],
      queryCount = 1;

    const dataList = Object.entries(data);

    for (let i = 0; i < dataList.length; i++) {
      const currentDataListElement = dataList[i];
      if (currentDataListElement[1]) {
        queryValues.push(currentDataListElement[1]);
        query += `${currentDataListElement[0]} = $${queryCount}, `;
        queryCount++;
      }
    }

    query += `WHERE id = $${queryCount} RETURNING *`;
    query = query.replace(", WHERE", " WHERE");

    productResult = await pool.query(query, [...queryValues, id]);

    return productResult.rows[0];
  }

  async delete(id: string): Promise<Product> {
    const productResult = await pool.query(
      `DELETE FROM produto WHERE id = $1 RETURNING *`,
      [id]
    );

    return productResult.rows[0];
  }

  async findAll(): Promise<Product[]> {
    const result = await pool.query('SELECT * FROM produto ORDER BY nome ASC');
    return result.rows;
  }

  async findById(id: string): Promise<Product | undefined> {
    const result = await pool.query('SELECT * FROM produto WHERE id = $1', [id]);
    return result.rows[0];
  }

  async findByIdForUpdate(id: string, client: PoolClient): Promise<Product | undefined> {
    const result = await client.query('SELECT * FROM produto WHERE id = $1 FOR UPDATE', [id]);
    return result.rows[0];
  }

  async updateStock(id: string, newStock: number, client: PoolClient): Promise<void> {
    await client.query('UPDATE produto SET estoque_total = $1 WHERE id = $2', [newStock, id]);
  }
}