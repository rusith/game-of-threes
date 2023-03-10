import { injectable } from "inversify";
import { ConfigProvider } from ".";

@injectable()
export class EnvConfigProvider implements ConfigProvider {
  public getDbUrl(): string {
    return process.env.DB_URI!;
  }

  public getPort(): number {
    return parseInt(process.env.PORT || "8080");
  }

  public getRedisHost(): string {
    return process.env.REDIS_HOST!;
  }

  public getRedisPort(): number {
    return parseInt(process.env.REDIS_PORT!);
  }

  public getRedisPassword(): string {
    return process.env.REDIS_PASSWORD!;
  }
}
