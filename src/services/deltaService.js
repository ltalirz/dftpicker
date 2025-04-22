import deltaValues from '../data/delta_values.json';

/**
 * Ranks DFT methods based on their accuracy for a given set of elements
 * 
 * @param {Array} elements - List of elements to consider
 * @param {Boolean} includeAllElectron - Whether to include all-electron methods
 * @returns {Array} - Sorted array of methods with their delta values
 */
export function rankMethodsForElements(elements, includeAllElectron = false) {
  // Get the delta values for specific elements
  const relevantDeltas = {};
  
  // Extract relevant delta values for our elements
  elements.forEach(element => {
    if (deltaValues.data[element]) {
      Object.entries(deltaValues.data[element]).forEach(([methodName, value]) => {
        if (!relevantDeltas[methodName]) {
          relevantDeltas[methodName] = {
            values: [],
            elementValues: {}
          };
        }
        relevantDeltas[methodName].values.push(value);
        relevantDeltas[methodName].elementValues[element] = value;
      });
    }
  });
  
  // Calculate average delta for each method
  const methodScores = [];
  
  Object.entries(relevantDeltas).forEach(([methodName, data]) => {
    // Skip all-electron methods if the flag is not set
    if (!includeAllElectron && 
        (methodName.includes('LAPW') || 
         methodName.includes('(L)APW') || 
         methodName.includes('WIEN'))) {
      return;
    }
    
    // For delta, lower is better
    const avgDelta = data.values.reduce((sum, val) => sum + val, 0) / data.values.length;
    
    methodScores.push({
      code: methodName, // Use the full method name as code
      originalCode: methodName, // Keep the original method name from delta_values.json
      avgDelta,
      deltaValues: data.elementValues
    });
  });
  
  // Sort methods by avgDelta (ascending, so lower/better values first)
  return methodScores.sort((a, b) => a.avgDelta - b.avgDelta);
}
