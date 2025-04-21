import React from 'react';
import './CodeRankings.css';

const CodeRankings = ({ rankings, elements }) => {
  // Check if the user has submitted a formula yet
  const hasSubmittedFormula = elements && elements.length > 0;
  
  // If no formula submitted yet, return null (don't show anything)
  if (!hasSubmittedFormula) {
    return null;
  }
  
  // If a formula was submitted but no rankings were found
  if (!rankings || rankings.length === 0) {
    return (
      <div className="code-rankings-container">
        <h2>No matching DFT codes for {elements.join(', ')}</h2>
        <p className="ranking-explanation">
          No DFT codes were found that have delta values for all elements in your formula.
          Try a different chemical formula with more common elements, or enable all-electron codes.
        </p>
      </div>
    );
  }

  return (
    <div className="code-rankings-container">
      <h2>DFT Code Rankings for {elements.join(', ')}</h2>
      <p className="ranking-explanation">
        Codes are ranked by average delta value (lowest is best). Delta measures the accuracy 
        of the code compared to all-electron reference calculations in meV/atom.
        Only codes with delta values for all elements in your formula are shown.
      </p>
      
      <div className="rankings-table-container">
        <table className="rankings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>DFT Code</th>
              <th>Average Delta (meV/atom)</th>
              <th>Delta Values per Element</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((code, index) => (
              <tr key={code.name} className={index === 0 ? 'top-ranked' : ''}>
                <td>{index + 1}</td>
                <td>{code.name}</td>
                <td>{code.avgDelta.toFixed(2)}</td>
                <td>
                  <ul className="delta-values-list">
                    {Object.entries(code.deltas).map(([element, value]) => (
                      <li key={element}>
                        {element}: {value.toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="note">
        <p>
          <strong>Note:</strong> Lower delta values indicate better accuracy. 
          Values are reported in meV/atom.
        </p>
      </div>
    </div>
  );
};

export default CodeRankings;
