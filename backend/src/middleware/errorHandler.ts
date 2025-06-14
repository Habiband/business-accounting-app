import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { logger } from '@/utils/logger';
import { AppError } from '@/utils/AppError';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Handle known application errors
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
        code: error.code,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
      },
    });
  }

  // Handle Prisma errors
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return handlePrismaError(error, res);
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Invalid data provided',
        code: 'VALIDATION_ERROR',
        ...(process.env.NODE_ENV === 'development' && { details: error.message }),
      },
    });
  }

  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Invalid token',
        code: 'INVALID_TOKEN',
      },
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: {
        message: 'Token expired',
        code: 'TOKEN_EXPIRED',
      },
    });
  }

  // Handle validation errors (Joi)
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        details: error.message,
      },
    });
  }

  // Handle multer errors
  if (error.name === 'MulterError') {
    let message = 'File upload error';
    let statusCode = 400;

    switch (error.message) {
      case 'File too large':
        message = 'File size too large';
        break;
      case 'Too many files':
        message = 'Too many files uploaded';
        break;
      case 'Unexpected field':
        message = 'Unexpected file field';
        break;
    }

    return res.status(statusCode).json({
      success: false,
      error: {
        message,
        code: 'FILE_UPLOAD_ERROR',
      },
    });
  }

  // Default error response
  res.status(500).json({
    success: false,
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : error.message,
      code: 'INTERNAL_SERVER_ERROR',
      ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
    },
  });
};

const handlePrismaError = (error: Prisma.PrismaClientKnownRequestError, res: Response) => {
  switch (error.code) {
    case 'P2002':
      // Unique constraint violation
      const field = error.meta?.target as string[] | undefined;
      return res.status(409).json({
        success: false,
        error: {
          message: `${field?.[0] || 'Field'} already exists`,
          code: 'DUPLICATE_ENTRY',
        },
      });

    case 'P2025':
      // Record not found
      return res.status(404).json({
        success: false,
        error: {
          message: 'Record not found',
          code: 'NOT_FOUND',
        },
      });

    case 'P2003':
      // Foreign key constraint violation
      return res.status(400).json({
        success: false,
        error: {
          message: 'Invalid reference to related record',
          code: 'FOREIGN_KEY_CONSTRAINT',
        },
      });

    default:
      return res.status(500).json({
        success: false,
        error: {
          message: 'Database error',
          code: 'DATABASE_ERROR',
          ...(process.env.NODE_ENV === 'development' && { details: error.message }),
        },
      });
  }
};
