import { AuthController } from "../controllers/auth.controller";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';

const controller = new AuthController();

export const authRoutes: FastifyPluginAsyncZod = async (app) => {
    app.post("/auth/login", {
        schema: { 
            tags: ['Auth'],
            body: loginSchema 
        },
        handler: controller.login.bind(controller)
    });

    app.post("/auth/signup", {
        schema: { 
            tags: ['Auth'],
            body: signupSchema 
        },
        handler: controller.signup.bind(controller)
    });
}