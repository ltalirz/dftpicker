import { extractFormulaFromFile } from '../../src/utils/fileParser';
import fs from 'fs';
import path from 'path';

// Helper to read test fixture files
const readFixture = (filename) => {
  const fixturePath = path.join(__dirname, '../fixtures', filename);
  return fs.readFileSync(fixturePath, 'utf-8');
};

describe('fileParser utility', () => {
  describe('extractFormulaFromFile', () => {
    test('correctly extracts formula from XYZ file', () => {
      const xyzContent = readFixture('WO3-cubic.xyz');
      const formula = extractFormulaFromFile(xyzContent, 'sample.xyz');
      
      // The expected formula will depend on your actual XYZ file content
      // Update this assertion based on the correct expected formula
      expect(formula).toBe('O3W');
    });

    test('correctly extracts formula from CIF file', () => {
      const cifContent = readFixture('05001N2.cif');
      const formula = extractFormulaFromFile(cifContent, 'sample.cif');
      
      // The expected formula will depend on your actual CIF file content
      // Update this assertion based on the correct expected formula
      expect(formula).toBe('C108H48B12O24');
    });

    test('throws error for unsupported file format', () => {
      expect(() => {
        extractFormulaFromFile('content', 'file.txt');
      }).toThrow('Unsupported file format');
    });

    test('handles malformed XYZ file gracefully', () => {
      expect(() => {
        extractFormulaFromFile('invalid content', 'file.xyz');
      }).toThrow('Failed to parse XYZ file');
    });

    test('handles malformed CIF file gracefully', () => {
      expect(() => {
        extractFormulaFromFile('invalid content', 'file.cif');
      }).toThrow('Failed to parse CIF file');
    });
  });
});
