import { request } from "../helpers/request.helper";
import {
  loginAsAdmin,
  loginAsAtendente,
  loginAsCliente,
} from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";

describe("Authorization", () => {
  let [adminToken, atendenteToken, clienteToken, productId]: string[] = [];

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    atendenteToken = await loginAsAtendente();
    clienteToken = await loginAsCliente();
  });

  describe("T03 - No token access", () => {
    it("should return 401 status to access protect route", async () => {
      const product = await generateProduct();
      const response = await request
        .post("/produtos")
        .set("Authorization", "")
        .send(product);

      expect(response.status).toBe(401);
    });
  });

  describe("T04 - 'CLIENTE' trying delete product", () => {
    it("should return 403", async () => {
      // Create a product to be deleted
      const productPayload = await generateProduct();
      const res = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(productPayload);

      productId = res.body.id;

      const response = await request
        .delete(`/produtos/${productId}`)
        .set("Authorization", `Bearer ${clienteToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("T05 - 'ATENDENTE' trying create product", () => {
    it("should return 403", async () => {
      const product = await generateProduct();
      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${atendenteToken}`)
        .send(product);

      expect(response.status).toBe(403);
    });
  });

  describe("T06 - 'ADMIN' creating product", () => {
    it("should return success (201)", async () => {
      const product = await generateProduct();
      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(product);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });
});
