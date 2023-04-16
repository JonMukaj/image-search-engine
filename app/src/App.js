import React from 'react';
import ImageUploader from './components/ImageUploader.js';
import NearestImageFinder from './components/NearestImageFinder.js';
import Schema from './components/Schema.js';
import { Grid } from '@mui/material';
import styled  from '@emotion/styled';

const StyledBackground = styled.div({
  background: '#0c1428',
  minHeight: '100vh',
  paddingTop: '20px',
});

const App = () => {
  return (
    <StyledBackground>
      <Grid container justifyContent="center" alignItems="center" spacing={4}>
        <Grid item xs={12} sm={6}>
          <Schema />
        </Grid>
        <Grid item xs={12} sm={6}>
          <ImageUploader />
        </Grid>
      </Grid>
      <hr />
      <Grid container justifyContent="center">
        <Grid item>
          <NearestImageFinder />
        </Grid>
      </Grid>
    </StyledBackground>
  );
};

export default App;