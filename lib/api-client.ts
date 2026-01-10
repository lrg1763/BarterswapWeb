/**
 * Централизованный API клиент с обработкой ошибок и типизацией
 */

import { toast } from 'sonner'
import type { ApiResponse, ApiErrorResponse } from '@/types/api'

interface RequestOptions extends RequestInit {
  skipErrorToast?: boolean
}

/**
 * Базовый API клиент
 */
class ApiClient {
  private baseUrl = '/api'

  /**
   * Выполнить запрос к API
   */
  private async request<T = unknown>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { skipErrorToast = false, ...fetchOptions } = options

    const url = endpoint.startsWith('/') 
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: {
          'Content-Type': 'application/json',
          ...fetchOptions.headers,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        const errorResponse = data as ApiErrorResponse
        const errorMessage = errorResponse.error || 'Произошла ошибка'

        if (!skipErrorToast) {
          toast.error(errorMessage)
        }

        throw new Error(errorMessage)
      }

      return data as T
    } catch (error) {
      if (error instanceof Error) {
        if (!skipErrorToast) {
          toast.error(error.message)
        }
        throw error
      }

      const message = 'Неизвестная ошибка'
      if (!skipErrorToast) {
        toast.error(message)
      }
      throw new Error(message)
    }
  }

  /**
   * GET запрос
   */
  async get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET',
    })
  }

  /**
   * POST запрос
   */
  async post<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PUT запрос
   */
  async put<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * PATCH запрос
   */
  async patch<T = unknown>(
    endpoint: string,
    data?: unknown,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  /**
   * DELETE запрос
   */
  async delete<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE',
    })
  }

  /**
   * Загрузка файла (FormData)
   */
  async uploadFile<T = unknown>(
    endpoint: string,
    formData: FormData,
    options?: Omit<RequestOptions, 'body' | 'headers'>
  ): Promise<T> {
    const url = endpoint.startsWith('/')
      ? `${this.baseUrl}${endpoint}`
      : `${this.baseUrl}/${endpoint}`

    try {
      const response = await fetch(url, {
        ...options,
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        const errorResponse = data as ApiErrorResponse
        const errorMessage = errorResponse.error || 'Ошибка при загрузке файла'
        toast.error(errorMessage)
        throw new Error(errorMessage)
      }

      return data as T
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message)
        throw error
      }
      throw new Error('Неизвестная ошибка при загрузке файла')
    }
  }
}

// Singleton instance
export const apiClient = new ApiClient()

// Экспортируем методы напрямую для удобства
export const { get, post, put, patch, delete: del, uploadFile } = apiClient
