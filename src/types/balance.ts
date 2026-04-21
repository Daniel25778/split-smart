export interface UserBalance {
  userId: string
  userName: string
  avatarUrl?: string
  totalPaid: number
  totalOwed: number
  netBalance: number
}

export interface Settlement {
  fromUserId: string
  fromUserName: string
  toUserId: string
  toUserName: string
  amount: number
}
