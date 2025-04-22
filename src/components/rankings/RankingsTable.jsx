import React from 'react';
import { parseCodeIdentifier } from '../../utils/codeParser';
import { CostIcon, SourceIcon, CitationLink } from './CodeInfoIcons';

/**
 * Format delta values for display
 * @param {number} delta - Delta value to format
 * @returns {string} - Formatted delta value
 */
const formatDelta = (delta) => {
  return delta.toFixed(2);
};

/**
 * Get CSS class for a category
 * @param {string} categoryName - Category name
 * @returns {string} - CSS class name
 */
const getCategoryClass = (categoryName) => {
  if (categoryName === "< 0.3 meV/atom") return "excellent";
  if (categoryName === "0.3 - 1 meV/atom") return "good";
  if (categoryName === "1 - 2 meV/atom") return "fair";
  if (categoryName === "≥ 2 meV/atom") return "poor";
  return "unknown";
};

/**
 * Individual method row component
 */
const MethodRow = ({ method, categoryName, index, categoryIndex, getCodeMetadata }) => {
  const { code, basis, pseudopotential } = parseCodeIdentifier(method.originalCode || method.code);
  const codeMetadata = getCodeMetadata(code);
  const rowClass = categoryName ? `category-${getCategoryClass(categoryName)}` : "category-incomplete";
  
  return (
    <tr key={`method-${categoryIndex}-${index}`} className={rowClass}>
      <td>
        {codeMetadata && codeMetadata.homepage ? (
          <a 
            href={codeMetadata.homepage} 
            target="_blank" 
            rel="noopener noreferrer"
            className="code-link"
            title={`Visit ${code} homepage`}
          >
            {code}
          </a>
        ) : (
          code
        )}
      </td>
      <td>{basis.display}</td>
      <td>{pseudopotential}</td>
      <td className={categoryName ? getCategoryClass(categoryName) : "incomplete"}>
        {method.avgDelta !== undefined ? formatDelta(method.avgDelta) : <span className="no-data">N/A</span>}
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
      <td className="icon-cell cost-cell">
        <CostIcon codeMetadata={codeMetadata} />
      </td>
      <td className="icon-cell source-cell">
        <SourceIcon codeMetadata={codeMetadata} />
      </td>
      <td className="citation-cell">
        <CitationLink code={code} />
      </td>
    </tr>
  );
};

/**
 * Component for incomplete method rows
 */
const IncompleteMethodRow = ({ method, index, getCodeMetadata, elements }) => {
  const { code, basis, pseudopotential } = parseCodeIdentifier(method.originalCode || method.code);
  const codeMetadata = getCodeMetadata(code);
  
  return (
    <tr key={`incomplete-${index}`} className="category-incomplete">
      <td>
        {codeMetadata && codeMetadata.homepage ? (
          <a 
            href={codeMetadata.homepage} 
            target="_blank" 
            rel="noopener noreferrer"
            className="code-link"
            title={`Visit ${code} homepage`}
          >
            {code}
          </a>
        ) : (
          code
        )}
      </td>
      <td>{basis.display}</td>
      <td>{pseudopotential}</td>
      <td className="incomplete">
        <span className="no-data">N/A</span>
      </td>
      <td>
        <ul className="delta-values-list">
          {elements.map(element => (
            <li key={element}>
              {element}: {method.deltaValues && method.deltaValues[element] !== undefined ? 
                formatDelta(method.deltaValues[element]) : 
                <span className="missing-value">N/A</span>}
            </li>
          ))}
        </ul>
      </td>
      <td className="icon-cell cost-cell">
        <CostIcon codeMetadata={codeMetadata} />
      </td>
      <td className="icon-cell source-cell">
        <SourceIcon codeMetadata={codeMetadata} />
      </td>
      <td className="citation-cell">
        <CitationLink code={code} />
      </td>
    </tr>
  );
};

/**
 * Main rankings table component
 */
const RankingsTable = ({ categories, categoryNames, incomplete, elements, getCodeMetadata }) => {
  return (
    <table className="rankings-table">
      <thead>
        <tr>
          <th>Code</th>
          <th>Basis Set</th>
          <th>Pseudopotential</th>
          <th>Average Δ (meV/atom)</th>
          <th>Δ per Element</th>
          <th>Cost</th>
          <th>Source</th>
          <th>Citation Trend</th>
        </tr>
      </thead>
      <tbody>
        {/* Complete data sections */}
        {categoryNames.map((categoryName, categoryIndex) => (
          <React.Fragment key={categoryName}>
            {categories[categoryName].map((method, index) => (
              <MethodRow 
                key={`method-${categoryName}-${index}`}
                method={method}
                categoryName={categoryName}
                index={index}
                categoryIndex={categoryIndex}
                getCodeMetadata={getCodeMetadata}
              />
            ))}
            {/* Add a spacer row except after the last category */}
            {categoryIndex < categoryNames.length - 1 && (
              <tr className="category-spacer">
                <td colSpan="8"></td>
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
                <td colSpan="8"></td>
              </tr>
            )}
            {/* Add a label for the incomplete section */}
            <tr className="category-label incomplete-label">
              <td colSpan="8">Codes with missing data for some elements</td>
            </tr>
            {incomplete.map((method, index) => (
              <IncompleteMethodRow 
                key={`incomplete-${index}`}
                method={method}
                index={index}
                getCodeMetadata={getCodeMetadata}
                elements={elements}
              />
            ))}
          </React.Fragment>
        )}
      </tbody>
    </table>
  );
};

export default RankingsTable;
