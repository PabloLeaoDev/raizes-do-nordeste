import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";

describe("OpenAPI Contract", () => {
  let [adminToken, clienteToken]: string[] = [];

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();
  });

  describe("Contract Validation - Auth", () => {
    it("POST /auth/login should respect the contract", async () => {
      const loginPayload = {
        email: `teste_contract_${Date.now()}@mail.com`,
        senha: "password123",
      };

      await request.post("/auth/signup").send({
        nome: "User Contract",
        perfil: "CLIENTE",
        ...loginPayload,
      });

      const response = await request.post("/auth/login").send(loginPayload);

      expect(response.status).toBe(200);
      expect(response).toSatisfyApiSpec();
    });
  });

  describe("Contract Validation - Products", () => {
    it("POST /produtos should respect the contract", async () => {
      const product = await generateProduct();
      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(product);

      expect(response.status).toBe(201);
      expect(response).toSatisfyApiSpec();
    });

    it("GET /produtos should respect the contract", async () => {
      const response = await request
        .get("/produtos")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response).toSatisfyApiSpec();
    });
  });
});
