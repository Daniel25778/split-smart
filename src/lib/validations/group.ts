import { z } from 'zod'

export const createGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome do grupo deve ter pelo menos 2 caracteres')
    .max(60, 'Nome do grupo deve ter no máximo 60 caracteres'),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  coverImageUrl: z.string().url('URL de imagem inválida').optional(),
})

export const updateGroupSchema = z.object({
  name: z
    .string()
    .min(2, 'Nome do grupo deve ter pelo menos 2 caracteres')
    .max(60, 'Nome do grupo deve ter no máximo 60 caracteres')
    .optional(),
  description: z.string().max(200, 'Descrição deve ter no máximo 200 caracteres').optional(),
  coverImageUrl: z.string().url('URL de imagem inválida').optional(),
})

export const addMemberSchema = z.object({
  email: z.string().email('Email inválido'),
})

export type CreateGroupInput = z.infer<typeof createGroupSchema>
export type UpdateGroupInput = z.infer<typeof updateGroupSchema>
export type AddMemberInput = z.infer<typeof addMemberSchema>
