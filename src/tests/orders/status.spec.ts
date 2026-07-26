import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";
import { generateUnit } from "../factories/unit.factory";

describe("Orders - Status", () => {
  let adminToken: string;
  let clienteToken: string;
  let orderId: string;

  beforeAll(async () => {
    const product = await generateProduct({ estoque_total: 10 });

    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();

    const prodRes = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(product);

    const unitRes = await request
      .post("/unidades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateUnit());

    let orderRes;
    do {
      orderRes = await request
        .post("/pedidos")
        .set("Authorization", `Bearer ${clienteToken}`)
        .send({
          unidade_id: unitRes.body.id,
          canal: "APP",
          itens: [{ produto_id: prodRes.body.id, quantidade: 1 }],
        });
    } while (!orderRes.body.id);

    orderId = orderRes.body.id;
  });

  describe("T21 - Update the order status", () => {
    it("should update to the 'EM_PREPARACAO' status and validate the persistence", async () => {
      const response = await request
        .patch(`/pedidos/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "EM_PREPARACAO" });

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("EM_PREPARACAO");
    });
  });
});
