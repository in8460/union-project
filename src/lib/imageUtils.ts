export async function compressImage(base64Str: string, maxWidth = 1000, maxHeight = 1000, quality = 0.6): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context not available'));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
      
      // Check if size is within Firestore limits (approx 1MB limit, keeping safe at 600KB)
      const sizeInBytes = Math.round((compressedBase64.length * 3) / 4);
      if (sizeInBytes > 600000) {
        // If still too large, try even smaller
        const extremeCanvas = document.createElement('canvas');
        extremeCanvas.width = width * 0.7;
        extremeCanvas.height = height * 0.7;
        const extremeCtx = extremeCanvas.getContext('2d');
        if (extremeCtx) {
          extremeCtx.drawImage(canvas, 0, 0, extremeCanvas.width, extremeCanvas.height);
          resolve(extremeCanvas.toDataURL('image/jpeg', quality * 0.8));
          return;
        }
      }
      
      resolve(compressedBase64);
    };
    img.onerror = (err) => reject(err);
  });
}

export function getLocalStorageSize() {
  let _lsTotal = 0, _xLen, _x;
  for (_x in localStorage) {
    if (!localStorage.hasOwnProperty(_x)) {
      continue;
    }
    _xLen = ((localStorage[_x].length + _x.length) * 2);
    _lsTotal += _xLen;
  }
  return (_lsTotal / 1024).toFixed(2); // KB
}
