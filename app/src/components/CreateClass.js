// CreateClass.js
import React, { useState } from 'react';
import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const CreateClass = () => {
  const [className, setClassName] = useState('');

  const handleClassNameChange = (event) => {
    setClassName(event.target.value);
  };

  const createClass = async () => {
    const schemaConfig = {
      'class': className,
      'vectorizer': 'img2vec-neural',
      'vectorIndexType': 'hnsw',
      'moduleConfig': {
        'img2vec-neural': {
          'imageFields': [
            'image',
          ],
        },
      },
      'properties': [
        {
          'name': 'image',
          'dataType': ['blob'],
        },
        {
          'name': 'text',
          'dataType': ['string'],
        },
      ],
    };

    try {
      await client.schema.classCreator().withClass(schemaConfig).do();
      alert(`Class '${className}' successfully created!`);
    } catch (err) {
      alert(`Error creating class '${className}': ${err.message}`);
    }
  };

  return (
    <div>
      <h3>Create Class in Weaviate Schema</h3>
      <label htmlFor="className">Class Name:</label>
      <input
        type="text"
        id="className"
        name="className"
        value={className}
        onChange={handleClassNameChange}
      />
      <button onClick={createClass}>Create Class</button>
    </div>
  );
};

export default CreateClass;
