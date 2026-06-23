import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";
import { generateUnit } from "../factories/unit.factory";

describe("Status de Pedidos", () => {
  let adminToken: string;
  let clienteToken: string;
  let pedidoId: string;

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();

    const prodRes = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateProduct({ estoque_total: 10 }));

    const unitRes = await request
      .post("/unidades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateUnit());

    const pedidoRes = await request
      .post("/pedidos")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send({
        unidade_id: unitRes.body.id,
        canal: "APP",
        itens: [{ produto_id: prodRes.body.id, quantidade: 1 }],
      });
    pedidoId = pedidoRes.body.id;
  });

  describe("T21 - Atualizar status do pedido", () => {
    it("deve atualizar o status para EM_PREPARACAO e validar persistência", async () => {
      const response = await request
        .patch(`/pedidos/${pedidoId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "EM_PREPARACAO" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("EM_PREPARACAO");
    });
  });
});
