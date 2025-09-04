import React from 'react';
import { Box, Container, Typography } from '@mui/material';

const InsightsPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Insights
        </Typography>
        <Typography variant="body1">
          This is the insights page. More content will be added soon.
        </Typography>
      </Box>
    </Container>
  );
};

export default InsightsPage;
