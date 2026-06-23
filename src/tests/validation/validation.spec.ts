import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateUser } from "../factories/user.factory";
import { generateProduct } from "../factories/product.factory";

describe("Validation", () => {
  let adminToken: string;
  let clienteToken: string;
  let produtoId: string;
  let unidadeId: string;

  beforeAll(async () => {
    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();

    const productRes = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(generateProduct());
    produtoId = productRes.body.id;

    const unitRes = await request
      .post("/unidades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ nome: "Unidade Validação", endereco: "Rua X" });
    unidadeId = unitRes.body.id;
  });

  describe("T07 - Campo obrigatório ausente", () => {
    it("deve retornar status 400 ou 422 ao faltar campo obrigatório no cadastro de produto", async () => {
      // CreateProductBody requires "nome" and "preco"
      const payload = {
        descricao: "Produto sem nome e preco",
      };

      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("T08 - Formato inválido de email", () => {
    it("deve retornar status 400 ou 422 no signup com email inválido", async () => {
      const payload = generateUser({ email: "email_invalido.com" });

      const response = await request.post("/auth/signup").send(payload);

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("T09 - Quantidade negativa", () => {
    it("deve retornar status 400 ou 422 ao criar pedido com quantidade negativa", async () => {
      const payload = {
        unidade_id: unidadeId,
        canal: "APP",
        itens: [
          {
            produto_id: produtoId,
            quantidade: -5,
          },
        ],
      };

      const response = await request
        .post("/pedidos")
        .set("Authorization", `Bearer ${clienteToken}`)
        .send(payload);

      expect([400, 422]).toContain(response.status);
    });
  });
});
