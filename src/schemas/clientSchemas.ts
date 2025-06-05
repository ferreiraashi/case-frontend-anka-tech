import { z } from 'zod';

export const clientFormSchema = z.object({
  name: z.string().min(3, { message: 'O nome deve ter pelo menos 3 caracteres.' }),
  email: z.string().email({ message: 'Formato de email inválido.' }),
  status: z.enum(['ativo', 'inativo'], {
    errorMap: () => ({ message: 'Por favor, selecione um status.' }),
  }),
});

export type ClientFormData = z.infer<typeof clientFormSchema>;