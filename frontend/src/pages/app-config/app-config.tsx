import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

import { Grid } from '@material-ui/core';
import Request from '../../util/request';
import AppCard from './app-card';

const AppConfig: React.FC = () => {
  const objectList = (o: any): any => {
    const inactiveAppList: any[] = [];
    const activeAppList: any[] = [];

    Object.keys(o).forEach((key) => {
      if (o[key] !== null && typeof o[key] === 'object') {
        if (!o[key].active) {
          inactiveAppList.push(key);
        } else {
          activeAppList.push(key);
        }
      }
    });

    return { inactiveAppList, activeAppList };
  };

  const loadData = async () => {
    const response: ServerResponse = await Request.get({ url: 'app-config/config' });
    const { inactiveAppList, activeAppList } = objectList(response.data);
    console.log('TOOD', inactiveAppList, activeAppList);
  };

  loadData();

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create React App
        </Typography>
        <Grid container spacing={3}>
          <AppCard />
        </Grid>
      </Box>
    </Container>
  );
};

export default AppConfig;
