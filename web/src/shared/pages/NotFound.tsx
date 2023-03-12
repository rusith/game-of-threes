import React from 'react';
import { useNavigate } from 'react-router-dom';
import { paths } from '@app/routes';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col h-full items-center justify-center p-4">
      <h1 className="text-2xl md:text-4xl text-center text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text">
        We cannot find the page you are looking for.
      </h1>

      <button className="p-2 bg-blue-500 mt-6 rounded hover:scale-110 duration-100">
        <p
          className="text-1xl text-transparent bg-gradient-to-b from-white to-white-t-60 bg-clip-text"
          onClick={() => navigate(paths.home)}
        >
          Home
        </p>
      </button>
    </div>
  );
};

export default NotFound;
