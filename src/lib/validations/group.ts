import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome do grupo deve ter pelo menos 2 caracteres')
    .max(50, 'Nome do grupo deve ter no máximo 50 caracteres'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  coverImageUrl: z.string().url('URL de imagem inválida').optional(),
})

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome do grupo deve ter pelo menos 2 caracteres')
    .max(50, 'Nome do grupo deve ter no máximo 50 caracteres')
    .optional(),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  coverImageUrl: z.string().url('URL de imagem inválida').optional(),
}).refine((data) => Object.keys(data).length > 0, {
  message: 'Pelo menos um campo deve ser fornecido para atualização',
})

export const addMemberSchema = z.object({
  userId: z.string().min(1, 'ID do usuário é obrigatório'),
})

export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
