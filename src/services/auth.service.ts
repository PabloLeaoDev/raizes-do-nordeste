import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { UserRepository } from "../infra/repositories/user.repository";

export class AuthService {
  private repo = new UserRepository();

  async login(email: string, senha: string) {
    const user = await this.repo.findByEmail(email);

    if (!user) throw new Error("Credenciais inválidas");

    const ok = await bcrypt.compare(senha, user.senha_hash);
    if (!ok) throw new Error("Credenciais inválidas");

    const token = jwt.sign(
      {
        id: user.id,
        perfil: user.perfil
      },
      process.env.JWT_SECRET!,
      { expiresIn: "3h" }
    );

    return { token, user };
  }

  async signup(nome: string, email: string, senha: string, perfil: string) {
    const senhaHash = await bcrypt.hash(senha, 10);
    const user = await this.repo.create({ nome, email, senhaHash, perfil });

    const token = jwt.sign(
      {
        id: user.id,
        perfil: user.perfil
      },
      process.env.JWT_SECRET!,
      { expiresIn: "3h" }
    );

    return { token, user };
  }
}