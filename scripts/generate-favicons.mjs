/**
 * Derives the favicon set from the supplied Aurasoli monogram.
 * Run with `node scripts/generate-favicons.mjs` after replacing the source art.
 */
import { readFileSync } from "node:fs";
import sharp from "sharp";

const SOURCE = "public/assets/logo/Aurasoli-icon.png";
const BACKGROUND = "#0b0c0f";

const source = readFileSync(SOURCE);

async function writeIcon(size, file, flatten = false) {
  let pipeline = sharp(source).resize(size, size, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });

  if (flatten) {
    pipeline = pipeline.flatten({ background: BACKGROUND });
  }

  await pipeline.png({ compressionLevel: 9 }).toFile(file);
  console.log(`[favicons] ${file} (${size}x${size})`);
}

await writeIcon(16, "public/favicon-16.png");
await writeIcon(32, "public/favicon-32.png");
await writeIcon(180, "public/apple-touch-icon.png", true);
