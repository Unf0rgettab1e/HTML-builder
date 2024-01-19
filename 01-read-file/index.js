const fs = require('fs');
const path = require('path');
const readable = fs.createReadStream(path.join(__dirname, '/text.txt'));
readable.pipe(process.stdout);
