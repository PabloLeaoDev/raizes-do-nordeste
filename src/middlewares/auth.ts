import jwt from "jsonwebtoken";
import { FastifyRequest, FastifyReply } from "fastify";

export async function authMiddleware(req: FastifyRequest, res: FastifyReply) {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).send({ error: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!);
        (req as any).user = decoded;
    } catch {
        return res.status(401).send({ error: "Invalid token" });
    }
}