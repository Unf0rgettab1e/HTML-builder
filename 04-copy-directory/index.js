const fs = require('fs');
const path = require('path');

const copyFilesToDist = () => {
  fs.readdir(path.join(__dirname, 'files'), (err, files) => {
    if (err) console.error(err.message);
    files.forEach((file) => {
      fs.copyFile(
        path.join(__dirname, 'files', file),
        path.join(__dirname, 'files-copy', file),
        (err) => {
          if (err) console.error(err.message);
        },
      );
    });
  });
};

const createCopyFolder = () => {
  fs.rm(
    path.join(__dirname, 'files-copy'),
    { recursive: true, force: true },
    (err) => {
      if (err) console.error(err.message);
      fs.mkdir(
        path.join(__dirname, 'files-copy'),
        { recursive: true },
        (err) => {
          if (err) console.error(err.message);
          copyFilesToDist();
        },
      );
    },
  );
};

createCopyFolder();
