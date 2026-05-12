import { app } from "../../app";
import pool from "../../infra/db/database";
import * as bcrypt from "bcrypt";

jest.mock("../../infra/providers/payment-mock.provider", () => {
    return {
        PaymentMockProvider: jest.fn().mockImplementation(() => {
            return {
                processPayment: jest.fn().mockResolvedValue({ success: true, transactionId: "TXN-123", timestamp: new Date() })
            };
        })
    };
});

describe("Order Routes", () => {
    let token: string;
    let userId: string;
    let unidadeId: string;
    let produtoId: string;
    let pedidoId: string;

    beforeAll(async () => {
        await app.ready();
        await pool.query("TRUNCATE TABLE item_pedido, pedido, produto, unidade, usuario RESTART IDENTITY CASCADE");

        // Create Admin user
        const passwordHash = await bcrypt.hash("admin123", 10);
        const userRes = await pool.query(
            `INSERT INTO usuario (nome, email, senha_hash, perfil) VALUES ($1, $2, $3, $4) RETURNING id`,
            ["Admin", "admin@teste.com", passwordHash, "ADMIN"]
        );
        userId = userRes.rows[0].id;

        // Login to get token
        const loginRes = await app.inject({
            method: "POST",
            url: "/auth/login",
            payload: { email: "admin@teste.com", senha: "admin123" }
        });
        token = loginRes.json().token;

        // Create Unidade
        const unidadeRes = await pool.query(
            `INSERT INTO unidade (nome, endereco) VALUES ('Teste Unidade', 'Endereço Teste') RETURNING id`
        );
        unidadeId = unidadeRes.rows[0].id;

        // Create Produto
        const produtoRes = await pool.query(
            `INSERT INTO produto (nome, preco, estoque_total) VALUES ('Teste Produto', 10.00, 100) RETURNING id`
        );
        produtoId = produtoRes.rows[0].id;
    });

    afterAll(async () => {
        await pool.query("TRUNCATE TABLE item_pedido, pedido, produto, unidade, usuario RESTART IDENTITY CASCADE");
        await pool.end();
        await app.close();
    });

    test("POST /pedidos should create an order and return 201", async () => {
        const response = await app.inject({
            method: "POST",
            url: "/pedidos",
            headers: { Authorization: `Bearer ${token}` },
            payload: {
                unidade_id: unidadeId,
                canal: "WEB",
                itens: [
                    { produto_id: produtoId, quantidade: 2 }
                ]
            }
        });

        expect(response.statusCode).toBe(201);
        const body = response.json();
        expect(body).toHaveProperty("id");
        pedidoId = body.id;
    });

    test("GET /pedidos should list orders and return 200", async () => {
        const response = await app.inject({
            method: "GET",
            url: "/pedidos",
            headers: { Authorization: `Bearer ${token}` }
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBeGreaterThanOrEqual(1);
    });

    test("PATCH /pedidos/:id/status should update order status and return 200", async () => {
        const response = await app.inject({
            method: "PATCH",
            url: `/pedidos/${pedidoId}/status`,
            headers: { Authorization: `Bearer ${token}` },
            payload: {
                status: "EM_PREPARACAO"
            }
        });

        expect(response.statusCode).toBe(200);
        const body = response.json();
        expect(body).toHaveProperty("id", pedidoId);
        expect(body).toHaveProperty("status", "EM_PREPARACAO");
    });
});