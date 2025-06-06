import { z } from "zod";

export const allocationFormSchema = z.object({
    assetId: z.string().uuid({ message: "Por favor, selecione um ativo." }),
    quantity: z.coerce.number().int({ message: "A quantidade deve ser um número inteiro." }).positive({ message: "A quantidade deve ser positiva." }).min(1, { message: "A quantidade mínima é 1." }),
});

export type AllocationFormData = z.infer<typeof allocationFormSchema>;