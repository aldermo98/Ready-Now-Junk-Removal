const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "assets"); // change to public/assets if needed

const jobs = [
  { src: "img/project/01.webp", w: 400, q: 65 },
  { src: "img/project/02.webp", w: 400, q: 65 },
  { src: "img/project/03.webp", w: 400, q: 65 },
  { src: "img/project/04.webp", w: 400, q: 65 },
  { src: "img/about/01.webp", w: 454, q: 70 },
  { src: "img/about/02.webp", w: 195, q: 70 },
];

(async () => {
  for (const { src, w, q } of jobs) {
    const fullSrc = path.join(root, src);
    if (!fs.existsSync(fullSrc)) {
      console.warn(`⚠️  Skipping: ${fullSrc} not found`);
      continue;
    }
    const dir = path.dirname(fullSrc);
    const base = path.basename(fullSrc, path.extname(fullSrc));
    const tmp = path.join(dir, `${base}-tmp.webp`);

    // create optimized temp
    await sharp(fullSrc)
      .resize({ width: w })
      .webp({ quality: q })
      .toFile(tmp);

    // remove old, then replace
    try {
      fs.rmSync(fullSrc, { force: true });
      fs.renameSync(tmp, fullSrc);
      console.log(`✅ Optimized ${src} → width ${w}, quality ${q}`);
    } catch (err) {
      console.error(`❌ Could not replace ${src}:`, err.message);
    }
  }
})();
