const fs = require("fs");
const path = require("path");

const sourcePath = path.join(__dirname, "na-engineering-logo.webp.base64");
const outputPath = path.join(__dirname, "public", "logo-gradient-transparent-v2.webp");

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
console.log(`Prepared optimized brand logo (${image.length} bytes): public/logo-20261019.webp`);

const faviconSourcePath = path.join(__dirname, "favicon-32.png.base64");
const faviconOutputPath = path.join(__dirname, "public", "na-engineering-favicon-v2.png");
const faviconEncoded = fs.readFileSync(faviconSourcePath, "utf8").replace(/\\s+/g, "");
const favicon = Buffer.from(faviconEncoded, "base64");
const isPng =
  favicon.length > 8 &&
  favicon.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));

if (!isPng) {
  throw new Error("Favicon source is not a valid PNG image.");
}

fs.writeFileSync(faviconOutputPath, favicon);
console.log(`Prepared transparent favicon (${favicon.length} bytes): public/na-engineering-favicon-v2.png`);
