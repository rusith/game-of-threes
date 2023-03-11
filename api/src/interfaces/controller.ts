export interface IncomingSocket {
  on: <T>(
    eventName: string,
    handler: (data: T, cb: (...args: unknown[]) => unknown) => unknown
  ) => unknown;
  emit: <T>(eventName: string, data: T) => unknown;
}

export interface Controller {
  init(socket: IncomingSocket, userId: string): void;
}
