import React, { useState } from "react";
import weaviate from "weaviate-client";
import {
  Button,
  Container,
  Grid,
  Typography,
  Input,
  TextField,
  Box,
} from "@mui/material";
import styled from "@emotion/styled";

const client = weaviate.client({
  scheme: "http",
  host: "localhost:8080",
});

const StyledContainer = styled(Container)({
  marginTop: 20,
  maxWidth: "80%",
});

const ImageContainer = styled(Box)({
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-around",
});

const NearestImageFinder = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImages, setResultImages] = useState([]);
  const [limit, setLimit] = useState(1);

  const [searchImageSrc, setSearchImageSrc] = useState(null);

  const onFileChoose = (event) => {
    setSelectedFile(event.target.files[0]);
    const fileReader = new FileReader();
    fileReader.onload = (event) => {
      setSearchImageSrc(event.target.result);
    };
    fileReader.readAsDataURL(event.target.files[0]);
  };

  const onLimitChange = (event) => {
    const inputValue = parseInt(event.target.value, 10);
    if (inputValue === 0) {
      setLimit(1);
    } else {
      setLimit(inputValue);
    }
    // setLimit(event.target.value);
  };

  const findNearestImages = async () => {
    if (!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const b64 = event.target.result.split(",")[1];

      const resImage = await client.graphql
        .get()
        .withClassName("Project")
        .withFields(["image"])
        .withNearImage({ image: b64 })
        .withLimit(limit)
        .do();
      if (resImage.data.Get.Project.length > 0) {
        const images = resImage.data.Get.Project.map(
          (project) => `data:image/jpeg;base64,${project.image}`
        );
        setResultImages(images);
      } else {
        setResultImages([]);
        alert("No matching images found.");
      }
    };

    fileReader.readAsDataURL(selectedFile);
  };
  return (
    <StyledContainer>
      <Typography variant="h3" gutterBottom sx={{ color: "#ffffff" }}>
        Find Nearest Images
      </Typography>
      <Grid container direction="column" spacing={2}>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Input
              type="file"
              onChange={onFileChoose}
              sx={{ display: "none" }}
              id="search-img"
            />
            <label htmlFor="search-img">
              <Button variant="contained" color="secondary" component="span">
                Select File
              </Button>
            </label>
          </Grid>
          <Grid item>
            {selectedFile && (
              <img
                src={searchImageSrc}
                alt="Search image"
                height="150"
                width="150"
              />
            )}
          </Grid>
          <Grid item>
            <TextField
              label="Number of Images"
              type="number"
              value={limit}
              onChange={onLimitChange}
              InputProps={{ inputProps: { min: 1 } }}
              variant="outlined"
              size="small"
              sx={{
                width: "80px",
                "& label": { color: "#ffffff" },
                "& fieldset": { borderColor: "#ffffff" },
                "& input": { color: "#ffffff" },
              }}
            />
          </Grid>
          <Grid item>
            <Button
              variant="contained"
              color="success"
              onClick={findNearestImages}
            >
              Find
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} alignItems="flex-start">
        <Grid item xs={12}>
          <ImageContainer mt={4}>
            {resultImages.map((image, index) => (
              <Box key={index} m={1}>
                <img
                  src={image}
                  alt={`Nearest image ${index}`}
                  height="300"
                  width="300"
                />
              </Box>
            ))}
          </ImageContainer>
        </Grid>
      </Grid>
    </StyledContainer>
  );
};

export default NearestImageFinder;
