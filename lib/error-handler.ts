/**
 * Централизованная обработка ошибок
 */

export interface AppError {
  message: string
  statusCode?: number
  code?: string
  details?: unknown
}

export class ApiError extends Error {
  statusCode: number
  code?: string
  details?: unknown

  constructor(message: string, statusCode: number = 500, code?: string, details?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.code = code
    this.details = details
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

/**
 * Обработка ошибок в API routes
 */
export function handleApiError(error: unknown): { error: string; statusCode: number; details?: unknown } {
  if (error instanceof ApiError) {
    return {
      error: error.message,
      statusCode: error.statusCode,
      details: error.details,
    }
  }

  if (error instanceof Error) {
    // Zod validation errors
    if (error.name === 'ZodError') {
      return {
        error: 'Ошибка валидации',
        statusCode: 400,
        details: (error as any).errors,
      }
    }

    // Prisma errors
    if (error.name === 'PrismaClientKnownRequestError') {
      const prismaError = error as any
      
      // Unique constraint violation
      if (prismaError.code === 'P2002') {
        return {
          error: 'Запись с такими данными уже существует',
          statusCode: 409,
        }
      }

      // Record not found
      if (prismaError.code === 'P2025') {
        return {
          error: 'Запись не найдена',
          statusCode: 404,
        }
      }

      // Foreign key constraint violation
      if (prismaError.code === 'P2003') {
        return {
          error: 'Нарушение целостности данных',
          statusCode: 400,
        }
      }
    }

    // Database connection errors
    if (error.message.includes('P1001') || error.message.includes('Can\'t reach database')) {
      return {
        error: 'Ошибка подключения к базе данных',
        statusCode: 503,
      }
    }

    // В development показываем полное сообщение об ошибке
    if (process.env.NODE_ENV === 'development') {
      return {
        error: error.message,
        statusCode: 500,
        details: error.stack,
      }
    }
  }

  // Неизвестная ошибка
  return {
    error: 'Произошла непредвиденная ошибка',
    statusCode: 500,
  }
}

/**
 * Создание стандартного ответа об ошибке для API
 */
export function createErrorResponse(error: unknown, statusCode?: number) {
  const handled = handleApiError(error)
  
  return {
    error: handled.error,
    ...(handled.details && { details: handled.details }),
    status: statusCode || handled.statusCode,
  }
}

/**
 * Логирование ошибок (для production можно интегрировать с Sentry)
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  if (process.env.NODE_ENV === 'production') {
    // Здесь можно отправить ошибку в Sentry или другой сервис мониторинга
    console.error('Error logged:', {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      context,
      timestamp: new Date().toISOString(),
    })
  } else {
    console.error('Error:', error, context)
  }
}
