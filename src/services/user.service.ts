import { UserRepository } from "../infra/repositories/user.repository";
import { isUuid, validator } from "../utils/validators";
import { UserProfile } from "../domain/enums";
import bcrypt from "bcrypt";

export class UserService {
  private userRepo = new UserRepository();
  private errorMessages = ["Unidade inválida", "Produto inválido"];

  async createUser(data: {
    nome: string;
    email: string;
    senha: string;
    perfil: UserProfile;
  }) {
    const mappedUserData = {
      ...data,
      senhaHash: await bcrypt.hash(data.senha, 10),
    };
    return await this.userRepo.create(mappedUserData);
  }

  async updateUser(
    reqUser: {
      id: string;
      email: string;
      perfil: UserProfile;
    },
    userForUpdate: {
      id: string;
      nome?: string;
      email?: string;
      perfil?: UserProfile;
      senha?: string;
    },
  ) {
    validator({
      id: userForUpdate.id,
      callback: isUuid,
      errorMessage: this.errorMessages[0],
    });

    const reqUserIsAdmin = reqUser.perfil === UserProfile.ADMIN,
      userForUpdateIsAdmin = userForUpdate.perfil === UserProfile.ADMIN,
      isSelf = reqUser.id === userForUpdate.id;

    if (
      (!reqUserIsAdmin && !isSelf) ||
      (reqUserIsAdmin && userForUpdateIsAdmin && !isSelf)
    ) {
      throw new Error("You are not authorized to update this user");
    }

    let senhaHash = undefined;
    if (userForUpdate.senha)
      senhaHash = await bcrypt.hash(userForUpdate.senha, 10);

    return await this.userRepo.update({
      ...userForUpdate,
      senhaHash: senhaHash,
    });
  }

  async deleteUser(id: string) {
    validator({
      id,
      callback: isUuid,
      errorMessage: this.errorMessages[0],
    });
    return await this.userRepo.delete(id);
  }

  async list() {
    return await this.userRepo.findAll();
  }

  async findById(id: string) {
    validator({
      id,
      callback: isUuid,
      errorMessage: this.errorMessages[0],
    });
    return await this.userRepo.findById(id);
  }
}
