// ImageUploader.js
import React, { useState } from 'react';
import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const ImageUploader = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);

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

          await client.data.creator()
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
    alert('All images have been processed and stored in Weaviate.');
  };

  return (
    <div>
      <h3>Upload Images</h3>
      <input type="file" multiple onChange={onFileChange} />
      <button onClick={onFileUpload}>Upload</button>
    </div>
  );
};

export default ImageUploader;