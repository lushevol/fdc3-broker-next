import fs from 'fs';
import path from "path";

export function createTmpDirectory(dirName, errHandler) {
          // To ensure clean installation, we first clean the tmp file if it exists
    const tmpDirectory = path.join(dirName, 'tmp');
    console.log('🛠️ Cleaning up tmp directory.');
    if (fs.existsSync(tmpDirectory)) {
      fs.rmSync(tmpDirectory, { recursive: true }, errHandler);
    }
    fs.mkdirSync(tmpDirectory, { recursive: true }, errHandler);
    console.log('🛠️ Created tmp directory to stage files.');
    return tmpDirectory;    
}

export function cleanupTmpDirectory(tmpdirPath, errHandler) {
    console.log('🗑️ Cleaning up tmp staging directory...');
    fs.rmSync(tmpdirPath, { recursive: true }, errHandler);
}