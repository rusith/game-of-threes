import React, { useState } from 'react';
import Modal from '@app/shared/components/Modal';
import { useGameStore } from '../game.state';

const JoinGameModal: React.FC = () => {
  const [playerName, setPlayerName] = useState('');
  const joinGame = useGameStore((s) => s.joinGame);

  return (
    <Modal>
      <div className="flex flex-col">
        <label>Your Name</label>
        <input
          type="text"
          className="h-9 rounded mt-1 p-1 text-gray-700 outline-none"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />

        <button
          className="p-2 bg-blue-500 mt-6 rounded hover:scale-110 duration-100 disabled:bg-gray-400"
          disabled={!playerName}
          onClick={() => joinGame(playerName)}
        >
          <p className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
            Join
          </p>
        </button>
      </div>
    </Modal>
  );
};

export default JoinGameModal;
