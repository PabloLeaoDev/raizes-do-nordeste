import database from "@src/infra/db/database";
import { Product } from "@src/domain/entities";
import { PoolClient, QueryResult } from "pg";

export class ProductRepository {
  async create(data: any): Promise<Product> {
    const result = await database.query({
      text: `INSERT INTO produto (nome, descricao, preco, estoque_total, unidade_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      values: [
        data.nome,
        data.descricao ?? "",
        data.preco,
        data.estoque_total ?? 0,
        data.unidade_id ?? "",
      ],
    });
    return result.rows[0];
  }

  async update(
    id: string,
    data: {
      nome?: string;
      descricao?: string;
      preco?: number;
      estoque_total?: number;
      unidade_id?: string;
    },
  ): Promise<Product> {
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

    query += "updated_at = NOW() ";
    query += `WHERE id = $${queryCount} RETURNING *`;

    productResult = await database.query({
      text: query,
      values: [...queryValues, id],
    });

    return productResult.rows[0];
  }

  async delete(id: string): Promise<Product> {
    const productResult = await database.query({
      text: `DELETE FROM produto WHERE id = $1 RETURNING *`,
      values: [id],
    });

    return productResult.rows[0];
  }

  async findAll(): Promise<Product[]> {
    const result = await database.query({
      text: "SELECT * FROM produto ORDER BY nome ASC",
    });
    return result.rows;
  }

  async findById(id: string): Promise<Product | undefined> {
    const result = await database.query({
      text: "SELECT * FROM produto WHERE id = $1",
      values: [id],
    });
    return result.rows[0];
  }

  async findByIdForUpdate(id: string): Promise<Product | undefined> {
    const result = await database.query({
      text: "SELECT * FROM produto WHERE id = $1 FOR UPDATE",
      values: [id],
    });
    return result.rows[0];
  }

  async updateStock(id: string, newStock: number): Promise<void> {
    await database.query({
      text: "UPDATE produto SET estoque_total = $1, updated_at = NOW() WHERE id = $2",
      values: [newStock, id],
    });
  }
}
