(() => {
  
  function rgb_to_hsl(red, green, blue) {
    // Normalizing the colors to 0-1 range
    const r = red / 255;
    const g = green / 255;
    const b = blue / 255;
    let rgb_array = [r, g, b];

    // Find the min/max of the r g b values
    const max_rgb = Math.max.apply(Math, rgb_array);
    const min_rgb = Math.min.apply(Math, rgb_array);

    // Calculate the luminace value
    let hue, saturation, luminance = (max_rgb + min_rgb) / 2;

    // Calculate the saturation values
    if (max_rgb === min_rgb) {
        saturation = 0;
        hue = 0;
    } else {

        const diff = max_rgb - min_rgb;
        saturation = luminance <= 0.5 ? diff / (max_rgb + min_rgb) : diff / (2.0 - max - min);
        // Calculating the hue value - if there's no saturation, there is no hue either.
        switch (max_rgb) {
            case r:
                hue = (g - b) / diff;
                break;
            case g:
                hue = 2.0 + ((b - r) / diff);
                break;
            case b:
                hue = 4.0 + ((r - g) / diff);
                break;
        }
        hue = hue * 60;
        if (hue < 0)
            hue = hue + 360;
    }
    return [hue, Math.round(100 * saturation), Math.round(100 * luminance)];
}

  const images = [];
  const hoveredImage = -1;

  function loadImages() {
    let documentImages = document.body.getElementsByTagName("img");
    for (let i = 0; i < documentImages.length; i ++) {
      const image = documentImages[i];
      const canvasData = createCanvas(image);
      images.push({
        element: image,
        canvas: canvasData[0],
        context: canvasData[1]
      });

      image.addEventListener(
        "mousemove",
        (event) => {
          let rect = image.getBoundingClientRect();
          let RGB = getRGBValue(Math.floor(event.clientX - rect.left), Math.floor(event.clientY - rect.top), images[i]);
          //console.log(RGB);
        });

      image.addEventListener(
        "mouseover",
        (event) => {
          applyFilter(images[i]);
        });
        
    }
  }

  function createCanvas(imageElement) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = imageElement.naturalWidth;
    canvas.height = imageElement.naturalHeight;

    context.drawImage(imageElement, 0, 0);
    
    return [ canvas, context ];
  }

  function getRGBValue(mouseX, mouseY, image) {
    let c = image.context.getImageData(mouseX, mouseY, 1, 1);
    return [ c.data[0], c.data[1], c.data[2], c.data[3] ];
  }

  function applyFilter(image) {
    for (let y = 0; y < image.canvas.height; y ++) {
      for (let x = 0; x < image.canvas.width; x ++) {
        var p = image.context.getImageData(x, y, 1, 1);
        p.data[0] /= 2;
        p.data[1] /= 2;
        p.data[2] /= 2;
        image.context.putImageData(p, x, y);
      } 
    }
    image.element.src = image.canvas.toDataURL();
  } 

  loadImages();
})();