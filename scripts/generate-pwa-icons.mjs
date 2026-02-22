#!/usr/bin/env node
/**
 * Génère pwa-192x192.png et pwa-512x512.png à partir de public/pwa-icon.svg.
 * Nécessite: npm install sharp --save-dev
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const publicDir = join(root, 'public');
const svgPath = join(publicDir, 'pwa-icon.svg');

async function main() {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch {
    console.warn('sharp non installé. Exécutez: npm install sharp --save-dev');
    console.warn('Ou ajoutez manuellement pwa-192x192.png et pwa-512x512.png dans public/');
    process.exit(0);
    return;
  }

  const svg = readFileSync(svgPath);
  for (const size of [192, 512]) {
    const out = join(publicDir, `pwa-${size}x${size}.png`);
    await sharp(svg)
      .resize(size, size)
      .png()
      .toFile(out);
    console.log(`Généré: ${out}`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
