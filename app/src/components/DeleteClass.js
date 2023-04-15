// DeleteClass.js
import React, { useState, useEffect } from 'react';
import weaviate from 'weaviate-client';

const client = weaviate.client({
  scheme: 'http',
  host: 'localhost:8080',
});

const DeleteClass = () => {
  const [classNames, setClassNames] = useState([]);
  const [selectedClass, setSelectedClass] = useState('');

  useEffect(() => {
    const fetchClassNames = async () => {
      const schema = await client.schema.get();
      const classes = schema.classes.map((cls) => cls.className);
      setClassNames(classes);
      setSelectedClass(classes[0]);
    };

    fetchClassNames();
  }, []);

  const handleClassChange = (event) => {
    setSelectedClass(event.target.value);
  };

  const deleteClass = async () => {
    try {
      await client.schema.classDeleter().withClassName(selectedClass).do();
      alert(`Class '${selectedClass}' successfully deleted!`);
    } catch (err) {
      alert(`Error deleting class '${selectedClass}'.`);
    }
  };

  return (
    <div>
      <h3>Delete Class from Weaviate Schema</h3>
      <label htmlFor="className">Class Name:</label>
      <select id="className" name="className" value={selectedClass} onChange={handleClassChange}>
        {classNames.map((cls) => (
          <option key={cls} value={cls}>
            {cls}
          </option>
        ))}
      </select>
      <button onClick={deleteClass}>Delete Class</button>
    </div>
  );
};

export default DeleteClass;
