import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateUser } from "../factories/user.factory";
import { generateProduct } from "../factories/product.factory";

describe("Validation", () => {
  let adminToken: string;
  let clienteToken: string;
  let prodId: string;
  let unitId: string;

  beforeAll(async () => {
    const product = await generateProduct();

    adminToken = await loginAsAdmin();
    clienteToken = await loginAsCliente();

    const productRes = await request
      .post("/produtos")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(product);
    prodId = productRes.body.id;

    const unitRes = await request
      .post("/unidades")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ nome: "Unidade Validação", endereco: "Rua X" });
    unitId = unitRes.body.id;
  });

  describe("T07 - No required field", () => {
    it("should return the 400 or 422 status", async () => {
      // CreateProductBody requires "nome" and "preco"
      const payload = {
        descricao: "No name and price product",
      };

      const response = await request
        .post("/produtos")
        .set("Authorization", `Bearer ${adminToken}`)
        .send(payload);

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("T08 - Invalid email format", () => {
    it("should return the 400 or 422 status", async () => {
      const payload = generateUser({ email: "email_invalido.com" });

      const response = await request.post("/auth/signup").send(payload);

      expect([400, 422]).toContain(response.status);
    });
  });

  describe("T09 - Invalid quantity", () => {
    it("should return the 400 or 422 status", async () => {
      const payload = {
        unidade_id: unitId,
        canal: "APP",
        itens: [
          {
            produto_id: prodId,
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
