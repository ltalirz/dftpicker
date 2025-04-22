/**
 * Map DFT code names to their citation trend URLs on atomistic.software
 */
const citationMapping = {
  'VASP': 'https://atomistic.software/#/charts/VASP',
  'Quantum ESPRESSO': 'https://atomistic.software/#/charts/Quantum%20ESPRESSO',
  'CASTEP': 'https://atomistic.software/#/charts/CASTEP',
  'ABINIT': 'https://atomistic.software/#/charts/ABINIT',
  'CP2K': 'https://atomistic.software/#/charts/CP2K',
  'SIESTA': 'https://atomistic.software/#/charts/SIESTA',
  'GPAW': 'https://atomistic.software/#/charts/GPAW',
  'WIEN2k': 'https://atomistic.software/#/charts/WIEN2k',
  'FLEUR': 'https://atomistic.software/#/charts/FLEUR',
  'BigDFT': 'https://atomistic.software/#/charts/BigDFT',
  'SIRIUS': 'https://atomistic.software/#/charts/Quantum%20ESPRESSO'
};

/**
 * Get citation trend URL for a given code name
 * @param {string} code - Code name to look up
 * @returns {string|null} - URL to citation trend or null if not found
 */
export function getCitationTrendUrl(code) {
  if (!code) return null;
  
  // Clean the code name (remove anything after @ or |)
  const cleanCodeName = code.split('@')[0].split('|')[0].trim();
  
  // Try direct match first
  if (citationMapping[cleanCodeName]) {
    return citationMapping[cleanCodeName];
  }
  
  // Look for partial matches (for cases like 'SIRIUS/CP2K')
  const codeParts = cleanCodeName.split('/');
  for (const part of codeParts) {
    if (citationMapping[part]) {
      return citationMapping[part];
    }
  }
  
  return null;
}

export default citationMapping;
