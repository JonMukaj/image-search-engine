import weaviate from 'weaviate-ts-client';

const client = weaviate.client({
    scheme: 'http',
    host: 'localhost:8080',
});

const className = "Project"

client.schema
  .classDeleter()
  .withClassName(className)
  .do()
  .then(res => {
    console.log(`Class '${className}' successfully deleted!`);
  })
  .catch(err => {
    console.error(`Class '${className}' does not exist!`)
  });