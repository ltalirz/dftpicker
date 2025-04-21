import { useState } from 'react';
import FormulaInput from './components/FormulaInput.jsx';
import CodeRankings from './components/CodeRankings.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import { parseFormula, getElementsArray } from './utils/formulaParser.js';
import { rankMethodsForElements } from './services/deltaService.js';
import './App.css';

function App() {
  const [rankings, setRankings] = useState([]);
  const [elements, setElements] = useState([]);

  const handleFormulaSubmit = (formula) => {
    // Parse the formula to get elements
    const parsedFormula = parseFormula(formula);
    const elementArray = getElementsArray(parsedFormula);
    
    // Check if any elements were found
    if (elementArray.length === 0) {
      alert('No valid elements found in the formula. Please check and try again.');
      return;
    }
    
    // Get rankings for these elements
    const rankedMethods = rankMethodsForElements(elementArray);
    
    // Update state
    setElements(elementArray);
    setRankings(rankedMethods);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>DFT Code Picker</h1>
        <p>Find the most accurate DFT code for your chemical system (meV/atom)</p>
      </header>
      
      <main>
        <FormulaInput onSubmit={handleFormulaSubmit} />
        <ErrorBoundary>
          <CodeRankings rankings={rankings} elements={elements} />
        </ErrorBoundary>
      </main>
      
      <footer className="footer">
        <p>
          Based on the Δ-DFT benchmark for solid-state calculations. 
          <a href="https://doi.org/10.24435/materialscloud:s4-3h" target="_blank" rel="noopener noreferrer">Learn more</a>
        </p>
      </footer>
    </div>
  );
}

export default App;
