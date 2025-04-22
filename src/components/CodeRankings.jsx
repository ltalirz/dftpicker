import React from 'react';
import Disclaimer from './Disclaimer';
import codesData from '../data/codes.json';
import ColorLegend from './rankings/ColorLegend';
import RankingsTable from './rankings/RankingsTable';
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

  // Function to get code metadata from codes.json
  const getCodeMetadata = (codeName) => {
    // Clean up the code name to match keys in codes.json
    const cleanCodeName = codeName.split('/')[0];
    
    // Special case for SIRIUS/CP2K - use Quantum ESPRESSO's metadata for cost and source
    if (codeName === 'SIRIUS/CP2K') {
      return {
        ...codesData['Quantum ESPRESSO'],
        name: 'SIRIUS/CP2K',
        homepage: 'https://github.com/electronic-structure/SIRIUS'
      };
    }
    
    // Special case for BigDFT - ensure GPL-2.0 license is correct
    if (cleanCodeName === 'BigDFT') {
      return {
        ...codesData['BigDFT'],
        license: 'GPL-2.0',
        cost: 'free',
        source: 'copyleft',
        homepage: 'https://www.bigdft.org'
      };
    }
    
    return codesData[cleanCodeName] || null;
  };

  return (
    <div className="rankings-container">
      <h2>Results for {formula}</h2>
      
      {(categoryNames.length > 0 || incomplete.length > 0) ? (
        <>
          {/* Enhanced color legend with descriptions */}
          <ColorLegend />
          
          {/* Main rankings table */}
          <RankingsTable 
            categories={categories} 
            categoryNames={categoryNames} 
            incomplete={incomplete} 
            elements={elements} 
            getCodeMetadata={getCodeMetadata} 
          />
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
