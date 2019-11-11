import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import Request from '../../util/request';

const AppConfig: React.FC = () => {
  const loadData = async () => {
    const response: ServerResponse = await Request.get({ url: 'app-config/config' });
    console.log('TOOD', response);
  };

  loadData();

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App
        </Typography>
        App Config page
      </Box>
    </Container>
  );
};

export default AppConfig;
