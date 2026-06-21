const fs = require('fs');
let content = fs.readFileSync('form.js', 'utf8');
content = content.replace(/\\\$\{/g, '${');
fs.writeFileSync('form.js', content, 'utf8');
