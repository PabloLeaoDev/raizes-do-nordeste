import { z } from "zod";

export const createOrderSchema = z.object({
  unidade_id: z.string().uuid(),
  canal: z.enum(["APP", "TOTEM", "WEB"]),
  itens: z.array(
    z.object({
      produto_id: z.string().uuid(),
      quantidade: z.number().int().positive(),
    })
  ).min(1),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(["AGUARDANDO_PAGAMENTO", "RECEBIDO", "EM_PREPARACAO", "PRONTO", "FINALIZADO", "CANCELADO"]),
});
