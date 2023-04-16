import weaviate from 'weaviate-ts-client';
import fs from 'fs'
import path from 'path'

// create directory to store results of query, empty if it exists
var dir = '../results';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}
else {
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
      const filePath = path.join(dir, file);
      try {
        fs.rmSync(filePath, { recursive: true, force: true });
      } catch (err) {
        console.error(`Error while removing file: ${filePath}`, err);
      }
    }
}

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

// Query image
const test = Buffer.from( fs.readFileSync('../img_test/meme.jpg') ).toString('base64');

const limit = 1

const resImage = await client.graphql.get()
  .withClassName('Project')
  .withFields(['image'])
  .withNearImage({ image: test })
  .withLimit(limit)
  .do();

// Write results to directory
for (let i = 0; i < limit; i++) {
    let result = resImage.data.Get.Project[i].image;
    fs.writeFileSync(`../results/result${i}.jpg`, result, 'base64');
}
