import React from "react";
import { toast } from "react-hot-toast";
import { useGameStore } from "../game.state";

const WaitingForPlayer: React.FC = () => {
  const { gameId } = useGameStore();

  function copyLinkToClipboard() {
    const el = document.createElement("textarea");
    el.value = `${window.location.origin}/game/${gameId}`;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
    toast.success("Link copied to clipboard!");
  }

  return (
    <div className="flex flex-col h-full items-center justify-center p-4 relative">
      <h1 className="text-4xl md:text-6xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
        Waiting for Player 2
      </h1>
      <h4 className="text-lg mt-2 text-gray-500">
        Share the game link with your friend to start the game!
      </h4>

      <button
        className="p-2 bg-blue-500 mt-6 rounded hover:scale-110 duration-100 disabled:bg-gray-400"
        onClick={copyLinkToClipboard}
      >
        <p className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
          Copy Link
        </p>
      </button>
    </div>
  );
};

export default WaitingForPlayer;
