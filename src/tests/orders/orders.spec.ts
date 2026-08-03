import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";
import { generateUnit } from "../factories/unit.factory";
import { generateOrder } from "../factories/order.factory";

describe("Orders", () => {
  let adminToken: string;
  let clienteToken: string;
  let prodId: string;
  let unitId: string;

  beforeAll(async () => {
    const product = await generateProduct({ estoque_total: 10 });

    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();

    const prodRes = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(product);
    prodId = prodRes.body.id;

    const unitRes = await request
      .post("/unidades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateUnit());
    unitId = unitRes.body.id;
  });

  describe("T15 - Create a valid order", () => {
    it("should validate the created order and the correct initial status", async () => {
      const payload = {
        unidade_id: unitId,
        canal: "APP",
        itens: [
          {
            produto_id: prodId,
            quantidade: 2,
          },
        ],
      };

      let response;
      do {
        response = await request
          .post("/pedidos")
          .set("Authorization", `Bearer ${clienteToken}`)
          .send(payload);
      } while (!response.body.id);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body.status).toBe("RECEBIDO");
    });
  });

  describe("T16 - Order with non-existent product", () => {
    it("should return the 404 status", async () => {
      const payload = {
        unidade_id: unitId,
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

  describe("T17 - Order with non-existent unit", () => {
    it("should return the 404 status", async () => {
      const payload = {
        unidade_id: "00000000-0000-0000-0000-000000000000",
        canal: "APP",
        itens: [
          {
            produto_id: prodId,
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

  describe("T18 - Order with invalid quantity", () => {
    it("should return the 409 status", async () => {
      const payload = {
        unidade_id: unitId,
        canal: "APP",
        itens: [
          {
            produto_id: prodId,
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

  describe("T23 - Valid the loyalty program", () => {
    it("test endpoint", async () => {
      const payload = generateOrder(unitId, prodId);

      const response = await request
        .post("/pedidos")
        .set("Authorization", `Bearer ${clienteToken}`)
        .send(payload);

      const {
        programa_fidelidade: loyaltyProgram,
        total: price,
        preco_desconto: discountPrice,
        preco_final: finalPrice
      } = response.body;

      if (loyaltyProgram)
        expect(finalPrice).toBe(price - discountPrice);

      expect(response.status).toBe(201);
      expect(response.body).toEqual(expect.objectContaining({
        programa_fidelidade: loyaltyProgram,
        total: price,
        preco_desconto: discountPrice,
        preco_final: finalPrice
      }));
    });
  });
});
