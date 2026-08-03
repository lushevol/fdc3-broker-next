import path from 'path';
import fs from 'fs';

const sourcePath = path.join("assets/icons/");
const targetPath = path.join("src/assets/icons/");
const targetExportFile = path.join("src/assets/Icons.ts");
const prefixData = "import { html } from 'lit';\n\nexport default html`\n";
const postfixData = "\n`;";

function scanFile(_path, level) {
  const data = fs.statSync(_path);
  if (data && data.isDirectory()) {
    console.log("read folder " + _path);
    const paths = fs.readdirSync(_path);
    paths.forEach(filename => {
      const absolutePath = path.join(_path, filename);
      scanFile(absolutePath, level + 1);
    });
    if (level === 0) scanTargetFile();
  } else if (data && data.isFile()) {
    writeFile(_path);
  }
}

function scanTargetFile() {
  console.log('Start generate ts');
  let importList = [], exportList = [];
  fs.readdir(targetPath,(err, paths)=>{
    if (err) return;
    for (let index = 0; index < paths.length; index++) {
      const m_path = paths[index];
      const next_path = path.join(targetPath, m_path);

      const need_write =  isTargetFile(next_path, ['.ts']);
      if (!need_write) return;

      const ext  =  path.extname(next_path);
      const pure_file_name = path.basename(next_path, ext);
      console.log(pure_file_name);

      importList.push(`import ${pure_file_name} from './icons/${pure_file_name}.js';`);
      exportList.push(pure_file_name);
    }
    const iconFileData = `${importList.join('\n')}\n\nconst Icons = {\n${exportList.join(',\n')}\n};\n\nexport default Icons;`;
    // console.log(iconFileData);
    fs.writeFileSync(targetExportFile, iconFileData, { flag: 'w', encoding: 'utf-8', mode: '0666' }, err => {
      if (err) {
        console.log("Failed to write to " + targetExportFile);
      } else {
        console.log(targetExportFile + " created successfully");
      }
    });
  });
}

function isTargetFile(_path, allowFileExts) {
  const ext  =  path.extname(_path);
  return allowFileExts.includes(ext, 0);
}

function kebabToPascalCase(text) {
  return text.replace(/(^\w|-\w|--\w)/g, clearDashAndCapitalise);
}

function clearDashAndCapitalise(text) {
  return text.replace(/-/g, "").toUpperCase();
}

function writeFile(filePath) {
  let need_write =  isTargetFile(filePath, ['.svg']);
  if (need_write) {
    const pure_file_name = path.basename(filePath, path.extname(filePath));
    const data = fs.readFileSync(filePath, 'utf-8')
    const updateData = `${prefixData}${data}${postfixData}`;
    const targetFileName = `${kebabToPascalCase(pure_file_name)}.ts`;
    const targetFilePath = path.join(targetPath, targetFileName);
    if (!fs.existsSync(targetPath)) {
      fs.mkdirSync(targetPath, { recursive: true }, err => {
        if (err) {
          console.error(err);
          return;
        }
        else console.log('Path created!')
      });
    }
    // console.log(filePath);
    fs.writeFileSync(targetFilePath, updateData, { flag: 'w', encoding: 'utf-8', mode: '0666' }, err => {
      if (err) {
        console.log("Failed to write to " + targetFilePath);
      } else {
        console.log(targetFilePath + " created successfully");
      }
    });
  }
}

scanFile(sourcePath, 0);
scanTargetFile();