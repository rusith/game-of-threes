export interface IncomingSocket {
  on: (eventName: string, handler: <T>(data: T) => unknown) => unknown;
}

export interface Controller {
  init(socket: IncomingSocket): void;
}
