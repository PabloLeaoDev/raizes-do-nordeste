import { pool } from "../db/client";

export class ProductRepository {
  async create(data: any, client = pool) {
    const result = await client.query(
      `INSERT INTO produto (nome, descricao, preco, estoque_total)
       VALUES ($1, $2, $3, 0)
       RETURNING *`,
      [data.nome, data.descricao ?? "", data.preco]
    );
    return result.rows[0];
  }

  async findAll() {
    const result = await pool.query("SELECT * FROM produto");
    return result.rows;
  }
}