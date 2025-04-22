import React from 'react';

/**
 * A tooltip component that handles positioning and display
 * @param {Object} props - Component props
 * @param {string} props.text - Text to display in the tooltip
 * @param {ReactNode} props.children - Element that triggers the tooltip
 * @returns {JSX.Element} - Tooltip component
 */
const TooltipComponent = ({ text, children }) => {
  // Function to position tooltip when shown
  const handleMouseEnter = (e) => {
    const tooltip = e.currentTarget.querySelector('.tooltip-text');
    if (!tooltip) return;
    
    // Get the icon position
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Determine if there's enough space above the icon
    const spaceAbove = rect.top > 200; // 200px is a reasonable threshold
    
    if (spaceAbove) {
      // Position above the icon
      tooltip.style.bottom = `${window.innerHeight - rect.top + 10}px`;
      tooltip.style.left = `${rect.left + rect.width/2}px`;
      tooltip.style.transform = 'translateX(-50%)';
    } else {
      // Position below the icon
      tooltip.style.top = `${rect.bottom + 10}px`;
      tooltip.style.left = `${rect.left + rect.width/2}px`;
      tooltip.style.transform = 'translateX(-50%)';
    }
  };
  
  return (
    <span className="tooltip" onMouseEnter={handleMouseEnter}>
      {children}
      <span className="tooltip-text">{text}</span>
    </span>
  );
};

export default TooltipComponent;
