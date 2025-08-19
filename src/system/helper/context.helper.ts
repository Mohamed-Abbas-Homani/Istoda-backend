import { Injectable } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { EntityManager } from 'typeorm/entity-manager/EntityManager';
import { DataSource } from 'typeorm';
import { APP_CLS } from '../../app.constants';
import { User } from 'src/users/entity/user.entity';

@Injectable()
export class ContextHelper {
  constructor(
    private dataSource: DataSource,
    private readonly cls: ClsService,
  ) {}

  getUserId(): string {
    return this.get(APP_CLS.CURRENT_USER_ID);
  }

  setUserId(userId: string) {
    this.set(APP_CLS.CURRENT_USER_ID, userId);
  }

  getUser(): User {
    return this.get(APP_CLS.CURRENT_USER);
  }

  setUser(user: User) {
    this.set(APP_CLS.CURRENT_USER, user);
  }

  getTrx(): EntityManager {
    return this.get(APP_CLS.CURRENT_DB_TRANSACTION) ?? this.dataSource.manager;
  }

  setTrx(transaction: EntityManager) {
    this.set(APP_CLS.CURRENT_DB_TRANSACTION, transaction);
  }

  getIp(): string {
    return this.get(APP_CLS.CURRENT_IP);
  }

  setIp(ip: string) {
    this.set(APP_CLS.CURRENT_IP, ip);
  }

  getApi(): string {
    return this.get(APP_CLS.CURRENT_API);
  }

  setApi(api: string) {
    this.set(APP_CLS.CURRENT_API, api);
  }

  getLanguage(): string {
    return this.get(APP_CLS.CURRENT_LANGUAGE);
  }

  setLanguage(language: string) {
    this.set(APP_CLS.CURRENT_LANGUAGE, language);
  }

  get(key: string): any {
    return this.cls.get(key);
  }

  set(key: string, value: any): void {
    this.cls.set(key, value);
  }
}
