// utils/colorExtractor.js
export const extractDominantColors = (imageElement, numColors = 5) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      canvas.width = imageElement.width;
      canvas.height = imageElement.height;
      
      ctx.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
      
      // Get image data from canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      
      // Sample pixels (for performance, we don't need to process every pixel)
      const colorMap = {};
      const sampleStep = Math.max(1, Math.floor(pixels.length / 4 / 10000)); // Sample approximately 10,000 pixels
      
      for (let i = 0; i < pixels.length; i += 4 * sampleStep) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        
        // Skip transparent pixels
        if (pixels[i + 3] < 128) continue;
        
        // Quantize colors slightly to reduce number of unique colors
        const quantizedR = Math.round(r / 8) * 8;
        const quantizedG = Math.round(g / 8) * 8;
        const quantizedB = Math.round(b / 8) * 8;
        
        const hex = `#${quantizedR.toString(16).padStart(2, '0')}${quantizedG.toString(16).padStart(2, '0')}${quantizedB.toString(16).padStart(2, '0')}`;
        
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
      
      // Return the specified number of most common colors
      resolve(sortedColors.slice(0, numColors));
    });
  };