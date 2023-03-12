import React from 'react';

const Text: React.FC<{ text: string }> = ({ text }) => {
  return <span className="text-white text-4xl p-1">{text}</span>;
};

export default Text;
