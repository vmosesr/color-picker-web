import React, { useEffect, useRef } from 'react';
import '../App.css';
import { extractDominantColors } from '../utils/ColorExtractor';

function ColorDisplay({ image, selectedColors, selectedPoint, onImageClick, onImageUpload }) {
  const imageRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (image && imageRef.current) {
      // Extract dominant colors when image is loaded
      extractDominantColors(imageRef.current).then(() => {
        // Do something if needed
      });
    }
  }, [image]);

  const handleClick = (e) => {
    if (imageRef.current) {
      onImageClick(e, imageRef.current);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          onImageUpload(img); // ✅ This replaces the current image
        };
      };
      reader.readAsDataURL(file);
    }
  };
  

  return (
    <div className="color-display">
      <div className="image-container">
        <div 
          className="image-wrapper"
          onClick={handleClick}
        >
          <img 
            ref={imageRef}
            src={image.src} 
            alt="Uploaded" 
          />
          {selectedPoint && (
            <div 
              className="selected-point"
              style={{ 
                left: `${selectedPoint.x}px`, 
                top: `${selectedPoint.y}px` 
              }}
            />
          )}
        </div>
      </div>

      <div className="color-btn-section">
        {selectedColors.length > 0 && (
            <div className="color-palette">
            <h3>Selected Colors</h3>
            <div className="color-grid">
                {selectedColors.map((color, index) => (
                <div key={index} className="color-swatch">
                    <div 
                    className="color-box" 
                    style={{ backgroundColor: color }}
                    />
                    <span className="color-hex">{color}</span>
                </div>
                ))}
            </div>
            </div>
        )}

        <div className="">
            <button className="upload-btn" onClick={handleButtonClick}>
            Select Other Image
            </button>
            <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            style={{ display: 'none' }} 
            />
        </div>
      </div>
    </div>
  );
}

export default ColorDisplay;
