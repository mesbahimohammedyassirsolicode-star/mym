import sharp from "sharp";

const width = 1200;
const height = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <defs>
    <radialGradient id="glow" cx="78%" cy="12%" r="72%">
      <stop offset="0%" stop-color="#c66b4e" stop-opacity="0.35"/>
      <stop offset="60%" stop-color="#c66b4e" stop-opacity="0.06"/>
      <stop offset="100%" stop-color="#0b0c0f" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0V48" fill="none" stroke="#ffffff" stroke-opacity="0.05" stroke-width="1"/>
    </pattern>
  </defs>

  <rect width="${width}" height="${height}" fill="#0b0c0f"/>
  <rect width="${width}" height="${height}" fill="url(#grid)"/>
  <rect width="${width}" height="${height}" fill="url(#glow)"/>

  <rect x="72" y="84" width="56" height="6" rx="3" fill="#c66b4e"/>
  <text x="72" y="150" font-family="Segoe UI, Arial, sans-serif" font-size="26" letter-spacing="4" fill="#c66b4e" font-weight="600">DIGITAL SOLUTIONS</text>

  <text x="70" y="310" font-family="Segoe UI, Arial, sans-serif" font-size="118" font-weight="700" fill="#f4f4f5">Make Your</text>
  <text x="70" y="438" font-family="Segoe UI, Arial, sans-serif" font-size="118" font-weight="700" fill="#c66b4e">Move.</text>

  <text x="72" y="510" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#a1a1aa">Web Development · Automation · SEO · Brand Design</text>

  <text x="72" y="576" font-family="Segoe UI, Arial, sans-serif" font-size="30" font-weight="700" fill="#f4f4f5">Aurasoli</text>
  <text x="250" y="576" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#a1a1aa">aura-soli.online</text>
</svg>`;

await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile("public/og-image.png");

console.log("wrote public/og-image.png");
