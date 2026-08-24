const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'src', 'App.js');
const source = fs.readFileSync(appPath, 'utf8');

const envLine = 'const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;';
const directLine = 'const BACKEND_URL = "https://naengineering121212-cx6xwffo2-naengineering12s-projects.vercel.app";';

if (source.includes(envLine)) {
  fs.writeFileSync(appPath, source.replace(envLine, directLine), 'utf8');
  console.log('Frontend chat backend URL locked to the deployed backend.');
} else {
  console.log('Backend URL already patched; no change needed.');
}
