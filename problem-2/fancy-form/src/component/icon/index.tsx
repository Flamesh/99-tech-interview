import React from "react";

interface IconButtonProps {
  className?: string;
  onClick: () => void;
  icon: React.ReactNode;
}

export const IconButton: React.FC<IconButtonProps> = ({
  className,
  onClick,
  icon,
}) => {
  return (
    <div className="flex justify-center -my-3 z-10 relative">
      <button
        onClick={onClick}
        className={`bg-gray-600 hover:bg-gray-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${className}`}
      >
        {icon}
      </button>
    </div>
  );
};
