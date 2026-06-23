import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";

describe("Contrato OpenAPI", () => {
  let [adminToken, clienteToken]: string[] = [];

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();
  });

  describe("Validação de Contrato - Auth", () => {
    it("POST /auth/login deve respeitar o contrato", async () => {
      const loginPayload = {
        email: `teste_contract_${Date.now()}@mail.com`,
        senha: "password123",
      };

      await request.post("/auth/signup").send({
        nome: "Usuario Contrato",
        perfil: "CLIENTE",
        ...loginPayload,
      });

      const response = await request.post("/auth/login").send(loginPayload);

      expect(response.status).toBe(200);
      expect(response).toSatisfyApiSpec();
    });
  });

  describe("Validação de Contrato - Produtos", () => {
    it("POST /produtos deve respeitar o contrato", async () => {
      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(generateProduct());

      expect(response.status).toBe(201);
      expect(response).toSatisfyApiSpec();
    });

    it("GET /produtos deve respeitar o contrato", async () => {
      const response = await request
        .get("/produtos")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response).toSatisfyApiSpec();
    });
  });
});
