import { injectable } from 'inversify';
import { ConfigProvider } from '.';

@injectable()
export class EnvConfigProvider implements ConfigProvider {
  public getDbUrl(): string {
    return process.env.DB_URI ?? '';
  }

  public getPort(): number {
    return parseInt(process.env.PORT || '8080');
  }

  public getFrontendUrl(): string {
    return process.env.FRONTEND_URL ?? '';
  }

  public getRedisUrl(): string {
    return process.env.REDIS_URL ?? '';
  }
}
