import React from 'react';
import './CodeRankings.css';

const CodeRankings = ({ rankings, elements }) => {
  if (!rankings || rankings.length === 0) {
    return null;
  }

  return (
    <div className="code-rankings-container">
      <h2>DFT Code Rankings for {elements.join(', ')}</h2>
      <p className="ranking-explanation">
        Codes are ranked by total delta value (lowest is best). Delta measures the accuracy 
        of the code compared to all-electron reference calculations.
      </p>
      
      <div className="rankings-table-container">
        <table className="rankings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>DFT Code</th>
              <th>Total Delta Value</th>
              <th>Delta Values per Element</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((code, index) => (
              <tr key={code.name} className={index === 0 ? 'top-ranked' : ''}>
                <td>{index + 1}</td>
                <td>{code.name}</td>
                <td>{code.totalDelta ? code.totalDelta.toFixed(2) : 'N/A'}</td>
                <td>
                  <ul className="delta-values-list">
                    {Object.entries(code.deltas || {}).map(([element, value]) => (
                      <li key={element}>
                        {element}: {value === null || value === undefined ? 'N/A' : value.toFixed(2)}
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
          A missing value (N/A) indicates no data is available for that element with that method.
        </p>
      </div>
    </div>
  );
};

export default CodeRankings;
