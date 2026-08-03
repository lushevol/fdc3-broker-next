import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const WebkitBasicLit = (subclass) =>
  class extends subclass {
    name() { return 'WebkitBasicLit' }
    async execute() {
      await super.execute();

      if (this.action === 'update') {
        await this.copyTemplates(this.destinationPath('*'), this.destinationPath('backup'));

        // only copy some files
        await this.copyTemplates(`${__dirname}/templates/static/*`, this.destinationPath(), {
          delimiter: '??',
        });
      } else {
        // copy all static files
        await this.copyTemplates(`${__dirname}/templates/static/**/*`, this.destinationPath(), {
          delimiter: '??',
        });
      }

      await this.copyTemplate(
        `${__dirname}/templates/gitignore`,
        this.destinationPath(`.gitignore`),
        { delimiter: '??' }
      );

      this.copyTemplateJsonInto(
        `${__dirname}/templates/package.json`,
        this.destinationPath('package.json'),
        { mode: 'merge' },
        { delimiter: '??' },
      );

      const { name } = this.templateData;
      this.copyTemplate(
        `${__dirname}/templates/app.js`,
        this.destinationPath(`src/app-${name}.js`),
        { delimiter: '??' }
      );

      this.copyTemplate(
        `${__dirname}/templates/app.test.js`,
        this.destinationPath(`test/app-${name}.test.js`),
        { delimiter: '??' }
      );

      // copy cli info
      await this.copyTemplates(
        `${__dirname}/templates/.scdevcli/**/*`,
        this.destinationPath(`.scdevcli`), {
          delimiter: '??',
        }
      );
      
    }
  };
