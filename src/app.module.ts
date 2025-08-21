import { Logger, MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ClsModule } from 'nestjs-cls';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource, DataSourceOptions } from 'typeorm';
import { StoriesModule } from './stories/stories.module';
import { SystemModule } from './system/system.module';
import { LogsMiddleware } from './system/logger/logs.middleware';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
    ClsModule.forRoot({
      global: true,
      middleware: { mount: true },
    }),
    SystemModule,
    AuthModule,
    UsersModule,
    StoriesModule,
  ],
  controllers: [AppController],
  providers: [AppService,     Logger,
],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*')
  }
}
