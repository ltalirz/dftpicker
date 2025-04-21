/**
 * Maps DFT code names from our data to atomistic.software identifiers
 */
const citationMapping = {
  'ABINIT@PW|PseudoDojo-v0.5': 'ABINIT',
  'BigDFT@DW|HGH-K(Valence)': 'BigDFT',
  'CP2K/Quickstep@TZV2P|GTH': 'CP2K',
  'FLEUR@LAPW+LO': 'FLEUR',
  'GPAW@PW|PAW-v0.9.20000': 'GPAW',
  'CASTEP@PW|C19MK2': 'CASTEP',
  'Quantum ESPRESSO@PW|SSSP-prec-v1.3': 'Quantum ESPRESSO',
  'SIESTA@AtOrOptDiamond|PseudoDojo-v0.4': 'SIESTA',
  'SIRIUS/CP2K@PW|SSSP-prec-v1.2': 'Quantum ESPRESSO',
  'VASP@PW|GW-PAW54*': 'VASP',
  'WIEN2k@(L)APW+lo+LO': 'WIEN2k'
};

/**
 * Get the citation trend URL for a DFT code
 * 
 * @param {string} codeName - The name of the DFT code
 * @returns {string|null} The URL to the citation trend, or null if not found
 */
export function getCitationTrendUrl(codeName) {
  const identifier = citationMapping[codeName];
  const encodedCodeName = encodeURIComponent(identifier);
  if (!identifier) {
    return null;
  }
  
  return `https://atomistic.software/#/charts/${encodedCodeName}`;
}

export default citationMapping;
