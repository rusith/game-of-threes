import { Controller } from "@app/interfaces/controller";
import http from "http";

export interface DBHelper {
  connect(dbUrl: string): Promise<void>;
}

export interface Queue {
  name: string;
  add: <T>(name: string, data: T) => Promise<any>;
  addListener<T>(name: string, callback: (data: T) => Promise<void>): void;
}

export interface QueueHelper {
  createQueue(name: string): Queue;
}

export interface ConfigProvider {
  getRedisHost(): string;
  getRedisPort(): number;
  getRedisPassword(): string;
  getDbUrl(): string;
  getPort(): number;
  getFrontendUrl(): string;
}

export interface SocketHelper {
  initiateServer(server: http.Server, controllers: Controller[]): Promise<void>;
}
