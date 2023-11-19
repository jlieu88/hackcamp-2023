function main() {

    let images = document.body.getElementsByTagName("img");
    for (let image of images) {
        image.addEventListener(
            "click",
            (event) => {
                console.log('clicked over image!');
            });
    }

    // Tests for rgb to hsl

    // console.assert(JSON.stringify(rgb_to_hsl(255, 0, 0)) === JSON.stringify([0, 100, 50]),
    //     "Test Case 1 failed"
    // );
    // console.assert(JSON.stringify(rgb_to_hsl(0, 255, 0)) === JSON.stringify([120, 100, 50]),
    //     "Test Case 2 failed"
    // );
    // console.assert(JSON.stringify(rgb_to_hsl(0, 0, 255)) === JSON.stringify([240, 100, 50]),
    //     "Test Case 3 failed"
    // );
    // console.assert(JSON.stringify(rgb_to_hsl(128, 128, 128)) === JSON.stringify([0, 0, 50]),
    //     "Test Case 4 failed"
    // );

}

export function rgb_to_hsl(red, green, blue) {
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


main();