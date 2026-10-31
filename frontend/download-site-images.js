// Download and self-host the site's photographic assets during the Vercel build.
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const sourceDirs = [path.join(root, "src"), path.join(root, "public")];
const outDir = path.join(root, "public", "images", "optimized");
const sourceFiles = [];

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\\.(js|jsx|ts|tsx|html|json|css)$/i.test(entry.name)) sourceFiles.push(full);
  }
}
sourceDirs.forEach(walk);

const unsplashIds = new Set();
const pexelsIds = new Set();
for (const file of sourceFiles) {
  const content = fs.readFileSync(file, "utf8");
  for (const match of content.matchAll(/photo-([0-9]{10,})/g)) unsplashIds.add(match[1]);
  for (const match of content.matchAll(/\\bim\\s*:\\s*["']([0-9]{10,})["']/g)) unsplashIds.add(match[1]);
  for (const match of content.matchAll(/images\\.pexels\\.com\\/photos\\/([0-9]+)\\/pexels-photo-\\1\\.jpeg/g)) pexelsIds.add(match[1]);
}

fs.mkdirSync(outDir, { recursive: true });

async function download(url, destination) {
  if (fs.existsSync(destination) && fs.statSync(destination).size > 3000) return "cached";
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(18000) });
    if (!response.ok) throw new Error("HTTP " + response.status);
    const type = response.headers.get("content-type") || "";
    if (!type.startsWith("image/")) throw new Error("Unexpected content type " + type);
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.length < 1500) throw new Error("Image response too small");
    fs.writeFileSync(destination, bytes);
    return "downloaded";
  } catch (error) {
    console.warn("[site-images] Could not download " + path.basename(destination) + ": " + error.message);
    return "failed";
  }
}

async function runPool(items, limit, worker) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (next < items.length) {
      const index = next++;
      await worker(items[index]);
    }
  });
  await Promise.all(workers);
}

(async () => {
  const tasks = [];
  for (const id of unsplashIds) {
    const file = path.join(outDir, "unsplash-" + id + ".webp");
    const url = "https://images.unsplash.com/photo-" + id + "?fit=crop&w=1100&q=62&fm=webp";
    tasks.push({ url, file });
  }
  for (const id of pexelsIds) {
    const file = path.join(outDir, "pexels-" + id + ".webp");
    const url = "https://images.pexels.com/photos/" + id + "/pexels-photo-" + id + ".jpeg?auto=compress&cs=tinysrgb&w=1100&fm=webp&q=62";
    tasks.push({ url, file });
  }
  let downloaded = 0, cached = 0, failed = 0;
  await runPool(tasks, 6, async task => {
    const result = await download(task.url, task.file);
    if (result === "downloaded") downloaded++;
    else if (result === "cached") cached++;
    else failed++;
  });
  console.log("[site-images] " + downloaded + " downloaded, " + cached + " cached, " + failed + " failed; " + tasks.length + " total assets.");
  if (!fs.existsSync(path.join(outDir, "unsplash-1508450859948-4e04fabaa4ea.webp"))) {
    console.warn("[site-images] Homepage hero image is not locally available; runtime may fall back to the original source.");
  }
})().catch(error => {
  console.warn("[site-images] Non-fatal image preparation error:", error.message);
});
