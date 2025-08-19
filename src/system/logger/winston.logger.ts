import { createLogger, format, transports } from 'winston';
import { config } from '../../config';

// for production environment
const instanceLogger = {
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    format.json(),
  ),
  transports: [
    new transports.File({
      filename: `logs/error.log`,
      level: 'error',
      format: format.combine(format.timestamp(), format.json()),
    }),
    // logging all level
    new transports.File({
      filename: `logs/combined.log`,
      level: config.log.level,
      format: format.combine(format.timestamp(), format.json()),
    }),
    // we also want to see logs in our console
    // we also want to see logs in our console
    new transports.Console({
      level: config.log.level,
      format: format.combine(
        format.cli(),
        format.splat(),
        format.timestamp(),
        format.printf(({ timestamp, level, message, context }) => {
          return `${timestamp} ${level}: ${message} - ${context ? JSON.stringify(context) : ''}`;
        }),
      ),
    }),
  ],
};

export const winstonInstance = createLogger(instanceLogger);
