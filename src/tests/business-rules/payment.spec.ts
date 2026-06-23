import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";
import { generateUnit } from "../factories/unit.factory";

describe("Regras de Negócio - Pagamento", () => {
  let [clienteToken, adminToken, produtoId, unidadeId]: string[] = [];

  beforeAll(async () => {
    clienteToken = await loginAsCliente();
    adminToken = await loginAsAdmin();

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

  const createOrder = async () => {
    const payload = {
      unidade_id: unidadeId,
      canal: "APP",
      itens: [{ produto_id: produtoId, quantidade: 1 }],
    };
    const res = await request
      .post("/pedidos")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send(payload);
    return res.body.id;
  };

  describe("T19 - Pagamento aprovado", () => {
    it("deve atualizar status do pedido para RECEBIDO", async () => {
      const pedidoId = await createOrder();

      const response = await request
        .post(`/pedidos/${pedidoId}/status`)
        .set("Authorization", `Bearer ${clienteToken}`)
        .send({ status: "RECEBIDO" });

      console.log("response.body: ", response.body);
      console.log("response.status:", response.status);

      expect([200, 201]).toContain(response.status);
      expect(response.body.status).toBe("RECEBIDO");
    });
  });

  describe("T20 - Pagamento recusado", () => {
    it("deve recusar pagamento, manter ou cancelar pedido com mensagem coerente", async () => {
      const pedidoId = await createOrder();

      const response = await request
        .post(`/pedidos/${pedidoId}/pagamento`)
        .set("Authorization", `Bearer ${clienteToken}`)
        .send({ status_pagamento: "RECUSADO" });

      expect([200, 400, 402]).toContain(response.status);
      expect(["CANCELADO", "AGUARDANDO_PAGAMENTO"]).toContain(
        response.body.status,
      );
    });
  });
});
