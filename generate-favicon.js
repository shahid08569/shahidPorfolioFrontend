const fs = require('fs');
const path = require('path');

// 1. Generate premium SVG Logo / Favicon
const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <defs>
    <!-- Dark Architectural Canvas Gradient -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#0B1120" />
      <stop offset="100%" stop-color="#020617" />
    </linearGradient>

    <!-- Metallic Emerald-Cyan-Purple Glow Rim -->
    <linearGradient id="rimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981" />
      <stop offset="50%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#6366F1" />
    </linearGradient>

    <!-- Primary S Brand Gradient -->
    <linearGradient id="brandGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34D399" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>

    <!-- Secondary S Brand Gradient -->
    <linearGradient id="brandGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#818CF8" />
    </linearGradient>

    <!-- Outer Ambient Glow -->
    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Base Rounded Squircle with Subtle Metallic Border -->
  <rect
    x="24"
    y="24"
    width="464"
    height="464"
    rx="112"
    fill="url(#bgGrad)"
    stroke="url(#rimGrad)"
    stroke-width="7"
  />

  <!-- Subtle Ambient Glow Ring -->
  <circle cx="256" cy="256" r="160" fill="#06B6D4" opacity="0.06" filter="url(#softGlow)" />

  <!-- Code Bracket Architectural Accent (Subtle watermark) -->
  <path
    d="M 120 220 L 88 256 L 120 292"
    stroke="#334155"
    stroke-width="12"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    opacity="0.35"
  />
  <path
    d="M 392 220 L 424 256 L 392 292"
    stroke="#334155"
    stroke-width="12"
    stroke-linecap="round"
    stroke-linejoin="round"
    fill="none"
    opacity="0.35"
  />

  <!-- The "S" Architectural Monogram for SHAHID -->
  <g>
    <!-- Top Flowing Segment of "S" -->
    <path
      d="M 172 176
         L 320 176
         C 356 176, 368 202, 350 230
         L 326 264
         C 316 278, 298 288, 276 288
         L 236 288
         C 214 288, 196 298, 186 312
         L 162 346"
      stroke="url(#brandGrad1)"
      stroke-width="50"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Bottom Flowing Segment of "S" -->
    <path
      d="M 340 336
         L 192 336
         C 156 336, 144 310, 162 282
         L 186 248
         C 196 234, 214 224, 236 224
         L 276 224
         C 298 224, 316 214, 326 200
         L 350 166"
      stroke="url(#brandGrad2)"
      stroke-width="50"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    />

    <!-- Signature Cyan Pulse Node (Top-Right Accent) -->
    <circle cx="396" cy="116" r="20" fill="#38BDF8" filter="url(#softGlow)" />
    <circle cx="396" cy="116" r="10" fill="#FFFFFF" />
  </g>
