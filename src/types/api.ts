export interface ApiResponse<T> {
  data: T
  error: string | null
  loading: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number
  page: number
  pageSize: number
}
