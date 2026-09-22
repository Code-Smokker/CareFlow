/**
 * DocumentScanner — dependency-free edge detection, 4-corner detection and perspective deskew
 * for the patient app's document capture screen. No external CV library: works entirely with
 * Canvas 2D pixel data, so it needs no CDN, no WASM download, and keeps working with the network
 * cable pulled (CLAUDE.md rule 9 — every external dependency needs a local fallback; here there
 * simply is no external dependency to fall back from).
 *
 * Pipeline: grayscale → blur → Sobel edge map → dilate (close gaps) → flood-fill in from the
 * four image borders over non-edge pixels (marks "background") → the largest connected region
 * NOT reached by that flood-fill is the document interior → its four extreme corners (by x+y and
 * x-y) are the document's corners → a homography maps those corners to a flat output rectangle,
 * sampled with bilinear interpolation (a real perspective warp, not a CSS/canvas affine
 * approximation).
 *
 * If no confident quadrilateral is found (busy background, document off-frame, etc.) every
 * function here returns null / a "cropped: false" result rather than guessing — the caller
 * always has a working fallback (upload the untouched photo).
 */
(function (global) {
  "use strict";

  var WORK_MAX_DIM = 520; // detection resolution — big enough to find real corners, small enough to stay fast
  var PREVIEW_MAX_DIM = 220; // live overlay resolution — runs every ~500ms, must be cheap
  var MIN_REGION_FRACTION = 0.12; // below this share of the frame, we don't trust the detection
  var OUTPUT_MAX_DIM = 1400; // final deskewed image cap — plenty for OCR, keeps upload size sane

  function drawToWorkingCanvas(source, maxDim) {
    var w = source.videoWidth || source.naturalWidth || source.width;
    var h = source.videoHeight || source.naturalHeight || source.height;
    if (!w || !h) return null;
    var scale = Math.min(1, maxDim / Math.max(w, h));
    var cw = Math.max(1, Math.round(w * scale));
    var ch = Math.max(1, Math.round(h * scale));
    var canvas = document.createElement("canvas");
    canvas.width = cw;
    canvas.height = ch;
    canvas.getContext("2d").drawImage(source, 0, 0, cw, ch);
    return { canvas: canvas, scale: scale, fullWidth: w, fullHeight: h };
  }

  function toGray(imageData) {
    var d = imageData.data;
    var w = imageData.width, h = imageData.height;
    var out = new Float32Array(w * h);
    for (var i = 0, j = 0; i < d.length; i += 4, j++) {
      out[j] = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
    }
    return out;
  }

  function boxBlur3(gray, w, h) {
    var out = new Float32Array(w * h);
    for (var y = 0; y < h; y++) {
      for (var x = 0; x < w; x++) {
        var sum = 0, n = 0;
        for (var dy = -1; dy <= 1; dy++) {
          var yy = y + dy;
          if (yy < 0 || yy >= h) continue;
          for (var dx = -1; dx <= 1; dx++) {
            var xx = x + dx;
            if (xx < 0 || xx >= w) continue;
            sum += gray[yy * w + xx];
            n++;
          }
        }
        out[y * w + x] = sum / n;
      }
    }
    return out;
  }

  /** Sobel gradient magnitude, thresholded to a binary edge mask (0 or 255). */
  function sobelEdgeMask(gray, w, h, threshold) {
    var mask = new Uint8Array(w * h);
    for (var y = 1; y < h - 1; y++) {
      for (var x = 1; x < w - 1; x++) {
        var i00 = gray[(y - 1) * w + (x - 1)], i01 = gray[(y - 1) * w + x], i02 = gray[(y - 1) * w + (x + 1)];
        var i10 = gray[y * w + (x - 1)], i12 = gray[y * w + (x + 1)];
        var i20 = gray[(y + 1) * w + (x - 1)], i21 = gray[(y + 1) * w + x], i22 = gray[(y + 1) * w + (x + 1)];
        var gx = (i02 + 2 * i12 + i22) - (i00 + 2 * i10 + i20);
        var gy = (i20 + 2 * i21 + i22) - (i00 + 2 * i01 + i02);
        var mag = Math.sqrt(gx * gx + gy * gy);
        mask[y * w + x] = mag > threshold ? 1 : 0;
      }
    }
    return mask;
  }

  /** 3x3 max-filter dilation, `iterations` times — closes small gaps in the edge outline. */
  function dilate(mask, w, h, iterations) {
    var cur = mask;
    for (var it = 0; it < iterations; it++) {
      var out = new Uint8Array(w * h);
      for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
          var on = 0;
          for (var dy = -1; dy <= 1 && !on; dy++) {
            var yy = y + dy;
            if (yy < 0 || yy >= h) continue;
            for (var dx = -1; dx <= 1; dx++) {
              var xx = x + dx;
              if (xx < 0 || xx >= w) continue;
              if (cur[yy * w + xx]) { on = 1; break; }
            }
          }
          out[y * w + x] = on;
        }
      }
      cur = out;
    }
    return cur;
  }

  /**
   * Flood-fills the background in from all four borders over non-edge pixels, then finds the
   * largest connected region that flood-fill never reached (i.e. an area enclosed by edges —
   * the document). Returns that region's pixel coordinates, or null if edges never close off
   * anything (busy/open scene, nothing to crop).
   */
  function findLargestEnclosedRegion(edgeMask, w, h) {
    var isBackground = new Uint8Array(w * h);
    var stack = [];
    function seed(x, y) {
      if (x < 0 || x >= w || y < 0 || y >= h) return;
      var idx = y * w + x;
      if (isBackground[idx] || edgeMask[idx]) return;
      isBackground[idx] = 1;
      stack.push(idx);
    }
    for (var x = 0; x < w; x++) { seed(x, 0); seed(x, h - 1); }
    for (var y = 0; y < h; y++) { seed(0, y); seed(w - 1, y); }
    while (stack.length) {
      var idx = stack.pop();
      var cx = idx % w, cy = (idx / w) | 0;
      seed(cx + 1, cy); seed(cx - 1, cy); seed(cx, cy + 1); seed(cx, cy - 1);
    }

    var compId = new Int32Array(w * h).fill(-1);
    var bestId = -1, bestSize = 0, id = 0;
    var stack2 = [];
    for (var y2 = 0; y2 < h; y2++) {
      for (var x2 = 0; x2 < w; x2++) {
        var idx2 = y2 * w + x2;
        if (isBackground[idx2] || edgeMask[idx2] || compId[idx2] !== -1) continue;
        var size = 0;
        stack2.push(idx2);
        compId[idx2] = id;
        while (stack2.length) {
          var cidx = stack2.pop();
          size++;
          var cx2 = cidx % w, cy2 = (cidx / w) | 0;
          var neighbors = [[cx2 + 1, cy2], [cx2 - 1, cy2], [cx2, cy2 + 1], [cx2, cy2 - 1]];
          for (var n = 0; n < 4; n++) {
            var nx = neighbors[n][0], ny = neighbors[n][1];
            if (nx < 0 || nx >= w || ny < 0 || ny >= h) continue;
            var nidx = ny * w + nx;
            if (isBackground[nidx] || edgeMask[nidx] || compId[nidx] !== -1) continue;
            compId[nidx] = id;
            stack2.push(nidx);
          }
        }
        if (size > bestSize) { bestSize = size; bestId = id; }
        id++;
      }
    }
    if (bestId === -1 || bestSize < w * h * MIN_REGION_FRACTION) return null;

    var minX = w, maxX = 0, minY = h, maxY = 0;
    var points = [];
    for (var y3 = 0; y3 < h; y3++) {
      for (var x3 = 0; x3 < w; x3++) {
        if (compId[y3 * w + x3] === bestId) {
          points.push({ x: x3, y: y3 });
          if (x3 < minX) minX = x3;
          if (x3 > maxX) maxX = x3;
          if (y3 < minY) minY = y3;
          if (y3 > maxY) maxY = y3;
        }
      }
    }
    // A region that already fills (almost) the whole frame isn't "a document on a background" —
    // there is nothing to crop to, so let the caller fall back to the untouched photo.
    var coversFrame = (maxX - minX) > w * 0.97 && (maxY - minY) > h * 0.97;
    if (coversFrame) return null;
    return { size: bestSize, points: points };
  }

  /** Classic sum/difference extreme-point corner pick — the standard "4-point transform" trick. */
  function extractQuadCorners(points) {
    var tl = points[0], tr = points[0], br = points[0], bl = points[0];
    var minSum = Infinity, maxSum = -Infinity, minDiff = Infinity, maxDiff = -Infinity;
    for (var i = 0; i < points.length; i++) {
      var p = points[i], sum = p.x + p.y, diff = p.x - p.y;
      if (sum < minSum) { minSum = sum; tl = p; }
      if (sum > maxSum) { maxSum = sum; br = p; }
      if (diff < minDiff) { minDiff = diff; bl = p; }
      if (diff > maxDiff) { maxDiff = diff; tr = p; }
    }
    return { tl: tl, tr: tr, br: br, bl: bl };
  }

  /** Detects the document's 4 corners in `source` (video frame, image or canvas). Returns
   * {tl,tr,br,bl} in `source`'s own full-resolution pixel coordinates, or null. */
  function detectCorners(source, maxDim) {
    var working = drawToWorkingCanvas(source, maxDim || WORK_MAX_DIM);
    if (!working) return null;
    var ctx = working.canvas.getContext("2d");
    var w = working.canvas.width, h = working.canvas.height;
    var imageData = ctx.getImageData(0, 0, w, h);
    var gray = boxBlur3(toGray(imageData), w, h);
    var edges = sobelEdgeMask(gray, w, h, 40);
    edges = dilate(edges, w, h, 2);
    var region = findLargestEnclosedRegion(edges, w, h);
    if (!region) return null;
    var corners = extractQuadCorners(region.points);
    var inv = 1 / working.scale;
    return {
      tl: { x: corners.tl.x * inv, y: corners.tl.y * inv },
      tr: { x: corners.tr.x * inv, y: corners.tr.y * inv },
      br: { x: corners.br.x * inv, y: corners.br.y * inv },
      bl: { x: corners.bl.x * inv, y: corners.bl.y * inv },
    };
  }

  // ── perspective deskew ──────────────────────────────────────────────────────────────────────

  /** Solves an 8x8 linear system by Gaussian elimination with partial pivoting. */
  function solve8x8(A, b) {
    var n = 8;
    var M = [];
    for (var i = 0; i < n; i++) M.push(A[i].concat([b[i]]));
    for (var col = 0; col < n; col++) {
      var pivotRow = col;
      for (var r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[pivotRow][col])) pivotRow = r;
      var tmp = M[col]; M[col] = M[pivotRow]; M[pivotRow] = tmp;
      var pivot = M[col][col];
      if (Math.abs(pivot) < 1e-9) return null; // degenerate quad — caller falls back
      for (var r2 = 0; r2 < n; r2++) {
        if (r2 === col) continue;
        var factor = M[r2][col] / pivot;
        for (var c = col; c <= n; c++) M[r2][c] -= factor * M[col][c];
      }
    }
    var x = [];
    for (var i2 = 0; i2 < n; i2++) x.push(M[i2][n] / M[i2][i2]);
    return x;
  }

  /** Homography H (3x3, h[8]=1) such that dst_i ≈ H * src_i for the 4 given correspondences. */
  function computeHomography(src, dst) {
    var A = [], b = [];
    for (var i = 0; i < 4; i++) {
      var sx = src[i].x, sy = src[i].y, dx = dst[i].x, dy = dst[i].y;
      A.push([sx, sy, 1, 0, 0, 0, -sx * dx, -sy * dx]); b.push(dx);
      A.push([0, 0, 0, sx, sy, 1, -sx * dy, -sy * dy]); b.push(dy);
    }
    var h = solve8x8(A, b);
    if (!h) return null;
    return h.concat([1]);
  }

  function applyHomography(H, x, y) {
    var w = H[6] * x + H[7] * y + H[8];
    if (Math.abs(w) < 1e-9) return null;
    return { x: (H[0] * x + H[1] * y + H[2]) / w, y: (H[3] * x + H[4] * y + H[5]) / w };
  }

  function dist(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }

  /** Bilinear sample of `imageData` at (x, y); returns [r,g,b,a] clamped at the border. */
  function sampleBilinear(imageData, x, y) {
    var w = imageData.width, h = imageData.height, d = imageData.data;
    x = Math.max(0, Math.min(w - 1.001, x));
    y = Math.max(0, Math.min(h - 1.001, y));
    var x0 = x | 0, y0 = y | 0, x1 = x0 + 1, y1 = y0 + 1;
    var fx = x - x0, fy = y - y0;
    var i00 = (y0 * w + x0) * 4, i10 = (y0 * w + x1) * 4, i01 = (y1 * w + x0) * 4, i11 = (y1 * w + x1) * 4;
    var out = [0, 0, 0, 0];
    for (var c = 0; c < 4; c++) {
      var top = d[i00 + c] * (1 - fx) + d[i10 + c] * fx;
      var bot = d[i01 + c] * (1 - fx) + d[i11 + c] * fx;
      out[c] = top * (1 - fy) + bot * fy;
    }
    return out;
  }

  /** Warps the quadrilateral `corners` in `source` into a flat, deskewed output canvas. */
  function warpToRect(source, corners) {
    var full = document.createElement("canvas");
    full.width = source.videoWidth || source.naturalWidth || source.width;
    full.height = source.videoHeight || source.naturalHeight || source.height;
    full.getContext("2d").drawImage(source, 0, 0, full.width, full.height);
    var srcData = full.getContext("2d").getImageData(0, 0, full.width, full.height);

    var topW = dist(corners.tl, corners.tr), bottomW = dist(corners.bl, corners.br);
    var leftH = dist(corners.tl, corners.bl), rightH = dist(corners.tr, corners.br);
    var outW = Math.max(topW, bottomW), outH = Math.max(leftH, rightH);
    var scale = Math.min(1, OUTPUT_MAX_DIM / Math.max(outW, outH));
    outW = Math.max(1, Math.round(outW * scale));
    outH = Math.max(1, Math.round(outH * scale));

    var dstCorners = [
      { x: 0, y: 0 }, { x: outW, y: 0 }, { x: outW, y: outH }, { x: 0, y: outH },
    ];
    var srcCorners = [corners.tl, corners.tr, corners.br, corners.bl];
    // H maps DEST -> SRC (we sample source once per destination pixel).
    var H = computeHomography(dstCorners, srcCorners);
    if (!H) return null;

    var out = document.createElement("canvas");
    out.width = outW; out.height = outH;
    var octx = out.getContext("2d");
    var outData = octx.createImageData(outW, outH);
    for (var y = 0; y < outH; y++) {
      for (var x = 0; x < outW; x++) {
        var sp = applyHomography(H, x, y);
        var di = (y * outW + x) * 4;
        if (!sp) { outData.data[di + 3] = 0; continue; }
        var px = sampleBilinear(srcData, sp.x, sp.y);
        outData.data[di] = px[0]; outData.data[di + 1] = px[1]; outData.data[di + 2] = px[2]; outData.data[di + 3] = 255;
      }
    }
    octx.putImageData(outData, 0, 0);
    return out;
  }

  /** Detect + warp in one call. Always succeeds: falls back to the untouched frame when no
   * confident quad is found, so callers never need their own fallback branch. */
  function autoCrop(source) {
    var corners = detectCorners(source, WORK_MAX_DIM);
    if (corners) {
      var warped = warpToRect(source, corners);
      if (warped) return { canvas: warped, corners: corners, cropped: true };
    }
    var full = document.createElement("canvas");
    full.width = source.videoWidth || source.naturalWidth || source.width;
    full.height = source.videoHeight || source.naturalHeight || source.height;
    full.getContext("2d").drawImage(source, 0, 0, full.width, full.height);
    return { canvas: full, corners: null, cropped: false };
  }

  function canvasToJpegFile(canvas, filename, quality) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (blob) {
        resolve(new File([blob], filename, { type: "image/jpeg" }));
      }, "image/jpeg", quality == null ? 0.9 : quality);
    });
  }

  global.DocumentScanner = {
    detectCorners: detectCorners,
    warpToRect: warpToRect,
    autoCrop: autoCrop,
    canvasToJpegFile: canvasToJpegFile,
    PREVIEW_MAX_DIM: PREVIEW_MAX_DIM,
  };
})(window);
