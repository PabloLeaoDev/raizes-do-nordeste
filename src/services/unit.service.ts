import { UnitRepository } from "../infra/repositories/unit.repository";
import { isUuid, validator } from "../utils/validators";

export class UnitService {
  private unitRepo = new UnitRepository();
  private errorMessages = ["Unidade inválida", "Produto inválido"];

  async createUnit(data: { nome: string; endereco: string }) {
    return await this.unitRepo.create(data);
  }

  async updateUnit(id: string, data: { nome?: string; endereco?: string }) {
    validator({
      id,
      callback: isUuid,
      errorMessage: this.errorMessages[0],
    });
    return await this.unitRepo.update(id, data);
  }

  async deleteUnit(id: string) {
    validator({
      id,
      callback: isUuid,
      errorMessage: this.errorMessages[0],
    });
    return await this.unitRepo.delete(id);
  }

  async list() {
    return await this.unitRepo.findAll();
  }

  async listUnitProducts(id: string) {
    validator({
      id,
      callback: isUuid,
      errorMessage: this.errorMessages[0],
    });
    return this.unitRepo.listUnitProducts(id);
  }

  async findById(id: string) {
    validator({
      id,
      callback: isUuid,
      errorMessage: this.errorMessages[0],
    });
    return await this.unitRepo.findById(id);
  }

  async findUnitProductById(unitId: string, productId: string) {
    const errors = [...this.errorMessages];
    for (let id of [unitId, productId]) {
      validator({
        id,
        callback: isUuid,
        errorMessage: errors.shift(),
      });
    }
    return await this.unitRepo.findUnitProductById(unitId, productId);
  }
}
