const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "na-engineering-logo.webp.base64");
const outputPath = path.join(__dirname, "public", "logo-optimized.webp");

const encoded = fs.readFileSync(sourcePath, "utf8").replace(/\s+/g, "");
const image = Buffer.from(encoded, "base64");
const isWebP =
  image.length > 12 &&
  image.subarray(0, 4).toString("ascii") === "RIFF" &&
  image.subarray(8, 12).toString("ascii") === "WEBP";

if (!isWebP) {
  throw new Error("Optimized brand logo is not a valid WebP image.");
}

fs.writeFileSync(outputPath, image);
console.log(`Prepared optimized brand logo (${image.length} bytes): public/logo-optimized.webp`);
