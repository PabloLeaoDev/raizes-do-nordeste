import { request } from "../helpers/request.helper";
import {
  loginAsAdmin,
  loginAsCliente,
  loginAsAtendente,
} from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";
import { generateUnit } from "../factories/unit.factory";
import { generateOrder } from "../factories/order.factory";

describe("Business Rules - Payment", () => {
  let [clienteToken, atendenteToken, adminToken, productId, unitId]: string[] =
    [];

  beforeAll(async () => {
    const product = await generateProduct({ estoque_total: 10 });

    atendenteToken = await loginAsAtendente();
    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();

    const prodRes = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(product);
    productId = prodRes.body.id;

    const unitRes = await request
      .post("/unidades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateUnit());
    unitId = unitRes.body.id;
  });

  const createOrder = async () => {
    const payload = generateOrder(unitId, productId);

    const res = await request
      .post("/pedidos")
      .set("Authorization", `Bearer ${clienteToken}`)
      .send(payload);

    return { id: res.body.id, error: res.body.error, statusCode: res.status };
  };

  describe("T19 - Payment approved", () => {
    it("should update the order status to 'EM_PREPARACAO'", async () => {
      const { id: orderId, error, statusCode } = await createOrder();

      if (error) {
        expect(404).toBe(statusCode);
        return;
      }

      const response = await request
        .patch(`/pedidos/${orderId}/status`)
        .set("Authorization", `Bearer ${atendenteToken}`)
        .send({ status: "EM_PREPARACAO" });

      expect([200, 201]).toContain(response.status);
      expect(response.body.status).toBe("EM_PREPARACAO");
    });
  });

  describe("T20 - Payment rejected", () => {
    it("should reject the order with status 'CANCELADO'", async () => {
      const { id: orderId, error, statusCode } = await createOrder();

      if (error) {
        //
        expect(404).toBe(statusCode);
        return;
      }

      const response = await request
        .patch(`/pedidos/${orderId}/status`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "CANCELADO" });

      expect([200, 400, 402]).toContain(response.status);
      expect(["CANCELADO"]).toContain(response.body.status);
    });
  });
});
