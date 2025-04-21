import React from 'react';
import './Disclaimer.css';

const Disclaimer = () => {
  return (
    <div className="disclaimer">
      <h3>⚠️ Disclaimer</h3>
      <p>This comparison is limited in several ways:</p>
      <ul>
        <li>It is based on elemental (and oxide) crystals, many of which are artificial, i.e.  (do not occur on nature).
            Nevertheless 
             The interactions between different elements may not always follow the same trend.</li>
        <li>It is based on elemental (and oxide) crystals only, many of which are artificial. The interactions between different elements may not always follow the same trend.</li>
        <li>It is based on the PBE density functional. Accuracy with other functionals may differ.</li>
        <li>It reflects the accuracy of the <i>implementation, basis sets and pseudopotentials</i>, not the accuracy of the underlying theory.</li>
        <li>It leaves aside the computational cost required to achieve this accuracy with the given code. For settings, see the <a href="https://doi.org/10.1038/s42254-023-00655-3" target="_blank" rel="noopener noreferrer">ACWF paper</a>.</li>
      </ul>
    </div>
  );
};

export default Disclaimer;
