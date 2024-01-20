const fs = require('fs');
const path = require('path');

const displayFileInfo = (file) => {
  fs.stat(path.join(file.path, file.name), (err, stats) => {
    if (err) console.log(err);
    const fileData = path.parse(file.name);
    console.log(
      `${fileData.name} - ${fileData.ext.slice(1)} - ${stats.size / 1000}kb`,
    );
  });
};

fs.readdir(
  path.join(__dirname, '/secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) console.log(err);
    else {
      files.forEach((file) => {
        if (file.isFile()) {
          displayFileInfo(file);
        }
      });
    }
  },
);
