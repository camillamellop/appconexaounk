export class AppError extends Error {
  public readonly statusCode: number
  public readonly isOperational: boolean

  constructor(message: string, statusCode = 500, isOperational = true) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = isOperational

    Error.captureStackTrace(this, this.constructor)
  }
}

export const handleApiError = (error: unknown) => {
  console.error("API Error:", error)

  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      statusCode: error.statusCode,
    }
  }

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message,
      statusCode: 500,
    }
  }

  return {
    success: false,
    message: "Erro interno do servidor",
    statusCode: 500,
  }
}

export const createErrorResponse = (message: string, statusCode = 500) => {
  return Response.json({ success: false, message, timestamp: new Date().toISOString() }, { status: statusCode })
}
