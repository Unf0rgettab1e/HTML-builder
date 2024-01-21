const fsPromises = require('fs/promises');
const { createReadStream, createWriteStream } = require('fs');
const path = require('path');

const toBundleWriteStream = createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

const mergeStyles = async () => {
  try {
    const readStyleFiles = await fsPromises.readdir(
      path.join(__dirname, 'styles'),
      { withFileTypes: true },
    );

    readStyleFiles.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const readStylesStream = createReadStream(
          path.join(__dirname, 'styles', file.name),
        );
        readStylesStream.pipe(toBundleWriteStream);
      }
    });
  } catch (err) {
    console.error(err);
  }
};

mergeStyles();
