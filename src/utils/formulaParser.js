/**
 * Parse a chemical formula and return an object with elements and their counts
 * 
 * @param {string} formula - The chemical formula to parse (e.g., "Fe2O3", "CaCO3")
 * @returns {Object} - An object mapping element symbols to their counts
 */
export function parseFormula(formula) {
  if (!formula) return {};
  
  // Match element symbols (starts with uppercase letter, optionally followed by lowercase)
  // followed by an optional number
  const elementRegex = /([A-Z][a-z]*)(\d*)/g;
  const elements = {};
  let match;
  
  // Find all matches in the formula
  while ((match = elementRegex.exec(formula)) !== null) {
    const element = match[1];
    // If no number is specified, the count is 1
    const count = match[2] ? parseInt(match[2], 10) : 1;
    
    // Add to existing count or set a new count
    if (elements[element]) {
      elements[element] += count;
    } else {
      elements[element] = count;
    }
  }
  
  return elements;
}

/**
 * Get an array of unique elements from a parsed formula
 * 
 * @param {Object} parsedFormula - The parsed formula object
 * @returns {Array} - Array of element symbols
 */
export function getElementsArray(parsedFormula) {
  return Object.keys(parsedFormula);
}
