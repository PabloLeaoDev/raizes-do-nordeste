import Fastify from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
  jsonSchemaTransform,
  ZodTypeProvider,
} from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import { authRoutes } from "@src/api/routes/auth.routes";
import { productRoutes } from "@src/api/routes/product.routes";
import { orderRoutes } from "@src/api/routes/order.routes";
import { unitRoutes } from "@src/api/routes/unit.routes";
import { userRoutes } from "@src/api/routes/user.routes";

export const app = Fastify({
  logger: true,
}).withTypeProvider<ZodTypeProvider>();

export const prefix = "/api/v1";

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    openapi: "3.0.3",
    info: {
      title: "Raízes do Nordeste API",
      description: "API for the Raízes do Nordeste fast food chains",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
  routePrefix: "/api-docs",
});

app.get(prefix, async () => {
  return {
    title: "Raízes do Nordeste API",
    description: "API for the Raízes do Nordeste fast food chains",
    version: "1.0.0",
    message: "Server is running. Visit /api-docs to see the documentation.",
  };
});

const appRoutes = [
  authRoutes,
  unitRoutes,
  orderRoutes,
  productRoutes,
  userRoutes,
];

for (let routes of appRoutes) app.register(routes, { prefix });
