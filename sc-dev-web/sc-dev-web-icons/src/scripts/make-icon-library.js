import path from 'path';
import fs from 'fs';

let sourcePath;
let targetPath;
const targetFileTypes = ['.svg'];
const iconMap = {};

function scanFile(_path, level, library = 'default') {
  const data = fs.statSync(_path);
  if (data && data.isDirectory()) {
    const folderName = path.basename(_path);
    console.log(_path);
    const libraryName = level ? folderName : library;
    const paths = fs.readdirSync(_path);
    paths.forEach(pathName => {
      const absolutePath = path.join(_path, pathName);
      scanFile(absolutePath, level + 1, libraryName);
    });
    if (level === 0) generateTargetFile();
  } else if (data && data.isFile()) {
    const need_write =  isTargetFile(_path, targetFileTypes);
    if (need_write) {
      const pure_file_name = path.basename(_path, path.extname(_path));
      const data = fs.readFileSync(_path, 'utf-8');
      const pathKey = library ? library : 'default';

      if (!(pathKey in iconMap)) {
        iconMap[pathKey] = [];
      }
      if (!iconMap[pathKey].find(item => item.name === pure_file_name)) {
        iconMap[pathKey].push({ name: pure_file_name, content: data });
      }
    }
  }
}

function kebabToPascalCase(text) {
  return text.replace(/(^\w|-\w|--\w)/g, clearDashAndCapitalise);
}

function clearDashAndCapitalise(text) {
  return text.replace(/-/g, "").toUpperCase();
}

function generateTargetFile() {
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true }, err => {
      if (err) {
        console.error(err);
        return;
      }
      else console.log('Path created!')
    });
  }
  Object.keys(iconMap).map(library => {
    const fileList = iconMap[library];
    const targetFileName = `${kebabToPascalCase(library)}IconLibrary`;
    const iconList = fileList.map(content => `'${content.name}': \`\n${content.content}\``);
    const libraryData = `export const Icons = {\n${iconList.join(',\n')}\n};\n
export const ${targetFileName} = {
  name: '${library}',
  resolver: (name: keyof typeof Icons) => {
    if (name in Icons) {
      return \`data:image/svg+xml,\${encodeURIComponent(Icons[name])}\`;
    }
    return '';
  }
};\n
export default ${targetFileName};
`;

    const targetLibFile = path.join(targetPath, `${targetFileName}.ts`);
    fs.writeFileSync(targetLibFile, libraryData, { flag: 'w', encoding: 'utf-8', mode: '0666' }, err => {
      if (err) {
        console.log("Failed to write to " + targetLibFile);
      } else {
        console.log(targetLibFile + " created successfully");
      }
    });
  });
}

function isTargetFile(_path, allowFileExts) {
  const ext  =  path.extname(_path);
  return allowFileExts.includes(ext, 0);
}

let args = {};
let last;
process.argv.forEach((a, idx) => {
  if(idx > 1){
    if(last){
      args[last] = a;
      last = undefined;
    }
    else if(!last && a.match(/-\w+/))
      last = a;
  }
});
if ('-i' in args) sourcePath = args['-i'];
if ('-o' in args) targetPath = args['-o'];

if (targetPath && sourcePath) scanFile(sourcePath, 0);