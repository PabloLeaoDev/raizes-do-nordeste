import pool from "../db/database";

export class UnitRepository {
  async create(nome: string, endereco: string) {
    const res = await pool.query(
      "INSERT INTO unidade (nome, endereco) VALUES ($1, $2) RETURNING *",
      [nome, endereco]
    );
    return res.rows[0];
  }
}