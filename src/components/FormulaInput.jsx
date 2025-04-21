import React, { useState } from 'react';
import './FormulaInput.css';

const FormulaInput = ({ onSubmit }) => {
  const [formula, setFormula] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Basic validation - check if the formula contains valid characters
    if (!/^[A-Za-z0-9()]*$/.test(formula)) {
      setError('Invalid characters in formula. Only use A-Z, a-z, 0-9, and parentheses.');
      return;
    }

    // Check if the formula is empty
    if (!formula.trim()) {
      setError('Please enter a chemical formula');
      return;
    }

    setError('');
    onSubmit(formula);
  };

  return (
    <div className="formula-input-container">
      <h2>Enter a Chemical Formula</h2>
      <p className="instruction">
        Example: Fe2O3, CaCO3, LiNiMnCoO2
      </p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="e.g., H2O"
          className="formula-input"
          aria-label="Chemical formula"
        />
        <button type="submit" className="submit-button">
          Rank DFT Codes
        </button>
      </form>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormulaInput;
