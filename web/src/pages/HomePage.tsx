import React, { useEffect } from "react";
import Modal from "../components/shared/Modal";
import { socket } from "../socket";

const HomePage: React.FC = () => {
  const [isConnected, setIsConnected] = React.useState(false);
  const [isShowNewGameModal, setIsShowNewGameModal] = React.useState(false);
  const [playerName, setPlayerName] = React.useState("");
  const [gameType, setGameType] = React.useState("Manual");

  useEffect(() => {
    const onConnect = () => {
      setIsConnected(true);
    };

    socket.on("connect", onConnect);

    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  function handleNewGameClick() {
    setIsShowNewGameModal(true);
  }

  function handleStartGame() {
    socket.emit(
      "newGame",
      {
        playerName,
        gameType,
      },
      (val: string) => {
        console.log(val);
      }
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 relative">
      <h1 className="text-4xl md:text-6xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
        Game of Three
      </h1>
      <h4 className="text-lg mt-2 text-gray-500">
        A game of strategic number play!
      </h4>

      <button
        className="p-2 bg-blue-500 mt-6 rounded hover:scale-110 duration-100 disabled:bg-gray-400"
        disabled={!isConnected}
        onClick={handleNewGameClick}
      >
        <p className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
          {isConnected ? "New Game" : "Loading..."}
        </p>
      </button>

      {isShowNewGameModal && (
        <Modal>
          <div className="flex flex-col">
            <label>Your Name</label>
            <input
              type="text"
              className="h-9 rounded mt-1 p-1 text-gray-700 outline-none"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />
          </div>

          <div className="flex flex-col mt-3">
            <label>Game Type</label>
            <select
              className="h-9 rounded mt-1 p-1 text-gray-700 outline-none"
              value={gameType}
              onChange={(e) => setGameType(e.target.value)}
            >
              <option value="Manual">Manual</option>
              <option value="Automatic">Automatic</option>
              <option value="VsComputer">vs Computer</option>
            </select>
            {gameType === "VsComputer" && (
              <p className="text-sm text-gray-600 mt-2">
                Play with the computer
              </p>
            )}
            {gameType === "Manual" && (
              <p className="text-sm text-gray-600 mt-2">Play with a friend</p>
            )}
            {gameType === "Automatic" && (
              <p className="text-sm text-gray-600 mt-2">
                See how two computers play
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              className="p-2 bg-blue-500 mt-6 rounded hover:scale-110 duration-100 disabled:bg-gray-400"
              disabled={!isConnected || !playerName}
              onClick={handleStartGame}
            >
              <p className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
                {isConnected ? "Start" : "Loading..."}
              </p>
            </button>
            <button
              className="p-2 bg-red-500 mt-6 rounded hover:scale-110 duration-100 disabled:bg-gray-400 ml-5"
              onClick={() => {
                setPlayerName("");
                setGameType("Manual");
                setIsShowNewGameModal(false);
              }}
            >
              <p className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
                Cancel
              </p>
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default HomePage;
