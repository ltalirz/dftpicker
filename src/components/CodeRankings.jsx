import React from 'react';
import { getCitationTrendUrl } from '../utils/citationMapping';
import Disclaimer from './Disclaimer';
import './CodeRankings.css';

const CodeRankings = ({ rankings, elements, formula }) => {
  // If there are no rankings, don't render anything
  if (!rankings || rankings.length === 0) {
    return null;
  }

  // First sort by avgDelta (lowest first)
  const sortedRankings = [...rankings].sort((a, b) => a.avgDelta - b.avgDelta);
  
  // Separate complete datasets from those with missing elements
  const complete = [];
  const incomplete = [];
  
  sortedRankings.forEach(method => {
    // Check if method has data for all elements
    const hasMissingElements = elements.some(
      element => !method.deltaValues || method.deltaValues[element] === undefined
    );
    
    if (hasMissingElements) {
      incomplete.push(method);
    } else {
      complete.push(method);
    }
  });
  
  // Define categories with correct delta value ranges for complete data
  const categories = {
    "< 0.3 meV/atom": [],
    "0.3 - 1 meV/atom": [],
    "1 - 2 meV/atom": [],
    "≥ 2 meV/atom": []
  };
  
  // Group methods by category using the correct delta value ranges
  complete.forEach(method => {
    const delta = method.avgDelta;
    
    if (delta < 0.3) {
      categories["< 0.3 meV/atom"].push(method);
    } else if (delta < 1) {
      categories["0.3 - 1 meV/atom"].push(method);
    } else if (delta < 2) {
      categories["1 - 2 meV/atom"].push(method);
    } else {
      categories["≥ 2 meV/atom"].push(method);
    }
  });

  // Filter out empty categories
  const categoryNames = Object.keys(categories).filter(
    categoryName => categories[categoryName].length > 0
  );

  // Map category names to CSS classes
  const getCategoryClass = (categoryName) => {
    if (categoryName === "< 0.3 meV/atom") return "excellent";
    if (categoryName === "0.3 - 1 meV/atom") return "good";
    if (categoryName === "1 - 2 meV/atom") return "fair";
    if (categoryName === "≥ 2 meV/atom") return "poor";
    return "unknown";
  };

  // Helper function to format delta values
  const formatDelta = (delta) => {
    return delta.toFixed(2);
  };

  // Updated helper component for color indicator with tooltip
  const ColorIndicator = ({ categoryName, className, description }) => (
    <div className="color-indicator-wrapper" data-tooltip={description}>
      <span className={`color-indicator ${className}`}></span>
      <span className="color-indicator-text">{categoryName}</span>
    </div>
  );

  return (
    <div className="rankings-container">
      <h2>Results for {formula}</h2>
      
      {(categoryNames.length > 0 || incomplete.length > 0) ? (
        <>
          {/* Enhanced color legend with descriptions */}
          <div className="color-legend">
            <ColorIndicator 
              categoryName="Excellent" 
              className="excellent" 
              description="Δ < 0.3 meV/atom: Highly accurate methods for the given elements"
            />
            <ColorIndicator 
              categoryName="Good" 
              className="good" 
              description="0.3 ≤ Δ < 1 meV/atom: Reliable methods with good accuracy"
            />
            <ColorIndicator 
              categoryName="Fair" 
              className="fair" 
              description="1 ≤ Δ < 2 meV/atom: Acceptable accuracy for most applications"
            />
            <ColorIndicator 
              categoryName="Poor" 
              className="poor" 
              description="Δ ≥ 2 meV/atom: Lower accuracy, use with caution"
            />
          </div>
          
          <table className="rankings-table">
            <thead>
              <tr>
                <th>DFT Code</th>
                <th>Average Δ (meV/atom)</th>
                <th>Δ per Element</th>
                <th>Citation Trend</th>
              </tr>
            </thead>
            <tbody>
              {/* Complete data sections */}
              {categoryNames.map((categoryName, categoryIndex) => (
                <React.Fragment key={categoryName}>
                  {categories[categoryName].map((method, index) => (
                    <tr key={`complete-${categoryIndex}-${index}`} className={`category-${getCategoryClass(categoryName)}`}>
                      <td>{method.originalCode || method.code}</td>
                      <td className={getCategoryClass(categoryName)}>
                        {formatDelta(method.avgDelta)}
                      </td>
                      <td>
                        <ul className="delta-values-list">
                          {Object.entries(method.deltaValues || {}).map(([element, value]) => (
                            <li key={element}>
                              {element}: {formatDelta(value)}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="citation-cell">
                        {getCitationTrendUrl(method.code.split('@')[0]) ? (
                          <a
                            href={getCitationTrendUrl(method.code.split('@')[0])}
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
                  {/* Add a spacer row except after the last category */}
                  {categoryIndex < categoryNames.length - 1 && (
                    <tr className="category-spacer">
                      <td colSpan="4"></td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              
              {/* Incomplete data section */}
              {incomplete.length > 0 && (
                <React.Fragment>
                  {/* Add a spacer row before incomplete section if there was complete data */}
                  {categoryNames.length > 0 && (
                    <tr className="category-spacer">
                      <td colSpan="4"></td>
                    </tr>
                  )}
                  {/* Add a label for t incomplete section */}
                  <tr className="category-label incomplete-label">
                    <td colSpan="4">Codes with missing data for some elements</td>
                  </tr>
                  {incomplete.map((method, index) => (
                    <tr key={`incomplete-${index}`} className="category-incomplete">
                      <td>{method.originalCode || method.code}</td>
                      <td className="incomplete">
                        {/* Don't show average delta for incomplete data */}
                        <span className="no-data">N/A</span>
                      </td>
                      <td>
                        <ul className="delta-values-list">
                          {/* Display all elements, including those with missing values */}
                          {elements.map(element => (
                            <li key={element}>
                              {element}: {method.deltaValues && method.deltaValues[element] !== undefined ? 
                                formatDelta(method.deltaValues[element]) : 
                                <span className="missing-value">N/A</span>}
                            </li>
                          ))}
                        </ul>
                      </td>
                      <td className="citation-cell">
                        {getCitationTrendUrl(method.code.split('@')[0]) ? (
                          <a
                            href={getCitationTrendUrl(method.code.split('@')[0])}
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
                </React.Fragment>
              )}
            </tbody>
          </table>
        </>
      ) : (
        <div className="no-data-message">
          <p>No methods found for these elements. Try another formula or include all-electron codes.</p>
        </div>
      )}
      <Disclaimer />
    </div>
  );
};

export default CodeRankings;
