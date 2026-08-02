import { request } from "../helpers/request.helper";
import { loginAsAdmin, loginAsCliente } from "../helpers/auth.helper";
import { generateProduct } from "../factories/product.factory";
import { generateUnit } from "../factories/unit.factory";
import { OrderStatus, UserProfile } from "@src/domain/entities";
import database from "@src/infra/db/database";

describe("Orders", () => {
  let [adminToken, clienteToken, prodId, unitId]: string[] = [];

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

  describe("T22 - Validate loyalty program", () => {
    it("should grant loyalty program benefits to the user with at least 5 accumulated orders", async () => {
      const { id: userId } = (
        await database.query({
          text: `
            SELECT 
              id
            FROM 
              usuario
            WHERE
              perfil = $1
            ORDER BY 
              created_at DESC
            LIMIT 
              1 
          `,
          values: [UserProfile.CLIENTE],
        })
      ).rows[0];

      const orderIds = (
        await database.query({
          text: `
          INSERT INTO 
            pedido (usuario_id, unidade_id, status, canal, total) 
          VALUES
            ($1, $2, $3, $4, $5),
            ($1, $2, $3, $4, $5),
            ($1, $2, $3, $4, $5),
            ($1, $2, $3, $4, $5),
            ($1, $2, $3, $4, $5)
          RETURNING id
        `,
          values: [userId, unitId, OrderStatus.FINALIZADO, "APP", 9],
        })
      ).rows.map((order) => order.id);

      const placeholders = orderIds
        .map((_, index) => `$${index + 1}`)
        .join(", ");

      const { count } = (
        await database.query({
          text: `
          SELECT 
            count(*)
          FROM
            pedido 
          WHERE
            id IN (${placeholders})`,
          values: orderIds,
        })
      ).rows[0];

      const countUserOrder = Number(count);

      if (countUserOrder > 0 && countUserOrder % 5 === 0) {
        const response = await request
          .get(`/programa-fidelidade/${userId}`)
          .set("Authorization", `Bearer ${adminToken}`);
        const loyaltyProgram = response.body;
        expect(loyaltyProgram).toEqual({ programa_fidelidade: true });
      }
    });
  });
});