</svg>
`;

// Save SVG to public directory
const publicDir = path.join(__dirname, 'public');
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), svgLogo, 'utf8');
fs.writeFileSync(path.join(publicDir, 'logo.svg'), svgLogo, 'utf8');
console.log('Saved favicon.svg and logo.svg');

// 2. Build multi-resolution ICO file in pure Node.js (32x32 and 16x16)
function createIco(sizes) {
  const images = sizes.map(size => {
    const width = size;
    const height = size;
    const pixelCount = width * height;
    const xorSize = pixelCount * 4;
    const andSize = Math.ceil(pixelCount / 8);
    const dibSize = 40 + xorSize + andSize;

    const xorBuffer = Buffer.alloc(xorSize);
    const andBuffer = Buffer.alloc(andSize, 0); // 0 means visible in 32-bit RGBA

    // Render 32-bit BGRA pixels (Bottom-to-Top in DIB)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const flippedY = height - 1 - y; // Bottom-up
        const offset = (flippedY * width + x) * 4;

        // Coordinates normalized [0, 1]
        const nx = x / (width - 1);
        const ny = y / (height - 1);

        // Distance from center for rounded squircle mask
        const dx = Math.abs(nx - 0.5) * 2;
        const dy = Math.abs(ny - 0.5) * 2;
        const squircleDist = Math.pow(dx, 4) + Math.pow(dy, 4);

        if (squircleDist > 1.1) {
          // Transparent outside squircle
          xorBuffer[offset] = 0;
          xorBuffer[offset + 1] = 0;
          xorBuffer[offset + 2] = 0;
          xorBuffer[offset + 3] = 0;
        } else {
          // Inside squircle base: Deep dark slate (#0F172A)
          let b = 0x2A, g = 0x17, r = 0x0F, a = 0xFF;

          // Border rim (squircleDist between 0.85 and 1.05)
          if (squircleDist >= 0.82 && squircleDist <= 1.08) {
            // Emerald to Sky Gradient rim
            r = Math.round(16 + nx * 40);
            g = Math.round(185 + ny * 5);
            b = Math.round(129 + nx * 100);
          }

          // "S" Monogram shape rendering
          // Top bar (y ~ 0.22 - 0.38, x ~ 0.25 - 0.75)
          const inTopBar = (ny >= 0.24 && ny <= 0.38 && nx >= 0.25 && nx <= 0.75);
          // Bottom bar (y ~ 0.62 - 0.76, x ~ 0.25 - 0.75)
          const inBottomBar = (ny >= 0.62 && ny <= 0.76 && nx >= 0.25 && nx <= 0.75);
          // Middle bar (y ~ 0.43 - 0.57, x ~ 0.28 - 0.72)
          const inMidBar = (ny >= 0.43 && ny <= 0.57 && nx >= 0.28 && nx <= 0.72);
          // Left vertical connecting mid and bottom (y ~ 0.50 - 0.70, x ~ 0.22 - 0.36)
          const inLeftStem = (ny >= 0.50 && ny <= 0.70 && nx >= 0.22 && nx <= 0.36);
          // Right vertical connecting top and mid (y ~ 0.30 - 0.50, x ~ 0.64 - 0.78)
          const inRightStem = (ny >= 0.30 && ny <= 0.50 && nx >= 0.64 && nx <= 0.78);

          // Accent dot at top right
          const dotDist = Math.hypot(nx - 0.82, ny - 0.20);
          const inDot = (dotDist < 0.08);

          if (inTopBar || inMidBar || inBottomBar || inLeftStem || inRightStem) {
            // S monogram gradient: Vibrant Emerald (#10B981) to Sky Cyan (#38BDF8)
            const t = (nx + ny) / 2;
            r = Math.round(16 * (1 - t) + 56 * t);
            g = Math.round(185 * (1 - t) + 189 * t);
            b = Math.round(129 * (1 - t) + 248 * t);
            a = 0xFF;
          } else if (inDot) {
            // Bright Cyan dot
            r = 0x38; g = 0xBD; b = 0xF8; a = 0xFF;
          }

          xorBuffer[offset] = b;     // Blue
          xorBuffer[offset + 1] = g; // Green
          xorBuffer[offset + 2] = r; // Red
          xorBuffer[offset + 3] = a; // Alpha
        }
      }
    }

    // BITMAPINFOHEADER (40 bytes)
    const bih = Buffer.alloc(40);
    bih.writeUInt32LE(40, 0);          // biSize
    bih.writeInt32LE(width, 4);         // biWidth
    bih.writeInt32LE(height * 2, 8);    // biHeight (XOR + AND mask)
    bih.writeUInt16LE(1, 12);           // biPlanes
    bih.writeUInt16LE(32, 14);          // biBitCount
    bih.writeUInt32LE(0, 16);           // biCompression (BI_RGB)
    bih.writeUInt32LE(xorSize + andSize, 20); // biSizeImage
    bih.writeInt32LE(0, 24);            // biXPelsPerMeter
    bih.writeInt32LE(0, 28);            // biYPelsPerMeter
    bih.writeUInt32LE(0, 32);           // biClrUsed
    bih.writeUInt32LE(0, 36);           // biClrImportant

    return {
      width,
      height,
      dibSize,
      data: Buffer.concat([bih, xorBuffer, andBuffer])
    };
  });

  // Calculate ICO Header + Directory
  const numImages = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(numImages, 4);

  const dirEntries = [];
  let currentOffset = 6 + (16 * numImages);

  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.width === 256 ? 0 : img.width, 0);
    entry.writeUInt8(img.height === 256 ? 0 : img.height, 1);
    entry.writeUInt8(0, 2); // Color palette
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Planes
    entry.writeUInt16LE(32, 6); // Bit count
    entry.writeUInt32LE(img.dibSize, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // Offset
    dirEntries.push(entry);
    currentOffset += img.dibSize;
  }

  const allBuffers = [header, ...dirEntries, ...images.map(img => img.data)];
  return Buffer.concat(allBuffers);
}

const icoBuffer = createIco([48, 32, 16]);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('Saved multi-resolution favicon.ico (' + icoBuffer.length + ' bytes)');
