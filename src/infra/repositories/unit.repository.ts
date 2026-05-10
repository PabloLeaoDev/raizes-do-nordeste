import pool from '../db/database';
import { Unit } from '../../domain/entities';
import { QueryResult } from 'pg';

export class UnitRepository {
    async create(data: { nome: string; endereco: string; }): Promise<Unit> {
        const unitResult = await pool.query(
            `INSERT INTO unidade (nome, endereco) VALUES ($1, $2) RETURNING *`,
            [data.nome, data.endereco]
        );

        return unitResult.rows[0];
    }

    async update(id: string, data: { nome?: string; endereco?: string; }): Promise<Unit> {
        let unitResult = {} as QueryResult<Unit>;

        if (data.nome && data.endereco) {
            unitResult = await pool.query(
                `UPDATE unidade SET nome = $1, endereco = $2 WHERE id = $3 RETURNING *`,
                [data.nome, data.endereco, id]
            );
        } else if (data.nome) {
            unitResult = await pool.query(
                `UPDATE unidade SET nome = $1 WHERE id = $2 RETURNING *`,
                [data.nome, id]
            );
        } else if (data.endereco) {
            unitResult = await pool.query(
                `UPDATE unidade SET endereco = $1 WHERE id = $2 RETURNING *`,
                [data.endereco, id]
            );
        }

        return unitResult.rows[0];
    }

    async delete(id: string): Promise<Unit> {
        const unitResult = await pool.query(
            `DELETE FROM unidade WHERE id = $1 RETURNING *`,
            [id]
        );

        return unitResult.rows[0];
    }

    async findById(id: string): Promise<Unit | undefined> {
        const result = await pool.query('SELECT * FROM unidade WHERE id = $1', [id]);
        return result.rows[0];
    }

    async findAll(): Promise<Unit[]> {
        const result = await pool.query('SELECT * FROM unidade ORDER BY nome DESC');
        return result.rows;
    }
}
