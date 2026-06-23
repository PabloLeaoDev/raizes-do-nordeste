import { request } from "../helpers/request.helper";
import { generateUser } from "../factories/user.factory";

describe("Auth - Login", () => {
  let userPayload: any;

  beforeAll(async () => {
    userPayload = generateUser();
    await request.post("/auth/signup").send(userPayload);
  });

  describe("T01 - Login com credenciais válidas", () => {
    it("deve retornar status 200, um token válido e payload válido", async () => {
      const response = await request.post("/auth/login").send({
        email: userPayload.email,
        senha: userPayload.senha,
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("token");
      expect(typeof response.body.token).toBe("string");
      expect(response.headers["content-type"]).toContain("application/json");
    });
  });

  describe("T02 - Login com senha incorreta", () => {
    it("deve retornar erro 401 e mensagem adequada", async () => {
      const response = await request.post("/auth/login").send({
        email: userPayload.email,
        senha: "wrong_password_123",
      });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("error");
      expect(response.headers["content-type"]).toContain("application/json");
    });
  });
});
