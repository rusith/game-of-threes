import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="flex flex-col h-full items-center justify-center p-4">
      <h1 className="text-4xl md:text-6xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
        Game of Three
      </h1>
      <h4 className="text-lg mt-2 text-gray-500">
        A game of strategic number play!
      </h4>

      <button className="p-2 bg-blue-500 mt-6 rounded hover:scale-110 duration-100">
        <p className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
          New Game
        </p>
      </button>
    </div>
  );
};

export default HomePage;
