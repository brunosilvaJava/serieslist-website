// Shared TypeScript types for the application

export interface User {
  id: string
  email: string
  name: string | null
  createdAt: string
  updatedAt: string
}

export interface List {
  id: string
  name: string
  isPublic: boolean
  shareId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface ListWithCount extends List {
  _count: {
    series: number
  }
}

export interface Serie {
  id: string
  title: string
  description: string | null
  listId: string
  createdAt: string
  updatedAt: string
}

export interface ListWithSeries extends List {
  series: Serie[]
}

export interface ListWithSeriesAndUser extends ListWithSeries {
  user: {
    name: string | null
    email: string
  }
}

// API Response types
export interface ApiError {
  error: string
  details?: unknown
}

export interface ApiSuccess<T = unknown> {
  data: T
  message?: string
}
