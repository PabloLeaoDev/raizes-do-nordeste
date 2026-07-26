import database from "@src/infra/db/database";
import { User, UserProfile } from "@src/domain/entities";
import { QueryResult } from "pg";

export class UserRepository {
  async findByEmail(email: string): Promise<User | undefined> {
    const result = await database.query({
      text: "SELECT id, email, senha_hash FROM usuario WHERE email = $1",
      values: [email],
    });
    return result.rows[0];
  }

  async findById(id: string): Promise<Omit<User, "senha_hash"> | undefined> {
    const result = await database.query({
      text: "SELECT id, nome, email, perfil, created_at FROM usuario WHERE id = $1",
      values: [id],
    });
    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const result = await database.query({
      text: "SELECT id, nome, email, perfil, created_at FROM usuario ORDER BY nome DESC",
    });
    return result.rows;
  }

  async create({
    nome,
    email,
    senhaHash,
    perfil,
  }: {
    nome: string;
    email: string;
    senhaHash: string;
    perfil: UserProfile;
  }): Promise<Omit<User, "senha_hash">> {
    const result = await database.query({
      text: `INSERT INTO usuario (nome, email, senha_hash, perfil)
       VALUES ($1, $2, $3, $4) RETURNING id, nome, email, perfil, created_at`,
      values: [nome, email, senhaHash, perfil],
    });
    return result.rows[0];
  }

  async update(userData: {
    id: string;
    nome?: string;
    email?: string;
    senhaHash?: string;
    perfil?: UserProfile;
  }): Promise<User> {
    let userResult = {} as QueryResult<User>,
      query = "UPDATE usuario SET ",
      queryValues: Array<string | number> = [],
      queryCount = 1;

    const dataList = Object.entries(userData);

    for (let i = 0; i < dataList.length; i++) {
      const currentDataListElement = dataList[i];
      if (currentDataListElement[1]) {
        queryValues.push(currentDataListElement[1]);
        query += `${currentDataListElement[0]} = $${queryCount}, `;
        queryCount++;
      }
    }

    query += "updated_at = NOW() ";
    query += `WHERE id = $${queryCount} RETURNING id, nome, email, perfil, created_at`;

    userResult = await database.query({
      text: query,
      values: [...queryValues, userData.id],
    });

    return userResult.rows[0];
  }

  async delete(id: string): Promise<User> {
    const userResult = await database.query({
      text: `DELETE FROM usuario WHERE id = $1 RETURNING id, nome, email, perfil, created_at`,
      values: [id],
    });

    return userResult.rows[0];
  }
}
