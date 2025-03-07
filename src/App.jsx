import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ImageUploader from './components/ImageUploader';
import ColorDisplay from './components/ColorDisplay';
import './App.css';

function App() {
  const [image, setImage] = useState(null);
  const [dominantColors, setDominantColors] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [user, setUser] = useState(null);

  const handleImageUpload = (img) => {
    setImage(img);
    // Reset colors when new image is uploaded
    setDominantColors([]);
    setSelectedColors([]);
    setSelectedPoint(null);
  };

  const handleImageClick = (e, imageElement) => {
    if (!imageElement) return;
    
    const rect = imageElement.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Set click point for visual feedback
    setSelectedPoint({ x, y });
    
    // Extract colors from around the clicked point
    extractColorsAtPoint(imageElement, x, y);
  };

  const extractColorsAtPoint = (imageElement, x, y) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = imageElement.width;
    canvas.height = imageElement.height;
    
    ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
    
    // Get a small region around the clicked point
    const radius = 5;
    const startX = Math.max(0, x - radius);
    const startY = Math.max(0, y - radius);
    const width = Math.min(radius * 2, canvas.width - startX);
    const height = Math.min(radius * 2, canvas.height - startY);
    
    const imageData = ctx.getImageData(startX, startY, width, height);
    
    // Sample pixels and get most common colors
    const colorMap = {};
    
    for (let i = 0; i < imageData.data.length; i += 4) {
      const r = imageData.data[i];
      const g = imageData.data[i + 1];
      const b = imageData.data[i + 2];
      
      const hex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      
      if (colorMap[hex]) {
        colorMap[hex]++;
      } else {
        colorMap[hex] = 1;
      }
    }
    
    // Convert to array and sort by frequency
    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    // Get up to 4 most common colors
    setSelectedColors(sortedColors.slice(0, 4));
  };

  return (
    <div className="app">
    
      <Navbar user={user} setUser={setUser} />
      
      <main className="content">
        {!image ? (
          <ImageUploader onImageUpload={handleImageUpload} />
        ) : (
          <ColorDisplay 
            image={image}
            dominantColors={dominantColors}
            selectedColors={selectedColors}
            selectedPoint={selectedPoint}
            onImageUpload={handleImageUpload}
            onImageClick={handleImageClick}
          />
        )}
      </main>
    </div>
  );
}

export default App;