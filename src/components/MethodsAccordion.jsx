import React, { useState } from 'react';
import './MethodsAccordion.css';

const MethodsAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="methods-accordion">
      <button 
        className={`accordion-button ${isOpen ? 'active' : ''}`} 
        onClick={toggleAccordion}
      >
        Methods and Data Source
        <span className="accordion-icon">{isOpen ? '−' : '+'}</span>
      </button>
      
      {isOpen && (
        <div className="accordion-content">
          <p>
            This tool ranks DFT codes based on the Δ-value (delta value), which measures the agreement of 
            the equation of state curve for selected elemental crystals.
            Lower delta values indicate better agreement with reference calculations and generally suggest better 
            accuracy for the given element.
          </p>
          
          <p>
            This tool is based on data from the <a href="https://doi.org/10.24435/materialscloud:s4-3h" target="_blank" rel="noopener noreferrer">
            ACWF paper</a>.
            We pick the average all-electron equation of state as the reference, and thus the two all-electron codes are always tied for ranks 1 and 2, if included.
            Where multiple crystal structures are considered (including oxides), we use the average delta value 
            across those structures.
          </p>
          
          <p>
            All calculations were performed with the PBE functional, so these results reflect the accuracy of the implementation
            and the basis sets/pseudopotentials rather than of the underlying theory.
          </p>
        </div>
      )}
    </div>
  );
};

export default MethodsAccordion;
