import React, { useRef } from 'react';
import '../App.css';

function ImageUploader({ onImageUpload }) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.match('image.*')) {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => onImageUpload(img);
      };
      
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="image-uploader">
      <h2>Upload an image</h2>
      <button className="upload-btn" onClick={handleButtonClick}>
        Upload Image
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        style={{ display: 'none' }} 
      />
      <p>Click on any part of your image to extract matching colors</p>
    </div>
  );
}

export default ImageUploader;