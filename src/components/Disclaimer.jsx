import React from 'react';
import { Paper, Typography, Box, Link, List, ListItem } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';

const Disclaimer = () => {
  return (
    <Paper elevation={1} sx={{ p: 2, mt: 3, bgcolor: '#f8f9fa', borderLeft: '4px solid #f39c12' }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
        <WarningIcon color="warning" sx={{ mt: 0.5 }} />
        <Box>
          <Typography variant="h6" component="h3" gutterBottom>
            Disclaimer
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            This comparison is limited in several ways:
          </Typography>
          
          <List dense sx={{ pl: 2 }}>
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
              <Typography variant="body2">
                It is based on elemental (and oxide) crystals, most of which are "artificial". 
                The interactions between different elements may not always follow the same trend.
              </Typography>
            </ListItem>
            
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
              <Typography variant="body2">
                It is based on the PBE density functional. Accuracy with other functionals may differ.
              </Typography>
            </ListItem>
            
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
              <Typography variant="body2">
                It reflects the accuracy of the <em>implementation, basis sets and pseudopotentials</em>, 
                not the accuracy of the underlying theory.
              </Typography>
            </ListItem>
            
            <ListItem sx={{ display: 'list-item', listStyleType: 'disc' }}>
              <Typography variant="body2">
                It leaves aside the computational cost required to achieve this accuracy with the given code. 
                For settings, see the{' '}
                <Link 
                  href="https://doi.org/10.1038/s42254-023-00655-3" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  ACWF paper
                </Link>.
              </Typography>
            </ListItem>
          </List>
          
        </Box>
      </Box>
    </Paper>
  );
};

export default Disclaimer;
