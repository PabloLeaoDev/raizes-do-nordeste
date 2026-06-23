import { request } from "../helpers/request.helper";
import {
  loginAsAdmin,
  loginAsAtendente,
  loginAsCliente,
} from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";

describe("Authorization", () => {
  let [adminToken, atendenteToken, clienteToken, produtoId]: string[] = [];

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    atendenteToken = await loginAsAtendente();
    clienteToken = await loginAsCliente();

    // Criar um produto para testar a exclusão
    const productPayload = generateProduct();
    const res = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(productPayload);
    produtoId = res.body.id;
  });

  describe("T03 - Acesso sem token", () => {
    it("deve retornar status 401 ao acessar rota protegida", async () => {
      const response = await request.post("/produtos").send(generateProduct());
      expect(response.status).toBe(401);
    });
  });

  describe("T04 - CLIENTE tentando deletar produto", () => {
    it("deve retornar status 403", async () => {
      const response = await request
        .delete(`/produtos/${produtoId}`)
        .set("Authorization", `Bearer ${clienteToken}`);

      expect(response.status).toBe(403);
    });
  });

  describe("T05 - ATENDENTE tentando criar produto", () => {
    it("deve retornar status 403", async () => {
      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${atendenteToken}`)
        .send(generateProduct());

      expect(response.status).toBe(403);
    });
  });

  describe("T06 - ADMIN criando produto", () => {
    it("deve retornar sucesso (201)", async () => {
      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(generateProduct());

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
    });
  });
});
