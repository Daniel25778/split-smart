import type { Expense, ExpenseParticipant, Settlement, UserBalance, UserSummary } from '@/types'

export const calculateGroupBalances = (
  expenses: Expense[],
  members: UserSummary[],
): UserBalance[] => {
  const balances: Record<string, UserBalance> = {}

  for (const member of members) {
    balances[member.id] = {
      userId: member.id,
      userName: member.name,
      avatarUrl: member.avatarUrl,
      totalPaid: 0,
      totalOwed: 0,
      netBalance: 0,
    }
  }

  for (const expense of expenses) {
    if (balances[expense.paidBy]) {
      balances[expense.paidBy].totalPaid += expense.amount
    }

    for (const participant of expense.participants) {
      if (balances[participant.userId]) {
        balances[participant.userId].totalOwed += participant.share
      }
    }
  }

  const result = Object.values(balances).map((balance) => ({
    ...balance,
    netBalance: balance.totalPaid - balance.totalOwed,
  }))

  return result.sort((a, b) => b.netBalance - a.netBalance)
}

export const calculateSettlements = (balances: UserBalance[]): Settlement[] => {
  const settlements: Settlement[] = []
  const balancesCopy = balances.map((b) => ({ ...b }))

  let creditors = balancesCopy.filter((b) => b.netBalance > 0.01)
  let debtors = balancesCopy.filter((b) => b.netBalance < -0.01)

  while (creditors.length > 0 && debtors.length > 0) {
    creditors = creditors.sort((a, b) => b.netBalance - a.netBalance)
    debtors = debtors.sort((a, b) => a.netBalance - b.netBalance)

    const creditor = creditors[0]
    const debtor = debtors[0]

    const amount = Math.min(creditor.netBalance, -debtor.netBalance)

    settlements.push({
      fromUserId: debtor.userId,
      fromUserName: debtor.userName,
      toUserId: creditor.userId,
      toUserName: creditor.userName,
      amount: Math.round(amount * 100) / 100,
    })

    creditor.netBalance -= amount
    debtor.netBalance += amount

    if (creditor.netBalance < 0.01) {
      creditors = creditors.filter((c) => c.userId !== creditor.userId)
    }

    if (debtor.netBalance > -0.01) {
      debtors = debtors.filter((d) => d.userId !== debtor.userId)
    }
  }

  return settlements
}

export const formatCurrency = (amount: number, currency: string = 'BRL'): string => {
  const localeMap: Record<string, string> = {
    BRL: 'pt-BR',
    USD: 'en-US',
    EUR: 'de-DE',
  }

  const locale = localeMap[currency] || 'pt-BR'

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}

export const splitEqually = (amount: number, participantIds: string[]): ExpenseParticipant[] => {
  if (participantIds.length === 0) {
    return []
  }

  const amountInCents = Math.round(amount * 100)
  const baseCents = Math.floor(amountInCents / participantIds.length)
  const remainderCents = amountInCents % participantIds.length

  return participantIds.map((userId, index) => {
    const cents = index < remainderCents ? baseCents + 1 : baseCents
    return {
      userId,
      share: cents / 100,
      paid: false,
    }
  })
}

export const splitByPercentage = (
  amount: number,
  participants: Array<{ userId: string; percentage: number }>,
): ExpenseParticipant[] => {
  const shares: Record<string, number> = {}
  let totalDistributed = 0

  for (let i = 0; i < participants.length; i++) {
    const participant = participants[i]
    if (i === participants.length - 1) {
      shares[participant.userId] = Math.round((amount - totalDistributed) * 100) / 100
    } else {
      const share = Math.round(((amount * participant.percentage) / 100) * 100) / 100
      shares[participant.userId] = share
      totalDistributed += share
    }
  }

  return participants.map((participant) => ({
    userId: participant.userId,
    share: shares[participant.userId],
    paid: false,
  }))
}

export const splitByExactAmount = (
  participants: Array<{ userId: string; amount: number }>,
): ExpenseParticipant[] => {
  return participants.map((participant) => ({
    userId: participant.userId,
    share: participant.amount,
    paid: false,
  }))
}
