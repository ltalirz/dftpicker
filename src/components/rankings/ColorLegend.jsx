import React from 'react';
import { Box, Chip, Tooltip } from '@mui/material';

/**
 * A single color indicator for the legend with Material UI
 */
const ColorIndicator = ({ categoryName, className, description }) => (
  <Tooltip title={description} arrow placement="top">
    <Chip
      label={categoryName}
      variant="outlined"
      className={className}
      sx={{ 
        '&.excellent': { borderColor: '#2e7d32', bgcolor: '#c8e6c9' },
        '&.good': { borderColor: '#558b2f', bgcolor: '#dcedc8' },
        '&.fair': { borderColor: '#f9a825', bgcolor: '#fff9c4' },
        '&.poor': { borderColor: '#d84315', bgcolor: '#ffccbc' },
      }}
    />
  </Tooltip>
);

/**
 * Color legend component for delta categories using Material UI
 * @returns {JSX.Element} - Color legend component
 */
const ColorLegend = () => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1.5, 
        justifyContent: 'flex-end',
        mb: 2
      }}
    >
      <ColorIndicator 
        categoryName="Excellent" 
        className="excellent" 
        description="Δ < 0.3 meV/atom: Highly accurate methods for the given elements"
      />
      <ColorIndicator 
        categoryName="Good" 
        className="good" 
        description="0.3 ≤ Δ < 1 meV/atom: Reliable methods with good accuracy"
      />
      <ColorIndicator 
        categoryName="Fair" 
        className="fair" 
        description="1 ≤ Δ < 2 meV/atom: Acceptable accuracy for most applications"
      />
      <ColorIndicator 
        categoryName="Poor" 
        className="poor" 
        description="Δ ≥ 2 meV/atom: Lower accuracy, use with caution"
      />
    </Box>
  );
};

export default ColorLegend;
