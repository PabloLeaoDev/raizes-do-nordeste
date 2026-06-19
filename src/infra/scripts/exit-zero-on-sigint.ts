import { spawn } from "node:child_process";

const commands = process.argv.slice(2).join(" ");
const child = spawn(commands, {
  stdio: "inherit",
  shell: true,
});

process.on("SIGINT", () => {
  child.kill("SIGINT");
  process.exit(0);
});
