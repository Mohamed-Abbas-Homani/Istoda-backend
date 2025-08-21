import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, concatMap, finalize, Observable } from 'rxjs';
import { DataSource } from 'typeorm';
import { ContextHelper } from '../helper/context.helper';
import { AppLogger } from '../logger/app.logger';

@Injectable()
export class TransactionInterceptor implements NestInterceptor {
  constructor(
    private readonly dataSource: DataSource,
    private readonly logger: AppLogger,
    private readonly contextHelper: ContextHelper,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    // get request object
    const req = context.switchToHttp().getRequest<Request>();
    // start transaction
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    // attach query manager with transaction to the request
    this.contextHelper.setTrx(queryRunner.manager);
    this.logger.debug('START_TRANSACTION', { originalUrl: req.originalUrl });

    return next.handle().pipe(
      // concatMap gets called when route handler completes successfully
      concatMap(async (data) => {
        this.logger.debug('COMMITTING_TRANSACTION', {
          originalUrl: req.originalUrl,
        });
        await queryRunner.commitTransaction();
        return data;
      }),
      // catchError gets called when route handler throws an exception
      catchError(async (e) => {
        this.logger.debug('ROLLBACK_TRANSACTION_AFTER_EXCEPTION', {
          originalUrl: req.originalUrl,
        });
        await queryRunner.rollbackTransaction();

        throw e;
      }),
      // always executed, even if catchError method throws an exception
      finalize(async () => {
        await queryRunner.release();
      }),
    );
  }
}
