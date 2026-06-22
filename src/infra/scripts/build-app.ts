import { spawn, exec } from "node:child_process";
import orchestrator from "@src/tests/orchestrator";

const commands = process.argv.slice(2).join(" ");
const child = spawn(commands, {
  stdio: "inherit",
  shell: true,
});

child.addListener("exit", async (e) => {
  if (e === 1) {
    console.log(
      "App build is required. Building and restarting dev environment...",
    );
    exec("npm run build && npm run bootstrap && tsx watch src/server.ts");
    await orchestrator.waitForAllServices();
  }
});
