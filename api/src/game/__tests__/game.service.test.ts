import { GameType } from '@app/game/enums/game-type.enum';
import { IncomingSocket } from '@app/interfaces/controller';
import { container } from '@app/inversify.config';
import { TYPES } from '@app/types';
import { GamePubSub, GameRepository, GameService } from '..';

describe('GameService', () => {
  beforeEach(() => container.snapshot());
  afterEach(() => container.restore());

  function mockGameRepository(mock: Partial<GameRepository>) {
    container.unbind(TYPES.GameRepository);
    container.bind<GameRepository>(TYPES.GameRepository).toConstantValue({
      ...mock
    } as GameRepository);
  }

  function mockGamePubSub(mock: Partial<GamePubSub>) {
    container.unbind(TYPES.GamePubSub);
    container.bind<GamePubSub>(TYPES.GamePubSub).toConstantValue({
      ...mock
    } as GamePubSub);
  }

  describe('newGame', () => {
    it('should throw an error if the game type is not provided', async () => {
      // arrange
      mockGamePubSub({});
      mockGameRepository({});
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.newGame('' as GameType, 'user_id');

      // assert
      await expect(result).rejects.toThrowError('Game type is required');
    });

    it('should throw an error if the userid is not provided', async () => {
      // arrange
      mockGamePubSub({});
      mockGameRepository({});
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.newGame(GameType.Automatic, '');

      // assert
      await expect(result).rejects.toThrowError('User id is required');
    });

    it('should save new  game with correct values', async () => {
      // arrange
      const create = jest.fn().mockResolvedValue(true);
      mockGamePubSub({});
      mockGameRepository({
        create
      });
      const service = container.get<GameService>(TYPES.GameService);

      // act
      await service.newGame(GameType.Automatic, 'user_id');

      // assert
      expect(create).toBeCalledWith({
        events: [],
        players: [],
        type: GameType.Automatic
      });
    });
  });

  describe('joinGame', () => {
    it('should throw an error if the game was not found', () => {
      // arrange
      const get = jest.fn().mockResolvedValue(null);
      mockGamePubSub({});
      mockGameRepository({
        get
      });
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.joinGame(
        { gameId: 'game_id' },
        'user_id',
        {} as IncomingSocket
      );

      // assert
      expect(result).rejects.toThrowError('Game not found');
    });

    it('should throw an error if the game already has two players', () => {
      // arrange
      const get = jest.fn().mockResolvedValue({
        players: [{}, {}]
      });
      mockGamePubSub({});
      mockGameRepository({
        get
      });
      const service = container.get<GameService>(TYPES.GameService);

      // act
      const result = service.joinGame(
        { gameId: 'game_id' },
        'user_id',
        {} as IncomingSocket
      );

      // assert
      expect(result).rejects.toThrowError('Game is full');
    });

    it('should save correct values for the player', async () => {
      // arrange
      const get = jest.fn().mockResolvedValue({
        _id: 'game_id',
        players: [{}]
      });
      const update = jest.fn().mockResolvedValue(true);
      mockGamePubSub({
        addListener: jest.fn(),
        publish: jest.fn()
      });
      mockGameRepository({
        get,
        update
      });
      const service = container.get<GameService>(TYPES.GameService);

      // act
      await service.joinGame(
        { gameId: 'game_id', playerName: 'SSS' },
        'user_id',
        { on: jest.fn(), emit: jest.fn() } as IncomingSocket
      );

      // assert
      expect(update).toBeCalledWith(
        'game_id',
        expect.objectContaining({
          players: [
            {},
            {
              color: expect.any(String),
              _id: 'user_id',
              name: 'SSS',
              remainingLives: 3,
              automatic: false
            }
          ]
        })
      );
    });
  });
});
