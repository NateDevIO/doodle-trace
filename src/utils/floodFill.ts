export function floodFill(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    fillColor: string
) {
    x = Math.floor(x);
    y = Math.floor(y);
    const canvas = ctx.canvas;
    const w = canvas.width;
    const h = canvas.height;

    // Get image data
    const imageData = ctx.getImageData(0, 0, w, h);
    const data = imageData.data; // Uint8ClampedArray

    // Parse fill color
    // We'll assume fillColor is hex for now, need a helper to convert to RGBA
    const { r: tr, g: tg, b: tb, a: ta } = hexToRgba(fillColor);

    // Get starting pixel index
    const startIdx = (y * w + x) * 4;
    const sr = data[startIdx];
    const sg = data[startIdx + 1];
    const sb = data[startIdx + 2];
    const sa = data[startIdx + 3];

    // If color is already same, return
    if (sr === tr && sg === tg && sb === tb && sa === ta) return;

    const stack = [[x, y]];

    const matchStartColor = (pos: number) => {
        return (
            data[pos] === sr &&
            data[pos + 1] === sg &&
            data[pos + 2] === sb &&
            data[pos + 3] === sa
        );
    };

    const colorPixel = (pos: number) => {
        data[pos] = tr;
        data[pos + 1] = tg;
        data[pos + 2] = tb;
        data[pos + 3] = ta;
    };

    while (stack.length) {
        const [cx, cy] = stack.pop()!;
        const currentPos = (cy * w + cx) * 4;

        if (matchStartColor(currentPos)) {
            colorPixel(currentPos);

            // Push neighbors
            if (cx > 0) stack.push([cx - 1, cy]);
            if (cx < w - 1) stack.push([cx + 1, cy]);
            if (cy > 0) stack.push([cx, cy - 1]);
            if (cy < h - 1) stack.push([cx, cy + 1]);
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

function hexToRgba(hex: string) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (_m, r, g, b) {
        return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
        a: 255
    } : { r: 0, g: 0, b: 0, a: 255 };
}
