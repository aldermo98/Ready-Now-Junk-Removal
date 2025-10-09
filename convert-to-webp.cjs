const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

async function walk(dir, exts = [".jpg", ".jpeg", ".png"]) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) await walk(full, exts);
    else if (exts.includes(path.extname(file).toLowerCase())) {
      const out = full.replace(path.extname(full), ".webp");
      await sharp(full).webp({ quality: 80 }).toFile(out);
      console.log("Converted →", out);
    }
  }
}
walk(path.resolve("assets"));
