import fs from 'fs';
import userhome from 'userhome';

var osx = process.platform === 'darwin';
var win = process.platform === 'win32';
var other = !osx && !win;

const browserType = {
  win: {
    edge: '\\Microsoft\\Edge\\Application\\msedge.exe',
    chrome: '\\Google\\Chrome\\Application\\chrome.exe',
  },
  mac: {
    edge: '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    chrome: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  },
};


export function locator(type) {
  let exePath = null;
  if (other) {
    exePath = null;
    console.error('not support for now.');
  } else if (osx) {
    var regPath = browserType.mac[type];
    var altPath = userhome(regPath.slice(1));
    exePath = fs.existsSync(regPath) ? regPath : altPath;
  } else {
    var suffix = browserType.win[type];
    var prefixes = [
      process.env.LOCALAPPDATA,
      process.env.PROGRAMFILES,
      process.env['PROGRAMFILES(X86)'],
    ];

    for (var i = 0; i < prefixes.length; i++) {
      var exe = prefixes[i] + suffix;
      if (fs.existsSync(exe)) {
        exePath = exe;
        break;
      }
    }
  }
  return exePath;
}
