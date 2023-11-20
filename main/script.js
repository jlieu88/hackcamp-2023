window.hackaEnabled = true;
if (!window.hackaInit) {
  init();
  window.hackaInit = true;
}

function init() {
  function injectSaver() {
    let div = document.createElement('div');
    div.innerHTML = `
    <span style="font-family: 'Century Gothic'; ">
      <script src="popup.js"></script>
      </textarea>
        RGB Value:
        <br>
        <input type="text" id="rgb" name="RGB" value="255,255,255" readonly> <br>
        <br>
        Sample Color Name:
        <br>
        <input type="text" id="SimpleColor" name="SimpleColor" value="white" readonly><br><br>
        <button id="copyR" , class = "btn copy">Copy RGB Value</button> <br>
      </textarea>
      <br>
      <button class = "btn save" id = "saveColor">Copy Name</button> <br>
    </span>`;
    div.id = 'saverMenu';
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.backgroundColor="rgb(255, 255, 255)";
    div.style.color = "rgb(0,0,0)";
    div.style.display = "none";
    div.style.textAlign = "center";
    div.style.fontSize = '15px';
    div.style.padding = '20px 20px 20px 20px';
    document.body.appendChild(div);
  }

  function injectFilterMenu() {
    let div = document.createElement("div");
    div.innerHTML = `
    <label for="filters">Choose filter:</label>
    <select name="filters" id="filters">
      <option value="default">Default</option>
      <option value="hselect">Hue Select</option>
      <option value="hshift">Hue Shift</option>
      <option value="hmask">Hue Mask</option>
      <option value="saturate">Saturate</option>
    </select>
    <div id="filterMenuContent"></div>
    <br>
    <button id="filterApplyBtn">Apply</button>
    <button id="filterCancelBtn">Cancel</button>`;
    div.id = 'hackaFilterMenu';
    div.style.position = "absolute";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.backgroundColor="rgb(255, 255, 255)";
    div.style.color = "rgb(0,0,0)";
    div.style.display = "none";
    div.style.textAlign = "center";
    div.style.fontSize = '15px';
    div.style.padding = '20px 20px 20px 20px';
    document.body.appendChild(div);
  }

  function injectCursor() {
    let div = document.createElement("div");
    div.innerHTML = '';
    div.id = 'hackaCursor';
    div.style.position = "fixed";
    div.style.width = "160px";
    div.style.height = "45px";
    div.style.left = "0px";
    div.style.top = "0px";
    div.style.backgroundColor="rgb(255, 255, 255)";
    div.style.color = "rgb(0,0,0)";
    div.style.display = "none";
    div.style.textAlign = "center";
    div.style.borderWidth = '3px';
    div.style.borderColor = 'rgb(255,0,0)';
    div.style.borderStyle = 'solid';
    div.style.fontSize = '15px';
    document.body.appendChild(div);
  }

  function injectHTML() {
    injectFilterMenu();
    injectCursor();
    injectSaver();
  }

  let H_colors = [
    [0, 'red'],
    [20, 'orange'],
    [50, 'yellow'],
    [75, 'lime'],
    [120, 'green'],
    [170, 'cyan'],
    [240, 'blue'],
    [280, 'violet'],
    [300, 'magenta'],
    [335, 'red-violet'],
    [355, 'red']
  ];
  function getDesc(color) {
    let hsl = rgb_to_hsl(color[0], color[1], color[2]);
    let min = 0;
    for (let i = 0; i < H_colors.length; i++) {
      if (Math.abs(H_colors[i][0] - hsl[0]) < Math.abs(H_colors[min][0] - hsl[0])) {
        min = i;
      }
    }
    let prefix = "";
    if (hsl[2] < 10) return "black";
    if (hsl[2] > 90) return "white";
    if (hsl[1] < 20) {
      if (hsl[2] < 20) return "black";
      if (hsl[2] > 80) return "white";
    }
    if (hsl[1] < 30) prefix = "saturated ";
    if (hsl[1] < 15) {
      if (hsl[2] < 30) return "dark gray";
      if (hsl[2] > 70) return "light gray";
      return "gray";
    }
    if (hsl[2] > 75) prefix = "light ";
    if (hsl[2] < 25) prefix = "dark ";
    return prefix + H_colors[min][1];
  }

  let mouseX = 0;
  let mouseY = 0;
  let mouseOverImage = false;
  let selectedImage;
  let filterMenuOpen = false;
  let name = 'white';
  let rgbval = '255,255,255';

  function updateCursor(x, y, color) {
    elem = document.getElementById('hackaCursor');
    elem.style.left = x + 20 + "px";
    elem.style.top = y + 20 + "px";
    elem.style.borderColor = `rgb(${color.join(',')})`;
    elem.innerHTML = color.slice(0, 3).join(', ') + '<br>' + getDesc(color);
    elem.style.display = "block";

    name = getDesc(color);
    rgbval = color.slice(0,3).join(',');

    mouseX = x;
    mouseY = y;
    mouseOverImage = true;
  }
  
  function hideCursor() {
    elem = document.getElementById('hackaCursor');
    elem.style.display = "none";

    mouseOverImage = false;
  }

  function updateFilterMenu() {
    let elem = document.getElementById('hackaFilterMenu');
    elem.style.left = mouseX + window.scrollX + 20 + "px";
    elem.style.top = mouseY + window.scrollY + 55 + 20 + "px";
    elem.style.display = "block";
    filterMenuOpen = true;
  }

  function hideFilterMenu() {
    let elem = document.getElementById('hackaFilterMenu');
    elem.style.display = "none";
    filterMenuOpen = false;
  }

  function updateCopyMenu() {
    let elem = document.getElementById('saverMenu');
    document.getElementById('rgb').value = rgbval;
    document.getElementById('SimpleColor').value = name;
    elem.style.left = mouseX + window.scrollX + 20 + "px";
    elem.style.top = mouseY + window.scrollY + 55 + 20 + "px";
    elem.style.display = "block";
  }

  function hideCopyMenu() {
    let elem = document.getElementById('saverMenu');
    elem.style.display = "none";
  }

  function updateFilterMenuContent(filter) {
    let elem = document.getElementById('filterMenuContent');
    elem.innerHTML = '';
    switch(filter) {
      case 'hselect':
        elem.innerHTML = `
        <br>
        Target Hue:
        <br>
        <input type="range" min="1" max="360" value="180" id="hselectHue">
        <div id="hueDisplay" width="20px" height="20px"><br></div>
        Spread:
        <br>
        <input type="text" id="hselectRange" name="hselectRange" value="20">`;
        document.getElementById('hselectHue').addEventListener('mousemove', () => {
          document.getElementById('hueDisplay').style.backgroundColor = `rgb(${hsl_to_rgb(+document.getElementById('hselectHue').value, 100, 50)})`;
        });
        break;
      case 'hmask':
        elem.innerHTML = `
        <br>
        Target Hue:
        <br>
        <input type="range" min="1" max="360" value="180" id="hmaskHue">
        <div id="hueDisplay" width="20px" height="20px"><br></div>
        Spread:
        <br>
        <input type="text" id="hmaskRange" name="hmaskRange" value="20">`;
        document.getElementById('hmaskHue').addEventListener('mousemove', () => {
          document.getElementById('hueDisplay').style.backgroundColor = `rgb(${hsl_to_rgb(+document.getElementById('hmaskHue').value, 100, 50)})`;
        });
        break;
      case 'hshift':
        elem.innerHTML = `
        <br>
        Target Hue Shift:
        <br>
        <input type="range" min="1" max="360" value="180" id="hshiftHue">
        <div id="hueDisplay" width="20px" height="20px"><br></div>`;
        document.getElementById('hshiftHue').addEventListener('mousemove', () => {
          let huedis = document.getElementById('hueDisplay');
          huedis.style.backgroundColor = `rgb(${hsl_to_rgb(+document.getElementById('hshiftHue').value, 100, 90)})`;
          huedis.innerHTML = `${document.getElementById('hshiftHue').value}°`;
        });
        break;
      case 'saturate':
        elem.innerHTML = `
          Saturation:
          <br>
          <input type="range" min="1" max="500" value="50" id="saturateSat">`;
        break;
    }
  }

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
        saturation = luminance <= 0.5 ? diff / (max_rgb + min_rgb) : diff / (2.0 - max_rgb - min_rgb);
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

  function hsl_to_rgb(hue, saturation, luminance) {
    hue /= 360;
    saturation /= 100;
    luminance /= 100;
    var r, g, b;
    if ( saturation === 0 ) {
        r = g = b = luminance;
    }
    else {
        var var_2 = luminance < 0.5 ? luminance * (1 + saturation) : luminance + saturation - luminance * saturation;
        var var_1 = 2 * luminance - var_2;

        r = hue_to_rgb(var_1, var_2, hue + (1/3));
        g = hue_to_rgb(var_1, var_2, hue);
        b = hue_to_rgb(var_1, var_2, hue - (1/3));
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  }
  function hue_to_rgb(v1, v2, vH) {
      if(vH < 0) vH += 1;
      if(vH > 1) vH -= 1;
      if(vH < 1/6) return v1 + (v2 - v1) * 6 * vH;
      if(vH < 1/2) return v2;
      if(vH < 2/3) return v1 + (v2 - v1) * (2/3 - vH) * 6;
      return v1;
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
          if (!window.hackaEnabled) return;
          let rect = image.getBoundingClientRect();
          let RGB = getRGBValue(Math.floor((event.clientX - rect.left) * (image.naturalWidth / image.width)), Math.floor((event.clientY - rect.top) * (image.naturalHeight / image.height)), images[i]);
          updateCursor(event.clientX, event.clientY, RGB);
          if (!filterMenuOpen) selectedImage = images[i];
        });

      image.addEventListener(
        "mouseout",
        (event) => {
          hideCursor();
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
    let c;
    if (image.changedContext) {
      c = image.changedContext.getImageData(mouseX, mouseY, 1, 1);
    } else {
      c = image.context.getImageData(mouseX, mouseY, 1, 1);
    }
    return [ c.data[0], c.data[1], c.data[2], c.data[3] ];
  }
    
  function hueShiftFilter(color, hueShift) {
    let hsl = rgb_to_hsl(color[0], color[1], color[2]);
    return hsl_to_rgb((hsl[0] + hueShift) % 360, hsl[1], hsl[2]);
  }

  function hueSelectFilter(color, hue, range) {
    let hsl = rgb_to_hsl(color[0], color[1], color[2]);
    if (Math.abs(hsl[0] - hue) < range) return color;
    else {
      let average = (color[0] + color[1] + color[2]) / 3;
      return [ average, average, average ];
    }
  }

  function hueMaskFilter(color, hue, range) {
    let hsl = rgb_to_hsl(color[0], color[1], color[2]);
    if (Math.abs(hsl[0] - hue) < range && Math.abs(hsl[1] - 50) < 40 && Math.abs(hsl[2] - 50) < 35) return color;
    else {
      return [ color[0] * 0.1, color[1] * 0.1, color[2] * 0.1 ];
    }
  }

  function saturateFilter(color, sat) {
    let hsl = rgb_to_hsl(color[0], color[1], color[2]);
    return hsl_to_rgb(hsl[0], Math.min(hsl[1] * sat / 100, 100), hsl[2]);
  }

  function applyFilter(image, filter) {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d', { willReadFrequently: true });
    canvas.width = image.canvas.width;
    canvas.height = image.canvas.height;
    context.drawImage(filter === 'default' ? image.canvas : (image.changedCanvas || image.canvas), 0, 0);

    let data = context.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < canvas.height * canvas.width; i ++) {
      let color = [ data.data[i * 4 + 0], data.data[i * 4 + 1], data.data[i * 4 + 2] ]
      let result, hue, range, sat, light;
      switch(filter) {
        case 'default':
          result = color;
          break;
        case 'hselect':
          hue = +document.getElementById('hselectHue').value;
          range = +document.getElementById('hselectRange').value;
          if (!hue || !range) return;
          result = hueSelectFilter(color, hue, range);
          break;
        case 'hshift':
          hue = +document.getElementById('hshiftHue').value;
          if (!hue) return;
          result = hueShiftFilter(color, hue);
          break;
        case 'hmask':
          hue = +document.getElementById('hmaskHue').value;
          range = +document.getElementById('hmaskRange').value;
          if (!hue || !range) return;
          result = hueMaskFilter(color, hue, range);
          break;
        case 'saturate':
          sat = +document.getElementById('saturateSat').value;
          if (!sat) return;
          result = saturateFilter(color, sat);
          break;
      }
      if (!result) return;
      data.data[i * 4 + 0] = result[0];
      data.data[i * 4 + 1] = result[1];
      data.data[i * 4 + 2] = result[2];
    }
    context.putImageData(data, 0, 0, 0, 0, canvas.width, canvas.height);

    image.changedCanvas = canvas;
    image.changedContext = context;

    image.element.src = canvas.toDataURL();
  } 

  injectHTML();
  loadImages();

  document.addEventListener("keypress", (event) => {
    if (!window.hackaEnabled) return;
    if (event.key == 'f' && mouseOverImage) {
      updateFilterMenu();
    }
    if (event.key == 'c' && mouseOverImage) {
      updateCopyMenu();
    }
  });

  document.getElementById('filters').addEventListener('click', () => {
    updateFilterMenuContent(document.getElementById('filters').value);
  });

  document.getElementById('filterApplyBtn').addEventListener("click", () => {
    applyFilter(selectedImage, document.getElementById('filters').value);
  });

  document.getElementById('filterCancelBtn').addEventListener("click", () => {
    hideFilterMenu();
  });

  document.getElementById("saveColor").addEventListener("click", function() {
    var input = document.getElementById("SimpleColor").value;
    navigator.clipboard.writeText(input);
    hideCopyMenu();
  });

  document.getElementById("copyR").addEventListener("click", function() {
    var input = document.getElementById("rgb").value;
    navigator.clipboard.writeText(input);
    hideCopyMenu();
  });

  console.log('init');
}