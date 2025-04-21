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
            This tool ranks DFT codes based on the <a href="https://molmod.ugent.be/deltacodesdft" target="_blank">Δ-value</a> (delta value), which measures their agreement on 
            the equation of state curve for selected elemental crystals.
            Here, lower delta values indicate better agreement with reference calculations and generally suggest better 
            accuracy for the given element.
          </p>
          
          <p>
            This tool is based on <a href="https://doi.org/10.24435/materialscloud:s4-3h" target="_blank" rel="noopener noreferrer">
            data from the "Verification of the precision of DFT implementations via AiiDA common workflows" (ACWF) paper</a> (see also <a href="https://github.com/materialscloud-org/acwf-verification">GitHub</a>).
            We pick the average all-electron equation of state as the reference (therefore, the two all-electron codes are always tied for ranks 1 and 2, if included).
            For elements where multiple crystal structures are considered (including their oxides), we use the average delta value 
            across those structures.
          </p>
          
          <p>
            All calculations were performed with the PBE functional, so these results reflect the accuracy of the implementation
            and the basis sets/pseudopotentials rather than of the underlying theory.
          </p>

          <p>
            Citation trends (<span className="trend-icon">📈</span>) are provided by 
            <a href="https://atomistic.software" target="_blank" rel="noopener noreferrer"> atomistic.software</a>.
          </p>
        </div>
      )}
    </div>
  );
};

export default MethodsAccordion;
