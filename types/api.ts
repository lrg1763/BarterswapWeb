/**
 * Типы для API responses
 */

// Общий тип для успешного ответа
export interface ApiSuccessResponse<T = unknown> {
  message?: string
  data?: T
  [key: string]: unknown
}

// Общий тип для ответа с ошибкой
export interface ApiErrorResponse {
  error: string
  details?: unknown
  status?: number
}

// Тип для ответа API
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse

// Типы для конкретных endpoints

// Auth
export interface RegisterResponse extends ApiSuccessResponse {
  user: {
    id: number
    username: string
    createdAt: Date | string
  }
}

export interface LoginResponse extends ApiSuccessResponse {
  user: {
    id: number
    username: string
  }
}

// User
export interface UserResponse {
  id: number
  username: string
  avatar?: string | null
  rating: number | string
  location?: string | null
  skillsOffered?: string | null
  skillsNeeded?: string | null
  bio?: string | null
  createdAt: Date | string
  isPremium?: boolean
  isOnline?: boolean
  lastSeen?: Date | string
}

export interface UserStatsResponse {
  reviewsCount: number
  messagesCount: number
  exchangesCount: number
}

export interface UserWithStatsResponse extends UserResponse {
  stats: UserStatsResponse
}

// Search
export interface SearchUsersResponse {
  users: UserResponse[]
  total: number
  page: number
  totalPages: number
}

// Messages
export interface MessageResponse {
  id: number
  senderId: number
  receiverId: number
  content: string
  timestamp: Date | string
  isRead: boolean
  isDeleted: boolean
  isEdited: boolean
  editedAt?: Date | string | null
  sender?: {
    id: number
    username: string
    avatar?: string | null
  }
}

export interface ChatResponse {
  userId: number
  username: string
  avatar: string | null
  isOnline: boolean
  lastSeen: Date | string
  lastMessage: string
  lastMessageTime: Date | string
  unreadCount: number
}

export interface ChatListResponse {
  chats: ChatResponse[]
}

export interface ChatMessagesResponse {
  messages: MessageResponse[]
  interlocutor: {
    id: number
    username: string
    avatar?: string | null
    isOnline: boolean
  }
}

// Reviews
export interface ReviewResponse {
  id: number
  reviewerId: number
  reviewedId: number
  rating: number | string
  comment?: string | null
  createdAt: Date | string
  reviewer?: {
    id: number
    username: string
    avatar?: string | null
  }
}

export interface ReviewListResponse {
  reviews: ReviewResponse[]
  total: number
  page: number
  totalPages: number
}

// Favorites
export interface FavoriteListResponse {
  favorites: UserResponse[]
}

// Blocks
export interface BlockListResponse {
  blocks: Array<{
    id: number
    blockedId: number
    blocked: UserResponse
    createdAt: Date | string
  }>
}
