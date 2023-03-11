import React from "react";

const Modal: React.FC<{ children: React.ReactNode; width?: string }> = ({
  children,
  width,
}) => {
  return (
    <div className="absolute w-full h-full backdrop-blur-sm z-1">
      <div
        className={
          "p-6 bg-gray-300 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded z-10 " +
          (width ?? "")
        }
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
