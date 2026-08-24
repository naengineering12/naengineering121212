const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
const envPath = path.join(__dirname, '.env.production');
const source = fs.readFileSync(appPath, 'utf8');

const directUrl = 'https://naengineering121212-cx6xwffo2-naengineering12s-projects.vercel.app';
const envLine = 'const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;';
const directLine = `const BACKEND_URL = "${directUrl}";`;

// Make the production build independent of Vercel's environment-variable state.
if (source.includes(envLine)) {
  fs.writeFileSync(appPath, source.replace(envLine, directLine), 'utf8');
  console.log('Frontend chat backend URL locked to the deployed backend.');
} else {
  console.log('Backend URL already patched; no change needed.');
}

// The repository already contains a production env file; overwrite its backend
// endpoints at build time so an older backend URL cannot be embedded in CRA.
fs.writeFileSync(
  envPath,
  `REACT_APP_BACKEND_URL=${directUrl}\nREACT_APP_API_URL=${directUrl}\n`,
  'utf8'
);
console.log('Production environment backend URL synchronized.');
