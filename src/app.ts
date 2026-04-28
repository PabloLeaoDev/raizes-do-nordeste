import Fastify from "fastify";
import { authRoutes } from "./api/routes/auth.routes";
// importar os outros módulos

export const app = Fastify({ logger: true });

app.register(authRoutes);
// app.register(produtoRoutes);
// app.register(estoqueRoutes);
// app.register(pedidoRoutes);