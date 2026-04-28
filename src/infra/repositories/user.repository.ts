import { pool } from "../db/client";

export class UserRepository {
    async findByEmail(email: string) {
        const result = await pool.query(
            "SELECT * FROM usuario WHERE email = $1",
            [email]
        );
        return result.rows[0];
    }

    async create({ nome, email, senhaHash, perfil }: any) {
        const result = await pool.query(
            `INSERT INTO usuario (nome, email, senha_hash, perfil)
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [nome, email, senhaHash, perfil]
        );
        return result.rows[0];
    }
}