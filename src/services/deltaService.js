import deltaData from '../data/delta_values.json';

// Define all-electron codes
const ALL_ELECTRON_CODES = [
  'WIEN2k@(L)APW+lo+LO',
  'FLEUR@LAPW+LO'
];

/**
 * Get all available DFT methods from the delta values data
 * 
 * @param {boolean} includeAllElectron Whether to include all-electron codes
 * @returns {Array} Array of method names
 */
export function getAllMethods(includeAllElectron = true) {
  const methods = new Set();
  
  // Loop through each element and collect all methods
  Object.values(deltaData.data).forEach(element => {
    Object.keys(element).forEach(method => {
      // Filter out all-electron codes if not requested
      if (includeAllElectron || !ALL_ELECTRON_CODES.includes(method)) {
        methods.add(method);
      }
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
 * @param {boolean} includeAllElectron Whether to include all-electron codes
 * @returns {Array} Ranked array of objects with method name and average delta
 */
export function rankMethodsForElements(elements, includeAllElectron = true) {
  if (!elements || elements.length === 0) {
    return [];
  }
  
  const methods = getAllMethods(includeAllElectron);
  const methodScores = [];
  
  // Calculate delta values for each method
  for (const method of methods) {
    // Skip all-electron codes if not requested
    if (!includeAllElectron && ALL_ELECTRON_CODES.includes(method)) {
      continue;
    }
    
    const deltas = {};
    let totalDelta = 0;
    let validDeltas = 0;
    let hasAllElements = true;
    
    // Check if the method has delta values for all elements
    for (const element of elements) {
      const elementDelta = getDeltaForElement(element);
      if (elementDelta && elementDelta[method] !== null && elementDelta[method] !== undefined) {
        deltas[element] = elementDelta[method];
        totalDelta += elementDelta[method];
        validDeltas++;
      } else {
        deltas[element] = null;
        hasAllElements = false; // Mark this method as missing at least one element
      }
    }
    
    // Only include methods that have delta values for ALL elements in the formula
    if (validDeltas > 0 && hasAllElements) {
      // Calculate average delta value (meV per atom)
      const avgDelta = totalDelta / validDeltas;
      
      methodScores.push({
        name: method,
        totalDelta: totalDelta,
        avgDelta: avgDelta,
        deltas,
        validDeltas, // This should equal elements.length for all included methods
        totalElements: elements.length // Total number of elements in the formula
      });
    }
  }
  
  // Sort by average delta (lowest first)
  return methodScores.sort((a, b) => a.avgDelta - b.avgDelta);
}

/**
 * Determine if a method is an all-electron code
 * 
 * @param {string} method The method name
 * @returns {boolean} True if it's an all-electron code
 */
export function isAllElectronCode(method) {
  return ALL_ELECTRON_CODES.includes(method);
}
