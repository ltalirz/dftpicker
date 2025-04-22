import React from 'react';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoneyOffIcon from '@mui/icons-material/MoneyOff';
import SchoolIcon from '@mui/icons-material/School';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import NoEncryptionIcon from '@mui/icons-material/NoEncryption';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import TooltipComponent from './TooltipComponent';
import { getCitationTrendUrl } from '../../utils/citationMapping';

/**
 * Component for displaying cost information icon
 * @param {Object} props - Component props
 * @param {Object} props.codeMetadata - Metadata about the code
 * @returns {JSX.Element} - Cost icon component
 */
export const CostIcon = ({ codeMetadata }) => {
  if (!codeMetadata || !codeMetadata.cost) {
    return <span className="no-data">-</span>;
  }
  
  const cost = codeMetadata.cost;
  
  if (cost.includes('commercial')) {
    return <TooltipComponent text="Commercial license required">
      <AttachMoneyIcon />
    </TooltipComponent>;
  } else if (cost.includes('free') && cost.includes('academia')) {
    return <TooltipComponent text="Free for academic use">
      <span className="icons-group">
        <MoneyOffIcon />
        <SchoolIcon />
      </span>
    </TooltipComponent>;
  } else if (cost.includes('free')) {
    return <TooltipComponent text="Free to use">
      <MoneyOffIcon />
    </TooltipComponent>;
  }
  
  return <span className="no-data">-</span>;
};

/**
 * Component for displaying source information icon
 * @param {Object} props - Component props
 * @param {Object} props.codeMetadata - Metadata about the code
 * @returns {JSX.Element} - Source icon component
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
    return <TooltipComponent text={tooltipText}>
      <LockOpenIcon />
    </TooltipComponent>;
  } else if (source.includes('closed')) {
    return <TooltipComponent text="Closed source">
      <LockIcon />
    </TooltipComponent>;
  } else if (source.includes('copyleft') || source.includes('permissive')) {
    const tooltipText = license 
      ? `Open source (${license})`
      : 'Open source';
    return <TooltipComponent text={tooltipText}>
      <NoEncryptionIcon />
    </TooltipComponent>;
  }
  
  return <span className="no-data">-</span>;
};

/**
 * Component for displaying citation trend link
 * @param {Object} props - Component props
 * @param {string} props.code - Code name
 * @returns {JSX.Element} - Citation trend link component
 */
export const CitationLink = ({ code }) => {
  const citationUrl = getCitationTrendUrl(code);
  
  if (!citationUrl) {
    return <span className="no-data">-</span>;
  }
  
  return (
    <a
      href={citationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="citation-link"
      title="View citation trend on atomistic.software"
    >
      <ShowChartIcon />
    </a>
  );
};
