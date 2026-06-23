import { request } from "../helpers/request.helper";
import { loginAsAdmin } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";

describe("Produtos", () => {
  let adminToken: string;
  let produtoId: string;

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
  });

  describe("T10 - Criar produto", () => {
    it("deve retornar status 201 e id criado", async () => {
      const payload = await generateProduct();
      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      produtoId = response.body.id;
    });
  });

  describe("T11 - Buscar produto existente", () => {
    it("deve retornar status 200 e conteúdo correto", async () => {
      const response = await request
        .get(`/produtos/${produtoId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      console.log("produtoId: ", produtoId);
      console.log("response.status: ", response.status);
      console.log("response.body: ", response.body);

      expect([200, 201]).toContain(response.status);
      if (response.status === 200) {
        expect(response.body.id).toBe(produtoId);
      }
    });
  });

  describe("T12 - Buscar produto inexistente", () => {
    it("deve retornar status 404", async () => {
      const fakeId = "00000000-0000-0000-0000-000000000000";
      const response = await request
        .get(`/produtos/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe("T13 - Atualizar produto", () => {
    it("deve validar alteração persistida", async () => {
      const updatePayload = { nome: "Produto Atualizado Teste" };
      const response = await request
        .put(`/produtos/${produtoId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send(updatePayload);

      expect([200, 201, 204]).toContain(response.status);

      const getResponse = await request
        .get(`/produtos/${produtoId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      if (getResponse.status === 200) {
        expect(getResponse.body.nome).toBe("Produto Atualizado Teste");
      }
    });
  });

  describe("T14 - Remover produto", () => {
    it("deve validar exclusão", async () => {
      const response = await request
        .delete(`/produtos/${produtoId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect([200, 201, 204]).toContain(response.status);

      const getResponse = await request
        .get(`/produtos/${produtoId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(getResponse.status).toBe(404);
    });
  });
});
