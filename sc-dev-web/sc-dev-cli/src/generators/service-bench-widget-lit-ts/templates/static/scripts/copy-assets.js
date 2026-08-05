import fs from 'fs';

const sourceFolderPath = 'src/assets/';
const destinationFolderPath = 'dist/src/assets/';

try {
  fs.cpSync(sourceFolderPath, destinationFolderPath, {
    recursive: true,
  });
} catch (error) {
  console.log(error.message);
}