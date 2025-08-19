import { Global, Logger, Module } from '@nestjs/common';
import { AppLogger } from './logger/app.logger';
import { TransactionInterceptor } from './interceptor/transaction.interceptor';
import { ContextHelper } from './helper/context.helper';

@Global()
@Module({
  imports: [],
  providers: [AppLogger, Logger, ContextHelper, TransactionInterceptor],
  exports: [AppLogger, ContextHelper],
  controllers: [],
})
export class SystemModule {}
