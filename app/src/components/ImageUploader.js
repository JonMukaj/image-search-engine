import React, { useState } from 'react';
import weaviate from 'weaviate-client';
import {
  Button,
  Container,
  Grid,
  Typography,
  Input,
  Chip,
} from '@mui/material';
import styled from '@emotion/styled';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const StyledContainer = styled(Container)({
  marginTop: 20,
});

const ImageUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const onFileChange = (event) => {
    setSelectedFiles([...event.target.files]);
  };

  const onFileUpload = async () => {
    if (!selectedFiles.length) return;

    const fileReaders = selectedFiles.map((file) => {
      return new Promise((resolve) => {
        const fileReader = new FileReader();
        fileReader.onload = async (event) => {
          const b64 = event.target.result.split(',')[1];

          await client.data
            .creator()
            .withClassName('Project')
            .withProperties({
              image: b64,
              text: '',
            })
            .do();

          resolve();
        };

        fileReader.readAsDataURL(file);
      });
    });

    await Promise.all(fileReaders);
    // alert('All images have been processed and stored in Weaviate.');
    setUploadSuccess(true);
  };

  return (
    <StyledContainer>
      <Typography variant="h3" gutterBottom sx={{ color: '#ffffff' }}>
        Upload Images
      </Typography>
      <Grid container spacing={2} alignItems="center">
        <Grid item>
          <Input
            type="file"
            inputProps={{ multiple: true }}
            onChange={onFileChange}
            sx={{ display: 'none' }}
            id="contained-button-file"
          />
          <label htmlFor="contained-button-file">
            <Button variant="contained" color="secondary" component="span">
              Choose Files
            </Button>
          </label>
        </Grid>
        <Grid item>
          <Chip
            label={`${selectedFiles.length} files selected`}
            color="secondary"
            variant="outlined"
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#4caf50', // Red background color
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(76, 175, 80, 0.5)' },
              '&.Mui-disabled': {
                backgroundColor: 'rgba(76, 175, 80, 0.5)',
              },
            }}
            onClick={onFileUpload}
            disabled={!selectedFiles.length}
          >
            Upload
          </Button>
        </Grid>
        {uploadSuccess && (
          <Grid item>
            <Typography variant="body1" sx={{ color: '#4caf50' }}>
              Upload successful!
            </Typography>
          </Grid>
        )}
      </Grid>
    </StyledContainer>
  );
};

export default ImageUploader;
