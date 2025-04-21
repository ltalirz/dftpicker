import React from 'react';
import { getCitationTrendUrl } from '../utils/citationMapping';
import Disclaimer from './Disclaimer';
import './CodeRankings.css';

// Function to calculate background color based on delta value
const getDeltaColor = (delta) => {
  if (delta <= 0.3) {
    // Green for excellent accuracy (0-0.3)
    return `rgba(0, 200, 0, 0.2 )`;
  } else if (delta <= 1) {
    // Light green to yellow transition (0.3-1)
    const ratio = (delta - 0.3) / 0.7;
    return `rgba(${Math.floor(ratio * 255)}, 200, 0, 0.2)`;
  } else if (delta <= 2) {
    // Yellow to orange/red transition (1-2)
    const ratio = (delta - 1) / 1;
    return `rgba(255, ${Math.floor(200 - ratio * 160)}, 0, 0.2)`;
  } else {
    // Red for poor accuracy (>2)
    return `rgba(255, 40, 0, 0.3)`;
  }
};

const CodeRankings = ({ rankings, elements, formula }) => {
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
        <h2>No matching DFT codes for {formula || elements.join(', ')}</h2>
        <p className="ranking-explanation">
          No DFT codes were found that have delta values for all elements in your formula.
          Try a different chemical formula with more common elements, or enable all-electron codes.
        </p>
      </div>
    );
  }

  return (
    <div className="code-rankings-container">
      <h2>DFT Code Rankings for {formula || elements.join(', ')}</h2>

      <div className="rankings-table-container">
        <table className="rankings-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>DFT Code</th>
              <th>Average Delta (meV/atom)</th>
              <th>Delta Values per Element</th>
              <th>Citation Trend</th>
            </tr>
          </thead>
          <tbody>
            {rankings.map((code, index) => (
              <tr
                key={code.name}
                className={index === 0 ? 'top-ranked' : ''}
                style={{ backgroundColor: getDeltaColor(code.avgDelta) }}
              >
                <td>{index + 1}</td>
                <td>{code.name}</td>
                <td>{code.avgDelta.toFixed(1)}</td>
                <td>
                  <ul className="delta-values-list">
                    {Object.entries(code.deltas).map(([element, value]) => (
                      <li key={element}>
                        {element}: {value.toFixed(1)}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  {getCitationTrendUrl(code.name) ? (
                    <a
                      href={getCitationTrendUrl(code.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="citation-link"
                      title="View citation trend on atomistic.software"
                    >
                      <span className="trend-icon">📈</span>
                    </a>
                  ) : (
                    <span className="no-citation-data">-</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="note">
        <p>
          <strong>Note:</strong> Lower delta values indicate better agreement with all-electron calculations (
            <span style={{ backgroundColor: 'rgba(0, 200, 0, 0.2)', padding: '2px 8px', marginRight: '5px', borderRadius: '2px' }}>Excellent (0-0.3)</span>
            <span style={{ backgroundColor: 'rgba(128, 200, 0, 0.2)', padding: '2px 8px', marginRight: '5px', borderRadius: '2px' }}>Good (0.3-1)</span>
            <span style={{ backgroundColor: 'rgba(255, 120, 0, 0.2)', padding: '2px 8px', marginRight: '5px', borderRadius: '2px' }}>Fair (1-2)</span>
            <span style={{ backgroundColor: 'rgba(255, 40, 0, 0.2)', padding: '2px 8px', marginRight: '5px', borderRadius: '2px' }}>Poor (>2)</span>
          ).
          Only codes with delta values for all elements in your formula are shown.
        </p>
      </div>

      <Disclaimer />
    </div>
  );
};

export default CodeRankings;
