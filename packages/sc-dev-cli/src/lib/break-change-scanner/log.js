import fs from 'fs';

let logStream;

export const startLog = (namePrefix = 'webkit-version-scanner') => {
  let hasDir = fs.existsSync('./.log');
  if (!hasDir) {
    try {
      fs.mkdirSync('./.log');
      hasDir = true;
    } catch (e) {
      hasDir = false;
    }
  }
  logStream = fs.createWriteStream(
    `${hasDir ? '.log/' : ''}.scdevkit-cli-${namePrefix}-${Date.now()}.log`,
    {
      flags: 'a',
      encoding: 'utf-8',
      autoClose: true,
    },
  );
};

export const logMessage = (message = '') => {
  if (!logStream || typeof message !== 'string') return;
  const timestamp = new Date().toISOString();
  const logEntry = `\n${timestamp} - ${message?.replace(/\x1b\[\d+m/g, '')}`;
  logStream.write(logEntry, 'utf-8', (e) => {
    e && console.error('logging error: ', e);
  });
};

process.on('exit', () => {
  logStream?.end();
});

process.on('SIGINT', () => {
  logStream?.end();
  process.exit();
});

process.on('SIGTERM', () => {
  logStream?.end();
  process.exit();
});
