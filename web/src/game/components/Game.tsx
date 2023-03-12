import React, { useEffect } from 'react';
import { socket } from '@app/socket';
import { GameEventType } from '../game.models';
import { useGameStore } from '../game.state';
import GameEvent from './GameEvent';
import NextEvent from './NextEvent';

const Game: React.FC = () => {
  const {
    game,
    getCurrentPlayer,
    isFirstPlayer,
    getLastEvent,
    isLastPlayer,
    handleSocketError
  } = useGameStore((s) => ({
    game: s.game,
    getCurrentPlayer: s.getCurrentPlayer,
    isFirstPlayer: s.isFirstPlayer,
    getLastEvent: s.getLastEvent,
    getCurrentPlayerId: s.getCurrentPlayerId,
    isLastPlayer: s.isLastPlayer,
    shouldShowNextEvent: s.shouldShowNextEvent,
    handleSocketError: s.handleSocketError
  }));

  if (!game) {
    return null;
  }
  const player = getCurrentPlayer();

  // initial number
  useEffect(() => {
    if (game.events.length) {
      return;
    }

    // the first player starts the game
    if (isFirstPlayer()) {
      socket.emit(
        'sendInitialNumber',
        {
          gameId: game._id,
          number: Math.floor(Math.random() * (200 - 50)) + 50
        },
        (res: string) => {
          handleSocketError(res);
        }
      );
    }
  }, [game.events.length]);

  const lastEvent = getLastEvent();

  if (player && lastEvent && !isLastPlayer()) {
    const divicibleBy3 = (num: number) => num % 3 === 0;

    if (
      lastEvent.type === GameEventType.InitailNumber ||
      lastEvent.type === GameEventType.DivideNumber
    ) {
      const emit = (addition: number) => {
        socket.emit(
          'divideNumber',
          {
            gameId: game._id,
            addition
          },
          (data: string) => {
            handleSocketError(data);
          }
        );
      };

      if (player.automatic) {
        if (divicibleBy3(lastEvent.number + 0)) setTimeout(() => emit(0), 1000);
        else if (divicibleBy3(lastEvent.number + 1))
          setTimeout(() => emit(1), 1000);
        else if (divicibleBy3(lastEvent.number - 1))
          setTimeout(() => emit(-1), 1000);
      }
    }
  }

  return (
    <div className="text-white flex justify-center align-middle mt-20 w-auto ">
      <div className="flex flex-col w-fit mb-10 ">
        <div className="flex justify-between">
          {game.players.map((p) => (
            <p key={p._id}>
              {p.automatic && (
                <img
                  src="/robot.svg"
                  alt="Automated"
                  className="w-9 inline-block"
                />
              )}
              {!p.automatic && (
                <>
                  <img
                    className="w-7 inline-block"
                    src="/heart.svg"
                    alt="Lives"
                  />{' '}
                  <span className="text-xl">{p.remainingLives}</span>
                </>
              )}
            </p>
          ))}
        </div>
        {game.events.map((e, i) => (
          <GameEvent
            event={e}
            key={e._id}
            game={game}
            focus={i === game.events.length - 1}
          />
        ))}
        {<NextEvent />}
      </div>
    </div>
  );
};

export default Game;
