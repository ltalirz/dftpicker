import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Link, List, ListItem, Chip } from '@mui/material';
import { parseCodeIdentifier } from '../../utils/codeParser';
import { CostIcon, SourceIcon, CitationLink } from './CodeInfoIcons';

/**
 * Format delta values for display
 * @param {number} delta - Delta value to format
 * @returns {string} - Formatted delta value
 */
const formatDelta = (delta) => {
  return delta.toFixed(2);
};

/**
 * Get CSS class for a category
 * @param {string} categoryName - Category name
 * @returns {string} - CSS class name
 */
const getCategoryClass = (categoryName) => {
  if (categoryName === "< 0.3 meV/atom") return "excellent";
  if (categoryName === "0.3 - 1 meV/atom") return "good";
  if (categoryName === "1 - 2 meV/atom") return "fair";
  if (categoryName === "≥ 2 meV/atom") return "poor";
  return "unknown";
};

/**
 * Individual method row component
 */
const MethodRow = ({ method, categoryName, index, categoryIndex, getCodeMetadata }) => {
  const { code, basis, pseudopotential } = parseCodeIdentifier(method.originalCode || method.code);
  const codeMetadata = getCodeMetadata(code);
  const categoryClass = categoryName ? getCategoryClass(categoryName) : "incomplete";
  const rowClass = `category-${categoryClass}`;
  
  return (
    <TableRow key={`method-${categoryIndex}-${index}`} className={rowClass}>
      <TableCell>
        {codeMetadata && codeMetadata.homepage ? (
          <Link 
            href={codeMetadata.homepage} 
            target="_blank"
            rel="noopener noreferrer"
            className="code-link"
            underline="hover"
          >
            {code}
          </Link>
        ) : (
          code
        )}
      </TableCell>
      <TableCell>{basis.display}</TableCell>
      <TableCell>{pseudopotential}</TableCell>
      <TableCell className={categoryClass}>
        {method.avgDelta !== undefined ? formatDelta(method.avgDelta) : 
          <span className="no-data">N/A</span>}
      </TableCell>
      <TableCell>
        <List dense className="delta-values-list">
          {Object.entries(method.deltaValues || {}).map(([element, value]) => (
            <ListItem key={element} disableGutters sx={{ py: 0.25 }}>
              {element}: {formatDelta(value)}
            </ListItem>
          ))}
        </List>
      </TableCell>
      <TableCell className="icon-cell cost-cell">
        <CostIcon codeMetadata={codeMetadata} />
      </TableCell>
      <TableCell className="icon-cell source-cell">
        <SourceIcon codeMetadata={codeMetadata} />
      </TableCell>
      <TableCell className="citation-cell">
        <CitationLink code={code} />
      </TableCell>
    </TableRow>
  );
};

/**
 * Component for incomplete method rows
 */
const IncompleteMethodRow = ({ method, index, getCodeMetadata, elements }) => {
  const { code, basis, pseudopotential } = parseCodeIdentifier(method.originalCode || method.code);
  const codeMetadata = getCodeMetadata(code);
  
  return (
    <TableRow key={`incomplete-${index}`} className="category-incomplete">
      <TableCell>
        {codeMetadata && codeMetadata.homepage ? (
          <Link 
            href={codeMetadata.homepage} 
            target="_blank"
            rel="noopener noreferrer"
            className="code-link"
            underline="hover"
          >
            {code}
          </Link>
        ) : (
          code
        )}
      </TableCell>
      <TableCell>{basis.display}</TableCell>
      <TableCell>{pseudopotential}</TableCell>
      <TableCell className="incomplete">
        <span className="no-data">N/A</span>
      </TableCell>
      <TableCell>
        <List dense className="delta-values-list">
          {elements.map(element => (
            <ListItem key={element} disableGutters sx={{ py: 0.25 }}>
              {element}: {method.deltaValues && method.deltaValues[element] !== undefined ? 
                formatDelta(method.deltaValues[element]) : 
                <span className="missing-value">N/A</span>}
            </ListItem>
          ))}
        </List>
      </TableCell>
      <TableCell className="icon-cell cost-cell">
        <CostIcon codeMetadata={codeMetadata} />
      </TableCell>
      <TableCell className="icon-cell source-cell">
        <SourceIcon codeMetadata={codeMetadata} />
      </TableCell>
      <TableCell className="citation-cell">
        <CitationLink code={code} />
      </TableCell>
    </TableRow>
  );
};

/**
 * Main rankings table component
 */
const RankingsTable = ({ categories, categoryNames, incomplete, elements, getCodeMetadata }) => {
  return (
    <TableContainer>
      <Table className="rankings-table" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Code</TableCell>
            <TableCell>Basis Set</TableCell>
            <TableCell>Pseudopotential</TableCell>
            <TableCell>Average Δ (meV/atom)</TableCell>
            <TableCell>Δ per Element</TableCell>
            <TableCell>Cost</TableCell>
            <TableCell>Source</TableCell>
            <TableCell>Citation Trend</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* Complete data sections */}
          {categoryNames.map((categoryName, categoryIndex) => (
            <React.Fragment key={categoryName}>
              {categories[categoryName].map((method, index) => (
                <MethodRow 
                  key={`method-${categoryName}-${index}`}
                  method={method}
                  categoryName={categoryName}
                  index={index}
                  categoryIndex={categoryIndex}
                  getCodeMetadata={getCodeMetadata}
                />
              ))}
              {/* Add a spacer row except after the last category */}
              {categoryIndex < categoryNames.length - 1 && (
                <TableRow className="category-spacer">
                  <TableCell colSpan={8}></TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
          
          {/* Incomplete data section */}
          {incomplete.length > 0 && (
            <React.Fragment>
              {/* Add a spacer row before incomplete section if there was complete data */}
              {categoryNames.length > 0 && (
                <TableRow className="category-spacer">
                  <TableCell colSpan={8}></TableCell>
                </TableRow>
              )}
              {/* Add a label for the incomplete section */}
              <TableRow className="category-label incomplete-label">
                <TableCell colSpan={8}>Codes with missing data for some elements</TableCell>
              </TableRow>
              {incomplete.map((method, index) => (
                <IncompleteMethodRow 
                  key={`incomplete-${index}`}
                  method={method}
                  index={index}
                  getCodeMetadata={getCodeMetadata}
                  elements={elements}
                />
              ))}
            </React.Fragment>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RankingsTable;
