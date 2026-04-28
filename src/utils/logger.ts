export function logEvent(evento: string, payload: any) {
    console.log("[LOG]", evento, JSON.stringify(payload));
}