import { Injectable } from '@nestjs/common';
import { config } from '../../config';
import { APP } from '../../app.constants';

@Injectable()
export class EnvHelper {
  static isLocal(): boolean {
    return config.environment === APP.LOCAL_ENV_NAME;
  }

  static isLocalOrTest(): boolean {
    return (
      config.environment === APP.LOCAL_ENV_NAME ||
      config.environment === APP.TEST_ENV_NAME
    );
  }

  static isLocalOrDev(): boolean {
    return (
      config.environment === APP.LOCAL_ENV_NAME ||
      config.environment === APP.DEV_ENV_NAME
    );
  }

  static isLocalOrTestOrDev(): boolean {
    return (
      config.environment === APP.LOCAL_ENV_NAME ||
      config.environment === APP.TEST_ENV_NAME ||
      config.environment === APP.DEV_ENV_NAME
    );
  }
}
