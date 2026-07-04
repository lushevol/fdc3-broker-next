#!/usr/bin/env node

const { execSync } = require('child_process');
const os = require('os');

const PORTS = [
  8001,
  8002,
  8006,
  8007,
  3000,
  3001,
  8088,
  8080,
  8082,
  8084,
  8090,
  8091,
  8092,
  11210,
  11611,
  4173,
];

function killPort(port) {
  const platform = os.platform();
  let pids;

  try {
    if (platform === 'win32') {
      execSync(`netstat -ano | findstr :${port}`, { stdio: 'pipe' });
      const output = execSync(`netstat -ano`, { encoding: 'utf8' });
      const lines = output.split('\n').filter((line) => line.includes(`:${port}`));
      pids = new Set();
      for (const line of lines) {
        const match = line.trim().match(/\s+(\d+)\s*$/);
        if (match) {
          pids.add(match[1]);
        }
      }
    } else {
      const output = execSync(`lsof -ti:${port}`, { encoding: 'utf8' });
      pids = new Set(output.trim().split('\n').filter(Boolean));
    }
  } catch {
    return;
  }

  for (const pid of pids) {
    if (!pid || pid === '-' || pid === '0') continue;
    try {
      if (platform === 'win32') {
        execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
      } else {
        execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
      }
      console.log(`Killed process ${pid} on port ${port}`);
    } catch {}
  }
}

console.log('Stopping processes on ports:', PORTS.join(', '));
for (const port of PORTS) {
  killPort(port);
}
console.log('Done');
