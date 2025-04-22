import { useState } from 'react';
import FormulaInput from './components/FormulaInput.jsx';
import CodeRankings from './components/CodeRankings.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import MethodsAccordion from './components/MethodsAccordion.jsx';
import { parseFormula, getElementsArray } from './utils/formulaParser.js';
import { rankMethodsForElements } from './services/deltaService.js';
import './App.css';

function App() {
  const [rankings, setRankings] = useState([]);
  const [elements, setElements] = useState([]);
  const [formula, setFormula] = useState('');
  const [includeAllElectron, setIncludeAllElectron] = useState(false);

  const handleFormulaSubmit = (inputFormula, includeAllElectron) => {
    // Save the original formula
    setFormula(inputFormula);
    
    // Parse the formula to get elements
    const parsedFormula = parseFormula(inputFormula);
    const elementArray = getElementsArray(parsedFormula);
    
    // Check if any elements were found
    if (elementArray.length === 0) {
      alert('No valid elements found in the formula. Please check and try again.');
      return;
    }
    
    // Get rankings for these elements (apply the filter)
    const rankedMethods = rankMethodsForElements(elementArray, includeAllElectron);
    
    // Update state
    setElements(elementArray);
    setRankings(rankedMethods);
    setIncludeAllElectron(includeAllElectron);
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-content">
          <div className="logo-wrapper">
            <img src="/dftpicker/logo.svg" alt="DFT Code Picker Logo" className="logo" />
          </div>
          <div className="header-text">
            <h1>DFT Code Picker</h1>
            <p>Find accurate density functional theory codes for your chemical system</p>
          </div>
        </div>
      </header>
      
      <main>
        <FormulaInput 
          onSubmit={handleFormulaSubmit} 
          initialIncludeAllElectron={includeAllElectron}
        />
        <MethodsAccordion />
        <ErrorBoundary>
          <CodeRankings 
            rankings={rankings} 
            elements={elements}
            formula={formula}
          />
        </ErrorBoundary>
      </main>
      
      <footer className="footer">
        <p>
          Most of this website was written by GitHub Copilot (agent mode) with Claude 3.7 Sonnet.
          <a href="https://github.com/ltalirz/dftpicker" target="_blank" rel="noopener noreferrer">Source code</a>.
        </p>
      </footer>
    </div>
  );
}

export default App;
