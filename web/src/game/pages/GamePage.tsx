import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { socket } from "../../socket";
import WaitingForPlayer from "../components/WaitingForPlayer";
import { Game } from "../game.models";
import { useGameStore } from "../game.state";

const GamePage: React.FC = () => {
  const { id } = useParams();
  const { game, setGame, setGameId, setGameLoading, gameLoading } =
    useGameStore();

  useEffect(() => {
    if (id) {
      setGameId(id);
      setGameLoading(true);
      socket.emit("joinGame", id, (game: Game) => {
        setGame(game);
        setGameLoading(false);
      });
    }
  }, [id]);

  if (gameLoading || !game) {
    return (
      <div className="flex flex-col h-full items-center justify-center p-4 relative">
        <h1 className="text-4xl md:text-6xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
          Loading...
        </h1>
      </div>
    );
  }

  if (game.players.length === 1) {
    return <WaitingForPlayer />;
  }

  return (
    <div>
      <h1>Game Page : {id}</h1>
    </div>
  );
};

export default GamePage;
