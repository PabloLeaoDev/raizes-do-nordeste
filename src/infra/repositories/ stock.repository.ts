export class StockRepository {
  async findForUpdate(produtoId: number, client: any) {
    const r = await client.query(
      "SELECT * FROM produto WHERE id = $1 FOR UPDATE",
      [produtoId]
    );
    return r.rows[0];
  }

  async updateStock(produtoId: number, quantidade: number, client: any) {
    await client.query(
      "UPDATE produto SET estoque_total = $1 WHERE id = $2",
      [quantidade, produtoId]
    );
  }
}