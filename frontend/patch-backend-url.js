const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
const envPath = path.join(__dirname, '.env.production');
const source = fs.readFileSync(appPath, 'utf8');

// Frontend and backend are deployed as separate Vercel projects. Keep the
// frontend chat pointed at the live backend deployment instead of same-origin
// /api routes, which belong to a different Vercel project.
const BACKEND_ORIGIN = 'https://naengineering121212-cx6xwffo2-naengineering12s-projects.vercel.app';
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
  console.log('Frontend API base already points to the live backend.');
} else {
  console.warn('Frontend API base line not found; build will use the checked-in App.js value.');
}

// Keep the production value in sync as a fallback for any code that reads it.
fs.writeFileSync(
  envPath,
  `REACT_APP_BACKEND_URL=${BACKEND_ORIGIN}\nREACT_APP_API_URL=${BACKEND_ORIGIN}/api\n`,
  'utf8'
);
console.log('Production backend environment values set to the live backend.');
