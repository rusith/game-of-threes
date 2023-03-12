import React from 'react';

const Number: React.FC<{
  color?: string;
  number: number | string;
  onSelect?: (value: number) => void;
}> = ({ color, number, onSelect }) => {
  const handleOnClick = () => {
    if (!onSelect) return;
    onSelect(parseInt(`${number}`, 10));
  };

  return (
    <div
      {...(onSelect ? {} : { style: { backgroundColor: color } })}
      className={
        'rounded-full  text-black w-12 h-12 text-center align-middle pt-2 ml-2  ' +
        (number > 99 ? 'text-lg' : 'text-xl') +
        (onSelect
          ? ' bg-gray-300 cursor-pointer hover:scale-110 hover:bg-gray-100'
          : '')
      }
      onClick={handleOnClick}
    >
      {number}
    </div>
  );
};

export default Number;
