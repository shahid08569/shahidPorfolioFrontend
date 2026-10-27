const fs = require('fs');
const path = require('path');

const browserDir = path.join(__dirname, '..', 'dist', 'shahid-portfolio-ui', 'browser');
const csrFile = path.join(browserDir, 'index.csr.html');
const indexFile = path.join(browserDir, 'index.html');

if (fs.existsSync(csrFile)) {
  fs.copyFileSync(csrFile, indexFile);
  console.log('✓ Successfully created index.html from index.csr.html for SPA routing');
} else {
  console.log('Notice: index.csr.html not found, verifying index.html exists:', fs.existsSync(indexFile));
}
