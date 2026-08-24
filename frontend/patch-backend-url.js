const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
const envPath = path.join(__dirname, '.env.production');
const source = fs.readFileSync(appPath, 'utf8');

const envLine = 'const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;';
const directLine = 'const BACKEND_URL = window.location.origin;';

// Use the same-origin Vercel deployment for API calls. This keeps /api/chat
// behind the vercel.json rewrite and avoids pinning the frontend to an old
// deployment-specific backend hostname.
if (source.includes(envLine)) {
  fs.writeFileSync(appPath, source.replace(envLine, directLine), 'utf8');
  console.log('Frontend API base locked to the current deployment origin.');
} else {
  console.log('Frontend API base already patched; no change needed.');
}

// Keep production env values empty because App.js now intentionally uses the
// current browser origin. This prevents an obsolete backend deployment URL
// from being embedded in a future build.
fs.writeFileSync(
  envPath,
  'REACT_APP_BACKEND_URL=\nREACT_APP_API_URL=\n',
  'utf8'
);
console.log('Production backend environment values cleared.');
