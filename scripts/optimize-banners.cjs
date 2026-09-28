// Requires sharp (available in the bundled Node runtime via NODE_PATH).
const sharp = require('sharp');
const fs = require('node:fs/promises');
const path = require('node:path');
const root = path.resolve(__dirname, '../assets/courses');

(async () => {
  const report = [];
  for (let grade = 3; grade <= 9; grade++) {
    const stem = `ipass-${grade}-banner`;
    const original = path.join(root, `${stem}.png`);
    const { width, height } = await sharp(original).metadata();
    // Match the existing mobile object-position: 80% 30%, at a 4:3 ratio.
    const cropWidth = Math.floor(height * 4 / 3);
    const crop = { left: Math.round((width - cropWidth) * .8), top: 0, width: cropWidth, height };
    const variants = [
      { suffix: '', width, mobile: false },
      { suffix: '-1000', width: 1000, mobile: false },
      { suffix: '-mobile', width: 1200, mobile: true },
      { suffix: '-mobile-800', width: 800, mobile: true }
    ];
    const row = { grade, original: (await fs.stat(original)).size };
    for (const variant of variants) {
      let pipeline = sharp(original);
      if (variant.mobile) pipeline = pipeline.extract(crop);
      const target = path.join(root, `${stem}${variant.suffix}.webp`);
      await pipeline.resize({ width: variant.width }).webp({ quality: 82, effort: 6 }).toFile(target);
      row[variant.suffix || 'desktop'] = (await fs.stat(target)).size;
    }
    report.push(row);
  }
  console.log(JSON.stringify(report, null, 2));
})().catch(error => { console.error(error); process.exitCode = 1; });
