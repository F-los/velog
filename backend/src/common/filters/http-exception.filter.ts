import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

/**
 * Global HTTP Exception Filter
 * Single Responsibility: 모든 HTTP 예외를 ApiResponseDto 형식으로 변환
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract error message
    let message: string;
    let error: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      error = exception.name;
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;

      // Handle validation errors (class-validator)
      if (Array.isArray(responseObj.message)) {
        message = responseObj.message.join(', ');
      } else {
        message = responseObj.message || exception.message;
      }

      error = responseObj.error || exception.name;
    } else {
      message = exception.message;
      error = exception.name;
    }

    // Log error for debugging (in production, use proper logger)
    if (status >= 500) {
      console.error(`[${new Date().toISOString()}] ${request.method} ${request.url}`, {
        status,
        error,
        message,
        stack: exception.stack,
      });
    }

    // Return standardized ApiResponseDto format
    response.status(status).json(
      ApiResponseDto.error(message, error)
    );
  }
}

/**
 * Global All Exceptions Filter
 * Catches any unexpected errors
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof Error
        ? exception.message
        : 'Internal server error';

    // Log all unexpected errors
    console.error(`[${new Date().toISOString()}] UNEXPECTED ERROR`, {
      method: request.method,
      url: request.url,
      error: exception,
      stack: exception instanceof Error ? exception.stack : undefined,
    });

    // Return standardized error response
    response.status(status).json(
      ApiResponseDto.error(
        status === HttpStatus.INTERNAL_SERVER_ERROR
          ? 'An unexpected error occurred'
          : message,
        'InternalServerError'
      )
    );
  }
}
