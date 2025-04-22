import React from 'react';

/**
 * A single color indicator for the legend
 */
const ColorIndicator = ({ categoryName, className, description }) => (
  <div className="color-indicator-wrapper" data-tooltip={description}>
    <span className={`color-indicator ${className}`}></span>
    <span className="color-indicator-text">{categoryName}</span>
  </div>
);

/**
 * Color legend component for delta categories
 * @returns {JSX.Element} - Color legend component
 */
const ColorLegend = () => {
  return (
    <div className="color-legend">
      <ColorIndicator 
        categoryName="Excellent" 
        className="excellent" 
        description="Δ < 0.3 meV/atom: Great agreement with all-electron reference calculations"
      />
      <ColorIndicator 
        categoryName="Good" 
        className="good" 
        description="0.3 ≤ Δ < 1 meV/atom: Good agreement with all-electron reference calculations"
      />
      <ColorIndicator 
        categoryName="Fair" 
        className="fair" 
        description="1 ≤ Δ < 2 meV/atom: Fair agreement with all-electron reference calculations"
      />
      <ColorIndicator 
        categoryName="Poor" 
        className="poor" 
        description="Δ ≥ 2 meV/atom: Substantial deviations from all-electron reference calculations. Use with caution"
      />
    </div>
  );
};

export default ColorLegend;
