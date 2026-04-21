export type ExpenseCategory =
  | 'food'
  | 'transport'
  | 'accommodation'
  | 'entertainment'
  | 'shopping'
  | 'health'
  | 'utilities'
  | 'other'

export type SplitMethod = 'equal' | 'exact' | 'percentage'

export interface ExpenseParticipant {
  userId: string
  share: number
  paid: boolean
}

export interface Expense {
  id: string
  groupId: string
  title: string
  amount: number
  currency: string
  category: ExpenseCategory
  paidBy: string
  participants: ExpenseParticipant[]
  splitMethod: SplitMethod
  date: Date
  createdAt: Date
  updatedAt: Date
}

export interface ExpenseSummary {
  id: string
  title: string
  amount: number
  currency: string
  category: ExpenseCategory
  paidByName: string
  date: Date
}

export interface CreateExpenseInput {
  title: string
  amount: number
  currency: string
  category: ExpenseCategory
  paidBy: string
  participants: ExpenseParticipant[]
  splitMethod: SplitMethod
  date: string
}

export interface UpdateExpenseInput {
  title?: string
  amount?: number
  currency?: string
  category?: ExpenseCategory
  paidBy?: string
  participants?: ExpenseParticipant[]
  splitMethod?: SplitMethod
  date?: string
}
