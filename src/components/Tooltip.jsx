import { useState } from 'react';

const Tooltip = ({ text, children }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="cursor-pointer"
      >
        {children}
      </div>
      {showTooltip && (
        <div className="absolute bottom-full mb-2 w-max max-w-xs p-1 bg-gray-300 text-gray-500 text-sm rounded-lg shadow-lg">
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
