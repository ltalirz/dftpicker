import React, { useState, useRef } from 'react';
import { extractFormulaFromFile } from '../utils/fileParser.js';
import './FormulaInput.css';

const FormulaInput = ({ onSubmit, initialIncludeAllElectron = false }) => {
  const [formula, setFormula] = useState('');
  const [error, setError] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [includeAllElectron, setIncludeAllElectron] = useState(initialIncludeAllElectron);
  const inputRef = useRef(null);

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
    onSubmit(formula, includeAllElectron);
  };

  const toggleAllElectron = () => {
    setIncludeAllElectron(!includeAllElectron);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    setError('');
    
    try {
      const files = e.dataTransfer.files;
      if (files.length === 0) return;
      
      // Only process the first file
      const file = files[0];
      
      // Check if it's an XYZ or CIF file
      const fileName = file.name.toLowerCase();
      if (!fileName.endsWith('.xyz') && !fileName.endsWith('.cif')) {
        setError('Unsupported file format. Please upload an XYZ or CIF file.');
        return;
      }
      
      setIsProcessing(true);
      
      // Read the file content
      const content = await readFileContent(file);
      
      // Extract the formula from the file
      const extractedFormula = extractFormulaFromFile(content, file.name);
      
      // Set the formula
      setFormula(extractedFormula);
      
      // Focus the input field
      inputRef.current.focus();
      
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Failed to process the file. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileInputChange = async (e) => {
    const files = e.target.files;
    if (files.length === 0) return;
    
    try {
      setError('');
      setIsProcessing(true);
      
      // Only process the first file
      const file = files[0];
      
      // Read the file content
      const content = await readFileContent(file);
      
      // Extract the formula from the file
      const extractedFormula = extractFormulaFromFile(content, file.name);
      
      // Set the formula
      setFormula(extractedFormula);
      
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error.message || 'Failed to process the file. Please try again.');
    } finally {
      setIsProcessing(false);
      // Reset the file input so the same file can be selected again
      e.target.value = '';
    }
  };

  // Helper function to read file content
  const readFileContent = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => resolve(event.target.result);
      reader.onerror = (error) => reject(error);
      reader.readAsText(file);
    });
  };

  const handleBrowseClick = () => {
    document.getElementById('file-input').click();
  };

  return (
    <div className="formula-input-container">
      <h2>Enter a Chemical Formula</h2>
      <p className="drag-drop-instruction">
        Or drag & drop an XYZ or CIF file to extract the formula
      </p>
      
      <form 
        onSubmit={handleSubmit}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`form-container ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
      >
        <div className="input-row">
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="e.g., Fe2O3, CaCO3, LiNiMnCoO2"
            className="formula-input"
            aria-label="Chemical formula"
            ref={inputRef}
          />
          <button type="submit" className="submit-button">
            Check DFT Codes
          </button>
        </div>
        
        <div className="options-row">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={includeAllElectron} 
              onChange={toggleAllElectron}
            />
            <span className="checkbox-text">Include all-electron codes (WIEN2k, FLEUR)</span>
            <div className="info-tooltip">
              <span className="info-icon">ⓘ</span>
              <span className="tooltip-text">
                All-electron codes generally offer high accuracy but have a steeper learning curve and higher computational cost.
              </span>
            </div>
          </label>
        </div>
        
        <input 
          type="file" 
          id="file-input" 
          className="hidden-file-input" 
          accept=".xyz,.cif" 
          onChange={handleFileInputChange}
        />
        
        {isDragging && (
          <div className="drop-overlay">
            <p>Drop your structure file here</p>
          </div>
        )}
        
        {isProcessing && (
          <div className="processing-overlay">
            <p>Processing file...</p>
          </div>
        )}
      </form>
      
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default FormulaInput;
