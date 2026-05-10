import "dotenv/config";
import { app } from "./app";

const start = async () => {
  try {
    await app.listen({ port: Number(process.env.PORT) || 3000 });
    console.log("🚀 Server running");
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();