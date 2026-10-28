import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = fileURLToPath(new URL("..", import.meta.url));
const publicDir = join(root, "public");
const logoDir = join(publicDir, "assets", "logo");
const logoSource = join(logoDir, "Aurasoli-logo.png");
const iconSource = join(logoDir, "Aurasoli-icon.png");

for (const source of [logoSource, iconSource]) {
  if (!existsSync(source)) {
    throw new Error(`Missing source image: ${source}`);
  }
}

const generated = [];

async function writeImage(pipeline, relativePath) {
  const file = join(publicDir, relativePath);
  await pipeline.png({ compressionLevel: 9 }).toFile(file);
  generated.push(file);
}

await mkdir(logoDir, { recursive: true });

// Optimized logo variants. The 1400x404 source stays untouched.
for (const width of [352, 704]) {
  const name = `assets/logo/Aurasoli-logo-${width}`;
  await sharp(logoSource)
    .resize({ width })
    .avif({ quality: 60, effort: 6 })
    .toFile(join(publicDir, `${name}.avif`));
  generated.push(join(publicDir, `${name}.avif`));

  await sharp(logoSource)
    .resize({ width })
    .webp({ quality: 85 })
    .toFile(join(publicDir, `${name}.webp`));
  generated.push(join(publicDir, `${name}.webp`));

  await writeImage(sharp(logoSource).resize({ width }), `${name}.png`);
}

// Open Graph image: dark background with a centered clay glow and the logo.
const glow = `
  <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="glow" cx="50%" cy="50%" r="58%">
        <stop offset="0%" stop-color="#C66B4E" stop-opacity="0.16" />
        <stop offset="100%" stop-color="#C66B4E" stop-opacity="0" />
      </radialGradient>
    </defs>
    <rect width="1200" height="630" fill="#0B0C0F" />
    <rect width="1200" height="630" fill="url(#glow)" />
  </svg>
`;
const ogLogo = await sharp(logoSource)
  .resize({ width: 620 })
  .png()
  .toBuffer({ resolveWithObject: true });
const ogLogoLeft = Math.round((1200 - 620) / 2);
const ogLogoTop = Math.round((630 - ogLogo.info.height) / 2);
await writeImage(
  sharp(Buffer.from(glow)).composite([
    { input: ogLogo.data, left: ogLogoLeft, top: ogLogoTop },
  ]),
  "og-image.png",
);

// Opaque app icons generated from the monogram.
const iconTargets = [
  ["favicon-32x32.png", 32],
  ["apple-touch-icon.png", 180],
  ["icon-192.png", 192],
  ["icon-512.png", 512],
];
for (const [file, size] of iconTargets) {
  await writeImage(
    sharp(iconSource)
      .resize(size, size, { fit: "contain", background: "#0B0C0F" })
      .flatten({ background: "#0B0C0F" }),
    file,
  );
}

const manifest = {
  name: "Aurasoli",
  short_name: "Aurasoli",
  start_url: "/",
  display: "standalone",
  background_color: "#0B0C0F",
  theme_color: "#0B0C0F",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
};
const manifestFile = join(publicDir, "site.webmanifest");
await writeFile(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
generated.push(manifestFile);

console.log("Generated assets:");
for (const file of generated) {
  console.log(`  ${file.slice(root.length)}`);
}
