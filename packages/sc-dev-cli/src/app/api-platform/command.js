
import { spawn } from 'child_process';

/*
    Runs a command and streams output to stdout and stderr
*/
export async function runCommand(command, workingDir) {
  console.log('🛠️ Running command: ' + command + '\n\n');

  return new Promise(function (resolve, reject) {
    const child = spawn(command, { cwd: workingDir, shell: true });

    // Stream stdout and stderr
    child.stdout.on('data', (data) => {
      process.stdout.write(data.toString());
    });

    child.stderr.on('data', (data) => {
      process.stderr.write(data.toString());
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log('\n\n✅ ' + command + ' completed successfully.');
        resolve();
      } else {
        reject(new Error('\n\n❌ command failed with exit code: ' + code));
      }
    });
  });
}
