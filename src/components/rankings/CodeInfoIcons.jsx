import React from 'react';
import { Tooltip, Box } from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { getCitationTrendUrl } from '../../utils/citationMapping';

/**
 * Component for displaying cost information icon with Material UI tooltip
 */
export const CostIcon = ({ codeMetadata }) => {
  if (!codeMetadata || !codeMetadata.cost) {
    return <span className="no-data">-</span>;
  }
  
  const cost = codeMetadata.cost;
  
  if (cost.includes('commercial')) {
    return (
      <Tooltip title="Commercial license required" arrow>
        <AttachMoneyIcon />
      </Tooltip>
    );
  } else if (cost.includes('free') && cost.includes('academia')) {
    return (
      <Tooltip title="Free for academic use" arrow>
        <Box sx={{ display: 'inline-flex', gap: 0.5 }}>
          <MoneyOffIcon />
          <SchoolIcon />
        </Box>
      </Tooltip>
    );
  } else if (cost.includes('free')) {
    return (
      <Tooltip title="Free to use" arrow>
        <MoneyOffIcon />
      </Tooltip>
    );
  }
  
  return <span className="no-data">-</span>;
};

/**
 * Component for displaying source information icon with Material UI tooltip
 */
export const SourceIcon = ({ codeMetadata }) => {
  if (!codeMetadata || !codeMetadata.source) {
    return <span className="no-data">-</span>;
  }
  
  const source = codeMetadata.source;
  const license = codeMetadata.license;
  
  if (source.includes('available')) {
    const tooltipText = license 
      ? `Source available with restrictions (${license})`
      : 'Source available with restrictions';
    return (
      <Tooltip title={tooltipText} arrow>
        <LockOpenIcon />
      </Tooltip>
    );
  } else if (source.includes('closed')) {
    return (
      <Tooltip title="Closed source" arrow>
        <LockIcon />
      </Tooltip>
    );
  } else if (source.includes('copyleft') || source.includes('permissive')) {
    const tooltipText = license 
      ? `Open source (${license})`
      : 'Open source';
    return (
      <Tooltip title={tooltipText} arrow>
        <NoEncryptionIcon />
      </Tooltip>
    );
  }
  
  return <span className="no-data">-</span>;
};

/**
 * Component for displaying citation trend link
 */
export const CitationLink = ({ code }) => {
  const citationUrl = getCitationTrendUrl(code);
  
  if (!citationUrl) {
    return <span className="no-data">-</span>;
  }
  
  return (
    <Tooltip title="View citation trend on atomistic.software" arrow>
      <a
        href={citationUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="citation-link"
      >
        <ShowChartIcon />
      </a>
    </Tooltip>
  );
};
