/**
 * Map DFT code names to their citation trend URLs on atomistic.software
 */
const citationMapping = {
  'VASP': 'https://atomistic.software/plot/cite/VASP',
  'Quantum ESPRESSO': 'https://atomistic.software/plot/cite/Quantum+ESPRESSO',
  'CASTEP': 'https://atomistic.software/plot/cite/CASTEP',
  'ABINIT': 'https://atomistic.software/plot/cite/ABINIT',
  'CP2K': 'https://atomistic.software/plot/cite/CP2K',
  'SIESTA': 'https://atomistic.software/plot/cite/SIESTA',
  'GPAW': 'https://atomistic.software/plot/cite/GPAW',
  'WIEN2k': 'https://atomistic.software/plot/cite/WIEN2k',
  'FLEUR': 'https://atomistic.software/plot/cite/FLEUR',
  'BigDFT': 'https://atomistic.software/plot/cite/BigDFT',
  'SIRIUS': 'https://atomistic.software/plot/cite/SIRIUS'
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
