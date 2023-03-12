import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { socket } from '@app/socket';
import GameComponent from '../components/Game';
import GameLoading from '../components/GameLoading';
import JoinGameModal from '../components/JoinGameModal';
import WaitingForPlayer from '../components/WaitingForPlayer';
import { Game, GameType } from '../game.models';
import { useGameStore } from '../game.state';

const GamePage: React.FC = () => {
  const { id } = useParams();
  const {
    game,
    setGame,
    setGameId,
    setGameLoading,
    gameLoading,
    getCurrentPlayer,
    joinGame,
    isJoinGameModalOpen,
    setIsJoinGameModalOpen,
    handleSocketError
  } = useGameStore((s) => ({
    game: s.game,
    setGame: s.setGame,
    setGameId: s.setGameId,
    setGameLoading: s.setGameLoading,
    gameLoading: s.gameLoading,
    getCurrentPlayer: s.getCurrentPlayer,
    joinGame: s.joinGame,
    isJoinGameModalOpen: s.isJoinGameModalOpen,
    setIsJoinGameModalOpen: s.setIsJoinGameModalOpen,
    handleSocketError: s.handleSocketError
  }));

  useEffect(() => {
    if (!id) {
      return;
    }

    setGameId(id);
    setGameLoading(true);

    socket.emit('getGame', id, (game: Game) => {
      if (handleSocketError(game)) {
        return;
      }

      setGame(game);

      if (game.type === GameType.Automatic) {
        joinGame();
      } else {
        if (game.type === GameType.VsComputer) {
          if (game.players.length === 1) {
            joinGame();
          } else if (!game.players.length) {
            setIsJoinGameModalOpen(true);
          }
        } else {
          if (getCurrentPlayer()) {
            joinGame();
          } else {
            setIsJoinGameModalOpen(true);
          }
        }
      }
      setGameLoading(false);
    });
  }, [id]);

  useEffect(() => {
    if (!game?._id) return;

    socket.on('gameUpdated', (updatedGame: Game) => {
      setGame(updatedGame);
    });

    return () => {
      socket.off('gameUpdated');
    };
  }, [game?._id]);

  if (gameLoading || !game) {
    return <GameLoading />;
  }

  return (
    <div className="flex flex-col h-full ">
      {game && game.players.length === 2 && <GameComponent />}
      {game && game.players.length === 1 && getCurrentPlayer() && (
        <WaitingForPlayer />
      )}
      {isJoinGameModalOpen && <JoinGameModal />}
    </div>
  );
};

export default GamePage;
