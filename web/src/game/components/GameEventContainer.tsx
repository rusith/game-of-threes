import React, { useEffect } from "react";
import { useGameStore } from "../game.state";

const GameEventContainer: React.FC<{
  children: React.ReactNode;
  color: string;
  playerName: string;
  playerId: string;
  focus?: boolean;
}> = ({ color, children, playerName, playerId, focus }) => {
  const { isFirstPlayer } = useGameStore((s) => ({
    isFirstPlayer: s.isFirstPlayer(playerId),
    player: s.getCurrentPlayer,
  }));

  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focus) {
      console.log(ref.current);
      ref.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [focus]);

  return (
    <div
      ref={ref}
      className={"flex mt-5 " + (isFirstPlayer ? "mr-auto" : "ml-auto")}
    >
      {!isFirstPlayer && <div className="w-14"></div>}
      <div className="flex-col flex">
        <p
          style={{ color }}
          className={
            "text-2xl mb-2 " + (isFirstPlayer ? "text-left" : "text-right")
          }
        >
          {playerName}
        </p>
        {children}
      </div>
      {isFirstPlayer && <div className="w-14"></div>}
    </div>
  );
};

export default GameEventContainer;
