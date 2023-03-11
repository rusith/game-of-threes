export interface IncomingSocket {
  on: <T>(
    eventName: string,
    handler: (data: T, cb: (...args: unknown[]) => unknown) => unknown
  ) => unknown;
}

export interface Controller {
  init(socket: IncomingSocket, userId: string): void;
}
