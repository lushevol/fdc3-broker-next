import fs from 'fs';
import YAML from 'yaml';

export function readYmlFile(path) {
  try {
    console.log('📚 Reading yaml file from path: ' + path);
    const fileContents = fs.readFileSync(path, 'utf-8');
    const data = YAML.parse(fileContents);
    console.dir(data, { depth: null });
    return data;
} catch (err) {
    console.error('❌ Error reading YML file: ', err);
  }
}
