import * as dotenv from 'dotenv';
import * as process from 'process';
import { APP } from './app.constants';

dotenv.config();
process.env.TZ = APP.DEFAULT_TIMEZONE;

// the following contains the configuration loaded for the application
export const config = {
  environment: process.env.NODE_ENV || 'develop',
  port: process.env.PORT || 8000,
  bodyMaxSize: process.env.BODY_MAX_SIZE || 20 * 1024 * 1024,
  backendUrl: process.env.BACKEND_URL || 'http://localhost:8000',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  database: {
    type: process.env.DATABASE_TYPE || 'postgres',
    host: process.env.DATABASE_HOST || 'localhost',
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.DATABASE_USERNAME || 'postgres',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'istoda-db',
    synchronize: process.env.DATABASE_SYNCHRONIZE === 'true' || false,
    logging: process.env.DATABASE_LOGGING === 'true' || false,
    max: process.env.DATABASE_MAX_CONNECTIONS || 100,
    ssl: process.env.DATABASE_SSL_ENABLED === 'true' || false,
    rejectUnauthorized:
      process.env.DATABASE_REJECT_UNAUTHORIZED === 'true' || '',
    ca: process.env.DATABASE_CA === 'true' || undefined,
    key: process.env.DATABASE_KEY === 'true' || undefined,
    cert: process.env.DATABASE_CERT === 'true' || undefined,
  },
  log: {
    level: process.env.LOG_LEVEL || 'info',
  },
  auth: {
    jwtPrivateKey: process.env.AUTH_JWT_PRIVATE_KEY || 'test',
    jwtOtpShortExpiry:
      Number(process.env.AUTH_JWT_OTP_SHORT_EXPIRY_SECONDS) || 180000,
    jwtExpiry: Number(process.env.AUTH_JWT_EXPIRY_SECONDS) || 86400000,
  },
  swagger: {
    password: process.env.SWAGGER_PASS || 'swagger',
  },
};
