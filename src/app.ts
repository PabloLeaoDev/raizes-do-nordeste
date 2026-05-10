import Fastify from "fastify";
import { serializerCompiler, validatorCompiler, jsonSchemaTransform, ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";

import { authRoutes } from "./api/routes/auth.routes";
import { productRoutes } from "./api/routes/product.routes";
import { orderRoutes } from "./api/routes/order.routes";
import { unitRoutes } from "./api/routes/unit.routes";

export const app = Fastify({ logger: true }).withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Raízes do Nordeste API",
      description: "API para a rede de lanchonetes Raízes do Nordeste",
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

app.register(authRoutes);
app.register(productRoutes);
app.register(orderRoutes);
app.register(unitRoutes);