import fs from 'fs';

const sourceFolderPath = 'public/fonts/';
const destinationFolderPath = 'dist/assets/fonts/';

try {
  fs.cpSync(sourceFolderPath, destinationFolderPath, {
    recursive: true,
  });
} catch (error) {
  console.log(error.message);
}