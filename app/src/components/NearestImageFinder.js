// NearestImageFinder.js
import React, { useState } from 'react';
import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const NearestImageFinder = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [resultImages, setResultImages] = useState([]);
  const [limit, setLimit] = useState(1);

  const onFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const onLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const findNearestImages = async () => {
    if (!selectedFile) return;

    const fileReader = new FileReader();
    fileReader.onload = async (event) => {
      const b64 = event.target.result.split(',')[1];

      const resImage = await client.graphql.get()
        .withClassName('Project')
        .withFields(['image'])
        .withNearImage({ image: b64 })
        .withLimit(limit)
        .do();

      if (resImage.data.Get.Project.length > 0) {
        const images = resImage.data.Get.Project.map((project) => `data:image/jpeg;base64,${project.image}`);
        setResultImages(images);
      } else {
        setResultImages([]);
        alert('No matching images found.');
      }
    };

    fileReader.readAsDataURL(selectedFile);
  };

  return (
    <div>
      <h3>Find Nearest Images</h3>
      <input type="file" onChange={onFileChange} />
      <label htmlFor="limit">Number of Images:</label>
      <input
        type="number"
        id="limit"
        name="limit"
        value={limit}
        onChange={onLimitChange}
        min="1"
      />
      <button onClick={findNearestImages}>Find</button>
      {resultImages.map((image, index) => (
        <img key={index} src={image} alt={`Nearest image ${index}`} />
      ))}
    </div>
  );
};

export default NearestImageFinder;