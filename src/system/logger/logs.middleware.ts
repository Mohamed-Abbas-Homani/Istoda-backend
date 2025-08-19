import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppLogger } from './app.logger';

@Injectable()
export class LogsMiddleware implements NestMiddleware {
  constructor(private readonly logger: AppLogger) {}

  use(request: Request, response: Response, next: NextFunction) {
    response.on('finish', () => {
      const { method, originalUrl } = request;
      const { statusCode, statusMessage } = response;

      const data = {
        method,
        originalUrl,
        statusCode,
        statusMessage,
      };

      if (statusCode >= 500) {
        return this.logger.error(originalUrl, data);
      }

      if (statusCode >= 400) {
        return this.logger.warn(originalUrl, data);
      }
      return this.logger.info(originalUrl, data);
    });

    next();
  }
}
