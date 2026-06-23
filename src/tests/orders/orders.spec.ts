import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";
import { generateUnit } from "../factories/unit.factory";

describe("Pedidos", () => {
  let adminToken: string;
  let clienteToken: string;
  let produtoId: string;
  let unidadeId: string;

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();

    const prodRes = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateProduct({ estoque_total: 10 }));
    produtoId = prodRes.body.id;

    const unitRes = await request
      .post("/unidades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateUnit());
    unidadeId = unitRes.body.id;
  });

  describe("T15 - Criar pedido válido", () => {
    it("deve validar pedido criado e status inicial correto", async () => {
      const payload = {
        unidade_id: unidadeId,
        canal: "APP",
        itens: [
          {
            produto_id: produtoId,
            quantidade: 2,
          },
        ],
      };

      const response = await request
        .post("/pedidos")
        .set("Authorization", `Bearer ${clienteToken}`)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.status).toBe("AGUARDANDO_PAGAMENTO");
    });
  });

  describe("T16 - Pedido com produto inexistente", () => {
    it("deve retornar status 404", async () => {
      const payload = {
        unidade_id: unidadeId,
        canal: "APP",
        itens: [
          {
            produto_id: "00000000-0000-0000-0000-000000000000",
            quantidade: 1,
          },
        ],
      };

      const response = await request
        .post("/pedidos")
        .set("Authorization", `Bearer ${clienteToken}`)
        .send(payload);

      expect(response.status).toBe(404);
    });
  });

  describe("T17 - Pedido com unidade inexistente", () => {
    it("deve retornar status 404", async () => {
      const payload = {
        unidade_id: "00000000-0000-0000-0000-000000000000",
        canal: "APP",
        itens: [
          {
            produto_id: produtoId,
            quantidade: 1,
          },
        ],
      };

      const response = await request
        .post("/pedidos")
        .set("Authorization", `Bearer ${clienteToken}`)
        .send(payload);

      expect(response.status).toBe(404);
    });
  });

  describe("T18 - Pedido com estoque insuficiente", () => {
    it("deve retornar status 409", async () => {
      const payload = {
        unidade_id: unidadeId,
        canal: "APP",
        itens: [
          {
            produto_id: produtoId,
            quantidade: 9999,
          },
        ],
      };

      const response = await request
        .post("/pedidos")
        .set("Authorization", `Bearer ${clienteToken}`)
        .send(payload);

      expect(response.status).toBe(409);
    });
  });
});
