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
        let unitResult = {} as QueryResult<Unit>,
        query = "UPDATE unidade SET ",
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

        unitResult = await pool.query(query, [...queryValues, id]);

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
