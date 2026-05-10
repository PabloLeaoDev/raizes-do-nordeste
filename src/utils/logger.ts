import fs from "fs";
import path from "path";

const LOG_DIR = path.resolve(process.cwd(), "logs");
const LOG_FILE = path.resolve(LOG_DIR, "server.log");

if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function logEvent(event: string, payload: any) {
    const timestamp = new Date().toISOString();
    const logLine = `[${timestamp}] ${event} ${JSON.stringify(payload)}\n`;

    console.log(logLine.trim());

    try {
        fs.appendFileSync(LOG_FILE, logLine);
    } catch (e) {
        console.error("Error writing to log file:", e);
    }
}
