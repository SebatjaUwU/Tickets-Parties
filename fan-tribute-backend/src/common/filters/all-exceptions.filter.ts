import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('ExceptionsFilter');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let error = 'INTERNAL_SERVER_ERROR';
    let message = 'Error interno del servidor';
    let details: string[] | undefined;

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object') {
        const resp = exceptionResponse as any;
        message = resp.message ?? exception.message;
        error = resp.error ?? exception.constructor.name.replace('Exception', '').toUpperCase();
        if (Array.isArray(resp.message)) {
          details = resp.message;
          message = 'Datos de entrada inválidos';
        }
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      this.logger.error(`Unhandled error: ${exception.message}`, exception.stack);
    }

    res.status(status).json({
      statusCode: status,
      error,
      message,
      details,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
