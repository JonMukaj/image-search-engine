import weaviate from 'weaviate-ts-client';
import fs from 'fs'
import path from 'path'

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const className = "Project"

// Store images of directory img
const processImage = async (filename) => {
  const img = fs.readFileSync(path.join('../img', filename));
  const b64 = Buffer.from(img).toString('base64');

  await client.data.creator()
    .withClassName(className)
    .withProperties({
      image: b64,
      text: ""
    })
    .do();
};

fs.readdir('../img', async (err, files) => {
  if (err) {
    console.error('Error reading the directory:', err);
    return;
  }

  const promises = files.map((file) => processImage(file));
  await Promise.all(promises);

  console.log('All images have been processed and stored in Weaviate.');
});

