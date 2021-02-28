var isArrayBufferSupported = (new Buffer(new Uint8Array([1]).buffer)[0] === 1);

export const arrayBufferToBuffer = isArrayBufferSupported ? arrayBufferToBufferAsArgument : arrayBufferToBufferCycle;

function arrayBufferToBufferAsArgument(ab) {
  return new Buffer(ab);
}

function arrayBufferToBufferCycle(ab) {
  var buffer = new Buffer(ab.byteLength);
  var view = new Uint8Array(ab);
  for (var i = 0; i < buffer.length; ++i) {
      buffer[i] = view[i];
  }
  return buffer;
}

export const blobToURL = blob => {
    return new Promise(resolve => {
      const url = URL.createObjectURL(blob)
      resolve(url);
    })
  }

export const getCanvasBlob = canvas => {
    return new Promise(function(resolve, reject) {
      canvas.toBlob(function(blob) {
        resolve(blob)
      })
    })
  }

export const createCanvas = (img, crop) => {
  let image = new Image();
  image.src = img;
  const canvas = document.createElement('canvas');
  canvas.style.display = "none";
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;
  canvas.width = crop.width;
  canvas.height = crop.height;
  const ctx = canvas.getContext('2d');
 
  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    crop.width,
    crop.height,
  );

  return canvas;
}

export const fileToDataUri = (file) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    resolve(event.target.result)
  };
  reader.readAsDataURL(file);
  })