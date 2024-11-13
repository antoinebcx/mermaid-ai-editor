import { Request, Response, NextFunction } from 'express';

export class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  console.error('Unexpected error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};