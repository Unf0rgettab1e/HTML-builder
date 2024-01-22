const {
  promises: fsPromises,
  createReadStream,
  createWriteStream,
} = require('fs');
const path = require('path');

const projDistPath = path.join(__dirname, 'project-dist');
const stylesPath = path.join(__dirname, 'styles');
const distStylesPath = path.join(projDistPath, 'style.css');
const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const indexHtmlPath = path.join(projDistPath, 'index.html');

const createDir = async (dirPath) => {
  try {
    await fsPromises.rm(dirPath, { recursive: true, force: true });
    await fsPromises.mkdir(dirPath, { recursive: true });
    console.log('createDir');
  } catch (err) {
    console.error(err.message);
  }
};

const mergeStyles = async (from, to) => {
  try {
    const writeStream = createWriteStream(to);
    const readStyleFiles = await fsPromises.readdir(from, {
      withFileTypes: true,
    });

    readStyleFiles.forEach((file) => {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const readStylesStream = createReadStream(path.join(from, file.name));
        readStylesStream.pipe(writeStream);
      }
    });
    console.log('mergeStyles');
  } catch (err) {
    console.error(err.message);
  }
};

const buildDocumentByTemplate = async (
  fromTemplate,
  toDistIndex,
  byComponents,
) => {
  try {
    let data = await fsPromises.readFile(fromTemplate, { encoding: 'utf-8' });
    var regex = /\{\{(\w+)\}\}/g;
    const templateTags = [];
    let tag;
    while ((tag = regex.exec(data)) !== null) {
      if (!templateTags.find((it) => it[0] === tag[0])) templateTags.push(tag);
    }
    for (let tag of templateTags) {
      const templates = await fsPromises.readdir(byComponents);
      for (let file of templates) {
        const parseFile = path.parse(file);
        if (parseFile.name === tag[1] && parseFile.ext === '.html') {
          const templateContent = await fsPromises.readFile(
            path.join(byComponents, file),
            { encoding: 'utf-8' },
          );
          data = data.replaceAll(tag[0], templateContent);
        }
      }
    }
    await fsPromises.writeFile(toDistIndex, data);
    console.log('buildDocumentByTemplate');
  } catch (err) {
    console.error(err.message);
  }
};

const buildProjectDist = async () => {
  await createDir(projDistPath);
  await buildDocumentByTemplate(templatePath, indexHtmlPath, componentsPath);
  await mergeStyles(stylesPath, distStylesPath);
};

buildProjectDist();
