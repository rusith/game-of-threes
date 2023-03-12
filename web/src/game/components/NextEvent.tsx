import React from 'react';
import { socket } from '@app/socket';
import { GameEventType } from '../game.models';
import { useGameStore } from '../game.state';
import GameEventContainer from './GameEventContainer';
import Number from './Number';
import Text from './Text';

const NextEvent: React.FC = () => {
  const {
    player,
    lastEvent,
    gameId,
    handleSocketError,
    shouldShowNextEvent,
    players
  } = useGameStore((s) => ({
    player: s.getCurrentPlayer(),
    lastEvent: s.getLastEvent(),
    gameId: s.gameId,
    handleSocketError: s.handleSocketError,
    shouldShowNextEvent: s.shouldShowNextEvent,
    players: s.game?.players
  }));

  if (
    !lastEvent ||
    (lastEvent.type !== GameEventType.DivideNumber &&
      lastEvent.type !== GameEventType.InitailNumber)
  ) {
    return null;
  }

  const handleOnSelect = (addition: number) => {
    socket.emit(
      'divideNumber',
      {
        gameId,
        addition
      },
      (data: string) => {
        handleSocketError(data);
      }
    );
  };

  if (shouldShowNextEvent() && player) {
    return (
      <GameEventContainer
        color={player.color}
        playerName={player.name}
        playerId={player._id}
        focus={true}
      >
        <div className="flex">
          <Text text="(" />
          <Number color={lastEvent.player.color} number={lastEvent.number} />
          <Number number={'-1'} onSelect={handleOnSelect} />
          <Number number={'0'} onSelect={handleOnSelect} />
          <Number number={'+1'} onSelect={handleOnSelect} />
          <Text text=")" />
          <Text text="÷" />
          <Text text="3" />
          <Text text="=" />
          <Number number={'?'} color={player?.color} />
        </div>
      </GameEventContainer>
    );
  }

  const otherPlayer = players?.find((p) => p._id !== player?._id);

  if (!otherPlayer) {
    return null;
  }

  return (
    <GameEventContainer
      color={otherPlayer.color}
      playerName={otherPlayer.name}
      playerId={otherPlayer._id}
      focus={true}
    >
      Is Playing
    </GameEventContainer>
  );
};

export default NextEvent;
