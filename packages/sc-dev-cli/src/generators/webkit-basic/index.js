import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const WebkitBasic = (subclass) =>
  class extends subclass {
    name() { return 'WebkitBasic' }
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

      // copy cli info
      await this.copyTemplates(
        `${__dirname}/templates/.scdevcli/**/*`,
        this.destinationPath(`.scdevcli`), {
          delimiter: '??',
        }
      );
      
    }
  };
