import { paths } from '@app/routes';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Game, GameEvent, GameEventType } from '../game.models';
import GameEventContainer from './GameEventContainer';
import Number from './Number';
import Text from './Text';

const GameEvent: React.FC<{ event: GameEvent; game: Game; focus: boolean }> = ({
  event,
  game,
  focus
}) => {
  const otherPlayer = game.players.find((p) => p._id !== event.player._id);
  const navigate = useNavigate();

  function renderEvent() {
    if (!otherPlayer) return null;
    switch (event.type) {
      case GameEventType.InitailNumber:
        return <Number number={event.number} color={event.player.color} />;
      case GameEventType.DivideNumber:
        return (
          <div className="flex">
            {event.addition !== 0 && <Text text="(" />}
            <Number color={otherPlayer.color} number={event.original} />
            {event.addition === -1 && (
              <Number number="-1" color={event.player.color} />
            )}
            {event.addition === 1 && (
              <Number number="+1" color={event.player.color} />
            )}
            {event.addition !== 0 && <Text text=")" />}
            <Text text="÷" />
            <Text text="3" />
            <Text text="=" />
            <Number color={event.player.color} number={event.number} />
          </div>
        );
      case GameEventType.Winner:
        return (
          <>
            <p style={{ color: event.player.color }}>is the winner 🎉</p>
            <button
              className="p-2 bg-blue-500 mt-6 rounded hover:scale-110 duration-100 disabled:bg-gray-400"
              onClick={() => navigate(paths.home)}
            >
              <p className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
                Home
              </p>
            </button>
          </>
        );
      case GameEventType.LoseLife:
        return (
          <p className="text-red-500">
            {event.number} is not divicible by 3. only {event.remainigLives}{' '}
            lives left.
          </p>
        );
      default:
        return null;
    }
  }

  return (
    <GameEventContainer
      color={event.player.color}
      playerName={event.player.name}
      playerId={event.player._id}
      focus={focus}
    >
      {renderEvent()}
    </GameEventContainer>
  );
};

export default GameEvent;
