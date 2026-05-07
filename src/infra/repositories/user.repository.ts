import pool from "../db/database";
import { User, UserProfile } from "../../domain/entities";

export class UserRepository {
    async findByEmail(email: string): Promise<User | undefined> {
        const result = await pool.query(
            "SELECT * FROM usuario WHERE email = $1",
            [email]
        );
        return result.rows[0];
    }

    async findById(id: string): Promise<Omit<User, 'senha_hash'> | undefined> {
        const result = await pool.query(
            "SELECT id, nome, email, perfil, criado_em FROM usuario WHERE id = $1",
            [id]
        );
        return result.rows[0];
    }

    async create({ nome, email, senhaHash, perfil }: { nome: string, email: string, senhaHash: string, perfil: UserProfile }): Promise<Omit<User, 'senha_hash'>> {
        const result = await pool.query(
            `INSERT INTO usuario (nome, email, senha_hash, perfil)
       VALUES ($1, $2, $3, $4) RETURNING id, nome, email, perfil, criado_em`,
            [nome, email, senhaHash, perfil]
        );
        return result.rows[0];
    }
}