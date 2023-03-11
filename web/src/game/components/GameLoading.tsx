import React from "react";

const GameLoading: React.FC = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4 relative">
      <h1 className="text-4xl md:text-6xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
        Loading...
      </h1>
    </div>
  );
};

export default GameLoading;
