/**
 * Extract chemical formula from file contents
 * Supports XYZ and CIF formats
 * 
 * @param {string} fileContent - The content of the uploaded file
 * @param {string} fileName - The name of the file (to determine format)
 * @returns {string} The extracted chemical formula
 */
export function extractFormulaFromFile(fileContent, fileName) {
  // Determine file type based on extension
  const isXYZ = fileName.toLowerCase().endsWith('.xyz');
  const isCIF = fileName.toLowerCase().endsWith('.cif');
  
  if (isXYZ) {
    return extractFormulaFromXYZ(fileContent);
  } else if (isCIF) {
    return extractFormulaFromCIF(fileContent);
  } else {
    throw new Error('Unsupported file format. Please upload an XYZ or CIF file.');
  }
}

/**
 * Extract chemical formula from XYZ file content
 * 
 * @param {string} content - The content of the XYZ file
 * @returns {string} The extracted chemical formula
 */
function extractFormulaFromXYZ(content) {
  try {
    // Split the content by lines
    const lines = content.trim().split('\n');
    
    // First line in XYZ is the number of atoms
    const numAtoms = parseInt(lines[0].trim());
    
    if (isNaN(numAtoms) || numAtoms <= 0) {
      throw new Error('Invalid XYZ format: First line should be the number of atoms');
    }
    
    // Skip the comment line (second line)
    // Start parsing from the third line
    const elements = [];
    for (let i = 2; i < lines.length && elements.length < numAtoms; i++) {
      const line = lines[i].trim();
      if (line === '') continue;
      
      // XYZ format: Element X Y Z
      const parts = line.split(/\s+/);
      if (parts.length >= 4) {
        elements.push(parts[0]);
      }
    }
    
    return getFormulaFromElements(elements);
  } catch (error) {
    console.error('Error parsing XYZ file:', error);
    throw new Error('Failed to parse XYZ file. Please check the file format.');
  }
}

/**
 * Extract chemical formula from CIF file content
 * 
 * @param {string} content - The content of the CIF file
 * @returns {string} The extracted chemical formula
 */
function extractFormulaFromCIF(content) {
  try {
    // Try to extract the chemical formula directly from the CIF
    const formulaMatch = content.match(/_chemical_formula_sum\s+['"]?([\w\s]+)['"]?/);
    if (formulaMatch && formulaMatch[1]) {
      // Remove any quotes and extra whitespace
      return formulaMatch[1].replace(/['"]/g, '').trim();
    }
    
    // If chemical_formula_sum is not found, try to extract from the atom sites
    const lines = content.split('\n');
    const elements = [];
    
    // Find the atom site loop
    let inAtomSiteLoop = false;
    let typeIndex = -1;
    let symbolIndex = -1;
    let labelIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('loop_')) {
        inAtomSiteLoop = false;
      }
      
      if (line.startsWith('_atom_site_')) {
        inAtomSiteLoop = true;
        
        if (line.includes('_atom_site_type_symbol')) {
          typeIndex = line.split('_atom_site_type_symbol')[0].split('_').length - 1;
        } else if (line.includes('_atom_site_symbol')) {
          symbolIndex = line.split('_atom_site_symbol')[0].split('_').length - 1;
        } else if (line.includes('_atom_site_label')) {
          labelIndex = line.split('_atom_site_label')[0].split('_').length - 1;
        }
      } else if (inAtomSiteLoop && !line.startsWith('_') && line !== '') {
        const parts = line.split(/\s+/).filter(p => p !== '');
        
        if (parts.length > 0) {
          // Try to get the element from type_symbol, then symbol, then label
          let element = null;
          
          if (typeIndex >= 0 && typeIndex < parts.length) {
            element = parts[typeIndex];
          } else if (symbolIndex >= 0 && symbolIndex < parts.length) {
            element = parts[symbolIndex];
          } else if (labelIndex >= 0 && labelIndex < parts.length) {
            // Extract element from label (usually first 1-2 characters)
            const label = parts[labelIndex];
            element = label.match(/^([A-Z][a-z]?)/)?.[1];
          }
          
          if (element) {
            // Remove any numbers or non-alphabetic characters
            element = element.replace(/[^a-zA-Z]/g, '');
            // Only accept valid element symbols (1-2 characters, starting with uppercase)
            if (/^[A-Z][a-z]?$/.test(element)) {
              elements.push(element);
            }
          }
        }
      }
    }
    
    if (elements.length > 0) {
      return getFormulaFromElements(elements);
    }
    
    throw new Error('Could not extract chemical formula from CIF file');
  } catch (error) {
    console.error('Error parsing CIF file:', error);
    throw new Error('Failed to parse CIF file. Please check the file format.');
  }
}

/**
 * Convert an array of element symbols to a chemical formula
 * 
 * @param {Array} elements - Array of element symbols (e.g., ['H', 'H', 'O'])
 * @returns {string} Chemical formula (e.g., 'H2O')
 */
function getFormulaFromElements(elements) {
  if (!elements || elements.length === 0) {
    return '';
  }
  
  // Count occurrences of each element
  const counts = {};
  elements.forEach(element => {
    counts[element] = (counts[element] || 0) + 1;
  });
  
  // Sort elements alphabetically, with exception that C comes first, then H
  // This is common practice in organic chemistry (Hill system)
  const sortedElements = Object.keys(counts).sort((a, b) => {
    if (a === 'C' && b !== 'C') return -1;
    if (a !== 'C' && b === 'C') return 1;
    if (a === 'H' && b !== 'H' && b !== 'C') return -1;
    if (a !== 'H' && b === 'H' && a !== 'C') return 1;
    return a.localeCompare(b);
  });
  
  // Build the formula string
  let formula = '';
  sortedElements.forEach(element => {
    formula += element;
    if (counts[element] > 1) {
      formula += counts[element];
    }
  });
  
  return formula;
}
