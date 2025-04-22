/**
 * Parse a code identifier string into its components
 * Format examples: 
 * - VASP@PW|GW-PAW54*
 * - BigDFT@DW|HGH-K(Valence)
 * - FLEUR@LAPW+LO
 * 
 * @param {string} identifier - The code identifier string to parse
 * @returns {object} - Object with code, basis, and pseudopotential components
 */
export function parseCodeIdentifier(identifier) {
  if (!identifier) {
    return { 
      code: 'Unknown', 
      basis: { raw: '', display: '' }, 
      pseudopotential: '' 
    };
  }

  // Split the identifier into parts
  let parts = identifier.split('|');
  let codeBasisPart = parts[0];
  let pseudopotential = parts.length > 1 ? parts[1] : '';
  
  // Split the code and basis
  let codeBasisSplit = codeBasisPart.split('@');
  let code = codeBasisSplit[0];
  let basisRaw = codeBasisSplit.length > 1 ? codeBasisSplit[1] : '';
  
  // Translate basis codes
  let basisDisplay = '';
  switch (basisRaw) {
    case 'PW':
      basisDisplay = 'Plane Waves';
      break;
    case 'DW':
      basisDisplay = 'Daubechies Wavelets';
      break;
    case 'LAPW':
    case 'LAPW+LO':
      basisDisplay = basisRaw; // Keep as is
      break;
    case '(L)APW+lo+LO':
      basisDisplay = basisRaw; // Keep as is
      break;
    case 'TZV2P':
      basisDisplay = 'Triple-Zeta Valence + 2 Polarization';
      break;
    case 'AtOrOptDiamond':
      basisDisplay = 'Atomic Orbital Optimized (Diamond)';
      break;
    default:
      basisDisplay = basisRaw;
  }
  
  return {
    code,
    basis: {
      raw: basisRaw,
      display: basisDisplay
    },
    pseudopotential
  };
}
