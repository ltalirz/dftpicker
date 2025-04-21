# DFT Code Picker

A web application to help researchers find the most accurate Density Functional Theory (DFT) code for their specific chemical system.

🔗 **Live demo**: [ltalirz.github.io/dftpicker](https://ltalirz.github.io/dftpicker)

## About

DFT Code Picker uses delta values from the "Verification of DFT Implementations" project to rank different DFT codes based on their accuracy for specific elements. The tool helps researchers make informed decisions about which DFT code to use for their calculations.

### Features

- Input a chemical formula or drag-and-drop structure files (XYZ, CIF)
- Get ranked list of DFT codes based on their accuracy for the elements in your system
- Toggle all-electron codes to compare with pseudopotential approaches
- View citation trends for each DFT code via integration with atomistic.software
- Compare delta values across different elements and methods

## Data Source

The accuracy rankings are based on the Δ-value (delta value), which measures the agreement of the equation of state curve for selected elemental crystals. Lower delta values indicate better agreement with reference calculations.

Data comes from the ["Verification of the precision of DFT implementations via AiiDA common workflows" (ACWF) paper](https://doi.org/10.24435/materialscloud:s4-3h). All calculations were performed with the PBE functional, so the results reflect the accuracy of the implementation and the basis sets/pseudopotentials rather than the underlying theory.

## Development

### Prerequisites

- Node.js (v16.x or higher)
- npm (v8.x or higher)

### Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/ltalirz/dftpicker.git
   cd dftpicker
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

4. Build for production:
   ```sh
   npm run build
   ```

### Project Structure

- `/src` - Application source code
  - `/components` - React components
  - `/services` - Service layer for data handling
  - `/utils` - Utility functions
  - `/data` - Data sources and processing scripts
- `/tests` - Test files
- `/public` - Static assets

## References

- E. Bosoni et al., How to verify the precision of density-functional-theory implementations via reproducible and universal workflows, Nat. Rev. Phys. 6, 45-58 (2024). https://doi.org/10.1038/s42254-023-00655-3
- Delta values based on the [Verification of DFT Implementations via AiiDA Common Workflows](https://doi.org/10.24435/materialscloud:s4-3h) data on the Materials Cloud Archive
- Citation trends from [atomistic.software](https://atomistic.software)
- Built with [React](https://reactjs.org) + [Vite](https://vitejs.dev)
