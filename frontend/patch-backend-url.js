const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// Vercel project-level build commands may call this preparation script directly.
// Run the photo downloader here so the local image assets exist before React builds.
const imagePrep = spawnSync(process.execPath, [path.join(__dirname, 'download-site-images.js')], { stdio: 'inherit' });
if (imagePrep.error || imagePrep.status !== 0) {
  console.warn('[site-images] Image preparation did not complete; remote photo fallbacks remain enabled.');
}

const appPath = path.join(__dirname, 'src', 'App.js');
const envPath = path.join(__dirname, '.env.production');
const source = fs.readFileSync(appPath, 'utf8');

// Frontend and backend are deployed as separate Vercel projects. Use the
// stable backend project URL rather than a deployment-specific URL.
const BACKEND_ORIGIN = 'https://naengineering121212-b.vercel.app';
const envLine = 'const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;';
const sameOriginLine = 'const BACKEND_URL = window.location.origin;';
const directLine = `const BACKEND_URL = '${BACKEND_ORIGIN}';`;

if (source.includes(envLine)) {
  fs.writeFileSync(appPath, source.replace(envLine, directLine), 'utf8');
  console.log(`Frontend API base locked to backend: ${BACKEND_ORIGIN}`);
} else if (source.includes(sameOriginLine)) {
  fs.writeFileSync(appPath, source.replace(sameOriginLine, directLine), 'utf8');
  console.log(`Frontend same-origin API base corrected to backend: ${BACKEND_ORIGIN}`);
} else if (source.includes(directLine)) {
  console.log('Frontend API base already points to the stable backend.');
} else {
  console.warn('Frontend API base line not found; build will use the checked-in App.js value.');
}

fs.writeFileSync(
  envPath,
  `REACT_APP_BACKEND_URL=${BACKEND_ORIGIN}\nREACT_APP_API_URL=${BACKEND_ORIGIN}/api\n`,
  'utf8'
);
console.log('Production backend environment values set to the stable backend.');
