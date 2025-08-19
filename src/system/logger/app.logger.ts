import { Injectable, Logger } from '@nestjs/common';
import { ContextHelper } from '../helper/context.helper';

@Injectable()
export class AppLogger {
  constructor(
    private readonly logger: Logger,
    private readonly contextHelper: ContextHelper,
  ) {}

  info(message: string, data: any = null) {
    this.logger.log(message, this.getLoggingData(data));
  }

  debug(message: string, data: any = null) {
    this.logger.debug(message, this.getLoggingData(data));
  }

  error(message: string, data: any = null) {
    this.logger.error(message, this.getLoggingData(data));
  }

  warn(message: string, data: any = null) {
    this.logger.warn(message, this.getLoggingData(data));
  }

  getLoggingData(data: any) {
    const e = new Error('dummy');
    const stack = e.stack?.split('\n')[3]?.replace(/^\s+at\s+(.+?)\s.+/g, '$1');

    return {
      ...data,
      userId: this.contextHelper.getUserId(),
      ip: this.contextHelper.getIp(),
      api: this.contextHelper.getApi(),
      location: stack,
    };
  }
}
