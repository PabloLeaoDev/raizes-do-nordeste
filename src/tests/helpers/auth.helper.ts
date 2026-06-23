import { request } from "./request.helper";
import { generateUser } from "../factories/user.factory";

async function getAuthTokenForRole(
  perfil: "ADMIN" | "GERENTE" | "ATENDENTE" | "CLIENTE",
) {
  const user = generateUser({ perfil });

  await request.post("/auth/signup").send(user);

  const response = await request.post("/auth/login").send({
    email: user.email,
    senha: user.senha,
  });

  if (!response.body.token) {
    throw new Error(
      `Falha ao obter token para perfil ${perfil}. Status: ${response.status}`,
    );
  }

  return response.body.token;
}

export const loginAsAdmin = () => getAuthTokenForRole("ADMIN");
export const loginAsGerente = () => getAuthTokenForRole("GERENTE");
export const loginAsAtendente = () => getAuthTokenForRole("ATENDENTE");
export const loginAsCliente = () => getAuthTokenForRole("CLIENTE");
