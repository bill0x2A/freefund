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