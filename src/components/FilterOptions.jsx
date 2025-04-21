import React from 'react';
import './FilterOptions.css';

const FilterOptions = ({ includeAllElectron, onToggleAllElectron }) => {
  return (
    <div className="filter-options">
      <label className="checkbox-container">
        <input 
          type="checkbox" 
          checked={includeAllElectron} 
          onChange={onToggleAllElectron}
        />
        <span className="checkbox-text">Include all-electron codes (WIEN2k, FLEUR)</span>
      </label>
      
      <div className="info-tooltip">
        <span className="info-icon">ⓘ</span>
        <span className="tooltip-text">
          All-electron codes generally offer high accuracy but have a steeper learning curve and higher computational cost.
        </span>
      </div>
    </div>
  );
};

export default FilterOptions;
