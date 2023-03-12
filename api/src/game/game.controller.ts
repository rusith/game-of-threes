import { Controller, IncomingSocket } from '@app/interfaces/controller';
import {
  DivideNumberRequest,
  GameService,
  JoinGameRequest,
  NewGameRequest,
  SendInitialNumberRequest
} from '.';
import { inject, injectable } from 'inversify';
import { TYPES } from '@app/types';

@injectable()
export class GameControllerImpl implements Controller {
  public constructor(
    @inject(TYPES.GameService)
    private readonly gameService: GameService
  ) {}

  public init(socket: IncomingSocket, userId: string): void {
    socket.on('newGame', async (data: NewGameRequest, callback) => {
      try {
        callback(await this.gameService.newGame(data.gameType, userId));
      } catch (err: unknown) {
        if (err instanceof Error) {
          callback({ error: err.message });
        }
      }
    });

    socket.on('getGame', async (id: string, callback) => {
      try {
        callback(await this.gameService.getGame(id));
      } catch (err: unknown) {
        if (err instanceof Error) {
          callback({ error: err.message });
        }
      }
    });

    socket.on('joinGame', async (data: JoinGameRequest, callback) => {
      try {
        callback(await this.gameService.joinGame(data, userId, socket));
      } catch (err: unknown) {
        if (err instanceof Error) {
          callback({ error: err.message });
        }
      }
    });

    socket.on(
      'sendInitialNumber',
      async (data: SendInitialNumberRequest, callback) => {
        try {
          await this.gameService.handleSendInitialNumberRequest(data, userId);
          callback(true);
        } catch (err: unknown) {
          if (err instanceof Error) {
            callback({ error: err.message });
          }
        }
      }
    );

    socket.on('divideNumber', async (data: DivideNumberRequest, callback) => {
      try {
        await this.gameService.handleDivideNumberRequest(data, userId);
        callback(true);
      } catch (err: unknown) {
        if (err instanceof Error) {
          callback({ error: err.message });
        }
      }
    });
  }
}
