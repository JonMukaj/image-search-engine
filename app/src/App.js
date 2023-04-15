// App.js or another main component
import React from 'react';
import ImageUploader from './components/ImageUploader.js';
import NearestImageFinder from './components/NearestImageFinder.js';
import DeleteClass from './components/DeleteClass.js';
import CreateClass from './components/CreateClass.js';

const App = () => {
  return (
    <div>
      <h1>React Image Uploader and Finder</h1>
      <ImageUploader />
      <hr />
      <NearestImageFinder />
      <hr />
      <DeleteClass />
      <hr />
      <CreateClass />
    </div>
  );
};

export default App;