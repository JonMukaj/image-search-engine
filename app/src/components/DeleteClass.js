// DeleteClass.js
import React, { useState } from 'react';
import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const DeleteClass = () => {
  const [className, setClassName] = useState('');

  const handleClassNameChange = (event) => {
    setClassName(event.target.value);
  };

  const deleteClass = async () => {
    try {
      await client.schema.classDeleter().withClassName(className).do();
      alert(`Class '${className}' successfully deleted!`);
    } catch (err) {
      alert(`Class '${className}' does not exist!`);
    }
  };

  return (
    <div>
      <h3>Delete Class from Weaviate Schema</h3>
      <label htmlFor="className">Class Name:</label>
      <input
        type="text"
        id="className"
        name="className"
        value={className}
        onChange={handleClassNameChange}
      />
      <button onClick={deleteClass}>Delete Class</button>
    </div>
  );
};

export default DeleteClass;
