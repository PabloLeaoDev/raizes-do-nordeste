import { LoyaltyRepository } from "@src/infra/repositories/loyalty.repository";

export class LoyaltyService {
  private LoyaltyRepo = new LoyaltyRepository();

  async userHasLoyaltyProgram(userId: string) {
    const userOrdersCount = await this.LoyaltyRepo.userHasLoyaltyProgram(userId);
    // if the user has 5 orders after the program reset (reset ocurrs every 5 orders)
    if (userOrdersCount > 0 && userOrdersCount % 5 === 0) return true;
    return false;
  }

  applyLoyaltyProgramDiscount(total: number): { discount: number, totalWithDiscount: number } {
    const discount = 30, totalWithDiscount = total - ((total * discount) / 100);
    return { discount, totalWithDiscount };
  }
}
