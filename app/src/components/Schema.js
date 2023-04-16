import React, { useState } from 'react';
import weaviate from 'weaviate-client';
import { Button, Container, Grid, Typography } from '@mui/material';
import styled from '@emotion/styled';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const StyledContainer = styled(Container)({
  marginTop: 20,
});

const Schema = () => {
  const className = 'Project';
  const [isCreateDisabled, setIsCreateDisabled] = useState(false);

  const createClass = async () => {
    setIsCreateDisabled(true);
    const schemaConfig = {
      class: className,
      vectorizer: 'img2vec-neural',
      vectorIndexType: 'hnsw',
      moduleConfig: {
        'img2vec-neural': {
          imageFields: ['image'],
        },
      },
      properties: [
        {
          name: 'image',
          dataType: ['blob'],
        },
        {
          name: 'text',
          dataType: ['string'],
        },
      ],
    };

    try {
      await client.schema.classCreator().withClass(schemaConfig).do();
      alert(`Class '${className}' successfully created!`);
    } catch (err) {
      alert(`Error creating class '${className}': ${err.message}`);
      setIsCreateDisabled(true);
    }
  };

  const deleteClass = async () => {
    setIsCreateDisabled(false);
    try {
      await client.schema.classDeleter().withClassName(className).do();
      alert(`Class '${className}' successfully deleted!`);
    } catch (err) {
      alert(`Class '${className}' does not exist!`);
      setIsCreateDisabled(false);
    }
  };

  return (
    <StyledContainer>
      <Typography variant="h3" gutterBottom sx={{ color: '#ffffff' }}>
        Manage Schema
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#9c27b0', // Red background color
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(156, 39, 176, 0.5)' },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(156, 39, 176, 0.5)',
              },
            }}
            onClick={createClass}
            disabled={isCreateDisabled}
          >
            Create Schema
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f44336',
              color: 'white',
              '&:hover': { backgroundColor: '#d32f2f' },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(244, 67, 54, 0.5)',
              },
            }}
            onClick={deleteClass}
            disabled={!isCreateDisabled}
          >
            Delete Schema
          </Button>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default Schema;
