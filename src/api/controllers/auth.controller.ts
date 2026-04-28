import { AuthService } from "../../services/auth.service";

const service = new AuthService();

export class AuthController {
  async login(req: any, reply: any) {
    const { email, senha } = req.body;

    const result = await service.login(email, senha);
    return reply.send(result);
  }

  async signup(req: any, reply: any) {
    const { nome, email, senha, perfil } = req.body;

    const result = await service.signup(nome, email, senha, perfil);
    return reply.send(result);
  }
}