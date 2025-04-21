import deltaData from '../data/delta_values.json';

/**
 * Get all available DFT methods from the delta values data
 * 
 * @returns {Array} Array of method names
 */
export function getAllMethods() {
  const methods = new Set();
  
  // Loop through each element and collect all methods
  Object.values(deltaData.data).forEach(element => {
    Object.keys(element).forEach(method => {
      methods.add(method);
    });
  });
  
  return Array.from(methods);
}

/**
 * Get delta values for a specific element
 * 
 * @param {string} element The chemical element symbol
 * @returns {Object|null} Object mapping methods to delta values, or null if element not found
 */
export function getDeltaForElement(element) {
  if (!element || !deltaData.data[element]) {
    return null;
  }
  
  return deltaData.data[element];
}

/**
 * Rank DFT methods based on delta values for the given elements
 * 
 * @param {Array} elements Array of element symbols
 * @returns {Array} Ranked array of objects with method name and total delta
 */
export function rankMethodsForElements(elements) {
  if (!elements || elements.length === 0) {
    return [];
  }
  
  const methods = getAllMethods();
  const methodScores = [];
  
  // Calculate total delta for each method
  for (const method of methods) {
    const deltas = {};
    let totalDelta = 0;
    let validDeltas = 0;
    
    // Sum delta values for all elements
    for (const element of elements) {
      const elementDelta = getDeltaForElement(element);
      if (elementDelta && elementDelta[method] !== null && elementDelta[method] !== undefined) {
        deltas[element] = elementDelta[method];
        totalDelta += elementDelta[method];
        validDeltas++;
      } else {
        deltas[element] = null;
      }
    }
    
    // Only include methods that have delta values for at least one element
    if (validDeltas > 0) {
      methodScores.push({
        name: method,
        totalDelta,
        deltas,
        validDeltas, // Track how many elements have valid data
        totalElements: elements.length // Total number of elements in the formula
      });
    }
  }
  
  // Sort by total delta (lowest first)
  return methodScores
    .sort((a, b) => {
      // Primary sort: most valid deltas (highest first)
      const validDeltasDiff = b.validDeltas - a.validDeltas;
      if (validDeltasDiff !== 0) return validDeltasDiff;
      
      // Secondary sort: lowest total delta
      return a.totalDelta - b.totalDelta;
    });
}
