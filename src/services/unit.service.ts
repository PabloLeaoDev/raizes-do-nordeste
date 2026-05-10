import { UnitRepository } from "../infra/repositories/unit.repository";

export class UnitService {
    private unitRepo = new UnitRepository();

    async createUnit(data: { nome: string; endereco: string; }) {
        return await this.unitRepo.create(data);
    }

    async updateUnit(id: string, data: { nome?: string; endereco?: string; }) {
        return await this.unitRepo.update(id, data);
    }

    async deleteUnit(id: string) {
        return await this.unitRepo.delete(id);
    }

    async list() {
        return await this.unitRepo.findAll();
    }

    async findById(id: string) {
        return await this.unitRepo.findById(id);
    }
}
