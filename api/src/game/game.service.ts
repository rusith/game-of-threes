import { GameType } from '@app/enums/game-type.enum';
import { Game } from '@app/models/game.model';
import { TYPES } from '@app/types';
import { inject, injectable } from 'inversify';
import {
  DivideNumberRequest,
  GamePubSub,
  GameRepository,
  GameService,
  JoinGameRequest,
  SendInitialNumberRequest as SendInitialNumberRequest
} from '.';
import { GameEvent } from '@app/models/schema/game-event';
import { IncomingSocket } from '@app/interfaces/controller';
import { GameEventType } from '@app/enums/game-event.type.enum';
import { nanoid } from 'nanoid';
import { GamePlayer } from '@app/models/schema/game-player';

@injectable()
export class GameServiceImpl implements GameService {
  public constructor(
    @inject(TYPES.GameRepository)
    private readonly gameRepository: GameRepository,
    @inject(TYPES.GamePubSub)
    private readonly gamePubSub: GamePubSub
  ) {}

  public async newGame(gameType: GameType, userId: string): Promise<string> {
    if (!gameType) {
      throw new Error('Game type is required');
    }

    if (!userId) {
      throw new Error('User id is required');
    }

    const newGame: Omit<Game, '_id'> = {
      players: [],
      type: gameType,
      events: []
    };

    return this.gameRepository.create(newGame);
  }

  public async joinGame(
    data: JoinGameRequest,
    userId: string,
    socket: IncomingSocket
  ): Promise<Game> {
    const game = await this.gameRepository.get(data.gameId);

    if (!game) {
      throw new Error('Game not found');
    }

    const playerExists = game.players.find((p) => p._id === userId);

    if (!playerExists) {
      const otherPlayers = game.players.filter((p) => p._id !== userId);
      if (otherPlayers.length > 1) {
        throw new Error('Game is full');
      }
    }

    let automatic = false;
    if (game.type === GameType.Automatic) {
      automatic = true;
    } else if (game.type === GameType.VsComputer) {
      automatic = game.players.length === 1;
    }

    const colors = ['#01E6F4', '#51FE14'];

    function getRandomColor(): string {
      const color = colors[Math.floor(Math.random() * colors.length)];
      if (game.players.some((p) => p.color === color)) {
        return getRandomColor();
      }
      return color;
    }

    if (!playerExists) {
      game.players = [
        ...game.players,
        {
          _id: userId,
          name:
            data.playerName ||
            (game.players.length === 1 ? 'Player 2' : 'Player 1'),
          remainingLives: 3,
          automatic,
          color: getRandomColor()
        }
      ];
      await this.gameRepository.update(data.gameId, game);
    }

    this.gamePubSub.addListener(game._id.toString(), (game) =>
      socket.emit('gameUpdated', game)
    );

    await this.gamePubSub.publish(game);

    return game;
  }

  public async getGame(id: string): Promise<Game> {
    return this.gameRepository.get(id);
  }

  public async handleSendInitialNumberRequest(
    data: SendInitialNumberRequest,
    userId: string
  ): Promise<void> {
    const game = await this.gameRepository.get(data.gameId);
    if (!game) {
      throw new Error('Game not found!');
    }

    if (game.events.length) {
      throw new Error('Game already initialized!');
    }

    const player = game.players.find((p) => p._id === userId);

    if (!player) {
      throw new Error('Player not found!');
    }

    const event = {
      _id: nanoid(20),
      type: GameEventType.InitialNumber,
      player: {
        _id: userId,
        name: player.name,
        color: player.color
      },
      number: data.number
    } as GameEvent;

    game.events = [...game.events, event];

    await this.gameRepository.update(data.gameId, game);

    await this.gamePubSub.publish(game);
  }

  public async handleDivideNumberRequest(
    request: DivideNumberRequest,
    playerId: string
  ): Promise<void> {
    const game = await this.gameRepository.get(request.gameId);

    // validations
    if (!game) throw new Error('Game not found!');
    if (!playerId) throw new Error('Player id is required!');

    const player = game.players.find((p) => p._id === playerId);

    if (!player) throw new Error('Player not found!');

    const lastEvent = this.getLastEvent(game);

    if (!lastEvent) throw new Error('Game not initialized!');
    if (lastEvent.player._id === playerId) throw new Error('Not your turn!');

    if (
      lastEvent.type === GameEventType.DivideNumber ||
      lastEvent.type === GameEventType.InitialNumber
    ) {
      if ((lastEvent.number + request.addition) % 3 !== 0) {
        const events = [
          {
            _id: nanoid(20),
            type: GameEventType.LoseLife,
            player: this.getEventPlayer(player),
            remainigLives: player.remainingLives - 1,
            number: lastEvent.number + request.addition
          }
        ] as GameEvent[];

        if (player.remainingLives === 1) {
          const otherPlayer = game.players.find((p) => p._id !== playerId);
          if (!otherPlayer) throw new Error('Other player not found!');

          events.push({
            _id: nanoid(20),
            type: GameEventType.Winner,
            player: this.getEventPlayer(otherPlayer)
          } as GameEvent);
        }

        game.players = game.players.map((p) =>
          p._id === playerId
            ? {
                ...p,
                remainingLives: p.remainingLives - 1
              }
            : p
        );
        await this.addEventsToGame(game, events);
        return;
      }

      const number = (lastEvent.number + request.addition) / 3;
      const events = [
        {
          _id: nanoid(20),
          type: GameEventType.DivideNumber,
          number,
          player: this.getEventPlayer(player),
          original: lastEvent.number,
          addition: request.addition,
          withAddition: lastEvent.number + request.addition
        }
      ] as GameEvent[];

      if (number === 1) {
        events.push({
          _id: nanoid(20),
          type: GameEventType.Winner,
          player: {
            _id: playerId,
            name: player.name,
            color: player.color
          }
        });
      }

      await this.addEventsToGame(game, events);
    }
  }

  private getEventPlayer(
    player: GamePlayer
  ): Pick<GamePlayer, '_id' | 'color' | 'name'> {
    return {
      _id: player._id,
      name: player.name,
      color: player.color
    };
  }

  private getLastEvent(game: Game, index = -1): GameEvent | undefined {
    const event = game.events.at(index);
    if (event?.type === GameEventType.LoseLife) {
      return this.getLastEvent(game, index - 1);
    }
    return event;
  }

  private async addEventsToGame(game: Game, newEvents: GameEvent[]) {
    game.events = [...(game.events || []), ...(newEvents || [])];
    await this.gameRepository.update(game._id, game);
    await this.gamePubSub.publish(game);
  }

  private async handleEvent(
    userId: string,
    gameId: string,
    event: GameEvent,
    socket: IncomingSocket
  ) {
    const game = await this.gameRepository.get(gameId);
    socket.emit('gameUpdated', game);
  }
}
