// Fonction pour extraire la couleur dominante d'une image
export const getAverageColor = async (imageUrl: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "Anonymous";
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) {
        resolve('#f8fafc'); // Fallback color
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;
      context.drawImage(img, 0, 0);

      try {
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let r = 0, g = 0, b = 0, count = 0;

        for (let i = 0; i < imageData.length; i += 4) {
          r += imageData[i];
          g += imageData[i + 1];
          b += imageData[i + 2];
          count++;
        }

        r = Math.floor(r / count);
        g = Math.floor(g / count);
        b = Math.floor(b / count);

        resolve(`rgb(${r}, ${g}, ${b})`);
      } catch (error) {
        resolve('#f8fafc'); // Fallback color
      }
    };

    img.onerror = () => {
      resolve('#f8fafc'); // Fallback color
    };

    img.src = imageUrl;
  });
};