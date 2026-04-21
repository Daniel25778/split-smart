import { z } from 'zod'

import type { ExpenseCategory, SplitMethod } from '@/types'

const expenseCategoryEnum = z.enum([
  'food',
  'transport',
  'accommodation',
  'entertainment',
  'shopping',
  'health',
  'utilities',
  'other',
]) as z.ZodType<ExpenseCategory>

const splitMethodEnum = z.enum(['equal', 'exact', 'percentage']) as z.ZodType<SplitMethod>

export const createExpenseSchema = z
  .object({
    title: z
      .string()
      .min(2, 'Título deve ter pelo menos 2 caracteres')
      .max(100, 'Título deve ter no máximo 100 caracteres'),
    amount: z
      .number()
      .positive('Valor deve ser positivo')
      .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais'),
    currency: z.string().default('BRL'),
    category: expenseCategoryEnum,
    paidBy: z.string().min(1, 'Quem pagou é obrigatório'),
    splitMethod: splitMethodEnum,
    participants: z
      .array(
        z.object({
          userId: z.string().min(1, 'ID do usuário é obrigatório'),
          share: z.number().positive('Compartilhamento deve ser positivo'),
        }),
      )
      .min(1, 'Deve haver pelo menos um participante'),
    date: z.string().datetime('Data inválida'),
  })
  .refine(
    (data) => {
      if (data.splitMethod === 'percentage') {
        const totalShare = data.participants.reduce((acc, p) => acc + p.share, 0)
        return Math.abs(totalShare - 100) < 0.01
      }
      return true
    },
    {
      message: 'A soma dos percentuais deve ser igual a 100%',
      path: ['participants'],
    },
  )
  .refine(
    (data) => {
      if (data.splitMethod === 'exact') {
        const totalShare = data.participants.reduce((acc, p) => acc + p.share, 0)
        return Math.abs(totalShare - data.amount) < 0.01
      }
      return true
    },
    {
      message: 'A soma dos valores deve ser igual ao valor total da despesa',
      path: ['participants'],
    },
  )

export const updateExpenseSchema = z
  .object({
    title: z
      .string()
      .min(2, 'Título deve ter pelo menos 2 caracteres')
      .max(100, 'Título deve ter no máximo 100 caracteres')
      .optional(),
    amount: z
      .number()
      .positive('Valor deve ser positivo')
      .multipleOf(0.01, 'Valor deve ter no máximo 2 casas decimais')
      .optional(),
    currency: z.string().optional(),
    category: expenseCategoryEnum.optional(),
    paidBy: z.string().min(1, 'Quem pagou é obrigatório').optional(),
    splitMethod: splitMethodEnum.optional(),
    participants: z
      .array(
        z.object({
          userId: z.string().min(1, 'ID do usuário é obrigatório'),
          share: z.number().positive('Compartilhamento deve ser positivo'),
        }),
      )
      .min(1, 'Deve haver pelo menos um participante')
      .optional(),
    date: z.string().datetime('Data inválida').optional(),
  })
  .refine(
    (data) => {
      if (data.splitMethod === 'percentage' && data.participants) {
        const totalShare = data.participants.reduce((acc, p) => acc + p.share, 0)
        return Math.abs(totalShare - 100) < 0.01
      }
      return true
    },
    {
      message: 'A soma dos percentuais deve ser igual a 100%',
      path: ['participants'],
    },
  )
  .refine(
    (data) => {
      if (data.splitMethod === 'exact' && data.participants && data.amount) {
        const totalShare = data.participants.reduce((acc, p) => acc + p.share, 0)
        return Math.abs(totalShare - data.amount) < 0.01
      }
      return true
    },
    {
      message: 'A soma dos valores deve ser igual ao valor total da despesa',
      path: ['participants'],
    },
  )

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>
