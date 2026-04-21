// Chamadas a APIs externas e Gemini
// Nunca chame APIs diretamente em componentes - sempre via services/

export { getGroups, getGroupById, createGroup, updateGroup, addMember } from './groupService'
export { getExpensesByGroup, getExpenseById, createExpense, updateExpense, deleteExpense } from './expenseService'
export { getGroupBalances, getSettlements } from './balanceService'
