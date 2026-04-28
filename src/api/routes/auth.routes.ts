import { AuthController } from "../controllers/auth.controller";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

const controller = new AuthController();

export async function authRoutes(app: any) {
    app.post("/auth/login", {
        schema: { body: loginSchema },
        handler: controller.login.bind(controller)
    });

    app.post("/auth/signup", {
        schema: { body: signupSchema },
        handler: controller.signup.bind(controller)
    });
}