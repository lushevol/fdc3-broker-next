import chalk from 'chalk';
import fs from 'fs';
import url from 'url';
import path from 'path';

const __dirname = url.fileURLToPath(new URL(".", import.meta.url))

let versionText = '';
try {
  const packageJsonFile = path.resolve(__dirname, '../..', 'package.json');
  const packageJsonText = await fs.readFileSync(packageJsonFile, 'utf8')
  const packageJson = JSON.parse(packageJsonText);
  const packageVersion = packageJson.version;

  const centerIndex = 31;
  const startIndex = centerIndex - packageVersion.length / 2;
  for (let i = 0; i < startIndex; i++) {
    versionText += ' ';
  }
  versionText += chalk.whiteBright(`v${packageVersion}`)
} catch(e) {}

const processFile = async (filename) => {
  const file = path.resolve(__dirname, '..', filename);
  let text = await fs.readFileSync(file, 'utf8')
  text = text.replace(
    /\${AnsiColor\.BRIGHT_BLUE}[^\$]*\${AnsiColor\.DEFAULT}/gi,
    function(x) {
      return chalk.blueBright(x.substring(24, x.length - 20));
    }
  );
  text = text.replace(
    /\${AnsiColor\.BRIGHT_GREEN}[^\$]*\${AnsiColor\.DEFAULT}/gi,
    function(x) {
      return chalk.greenBright(x.substring(25, x.length - 20));
    }
  );
  text = text.replace(
    /\${AnsiColor\.BRIGHT_WHITE}[^\$]*\${AnsiColor\.DEFAULT}/gi,
    function(x) {
      return chalk.whiteBright(x.substring(25, x.length - 20));
    }
  );
  return text;
};

const logoText = await processFile('banner-logo.txt');
const nameText = await processFile('banner-name.txt');

const header = (showLogo = true) => {
  let output = '';
  if (showLogo) {
    output += `
${logoText}

`;
  }
  output += `
${nameText}
${versionText}
`;
  return output;
}

export default header;
