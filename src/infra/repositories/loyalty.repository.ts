import database from "@src/infra/db/database";
// import { Loyalty, LoyaltyItem, LoyaltyStatus } from "@src/domain/entities";

export class LoyaltyRepository {
  async userHasLoyaltyProgram(userId: string): Promise<number> {
    const result = await database.query({
      text: `
        SELECT
          count(*)
        FROM 
          pedido 
        WHERE
          usuario_id = $1
      `,
      values: [userId],
    });
    const userOrdersCount = result.rows[0].count;

    return Number(userOrdersCount);
  }
}
