import { fileURLToPath } from 'url';
import { dirname } from 'path';

import { CommonServiceBenchMixin } from '../common-service-bench/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ServiceBenchWidgetLitTypeScript = (subclass) =>
  class extends CommonServiceBenchMixin(subclass) {
    name() { return 'ServiceBenchWidgetLitTypeScript' }
    async execute() {
      await super.execute();

      if (this.action === 'update') {
        await this.copyTemplates(this.destinationPath('*'), this.destinationPath('backup'));
        await this.copyTemplates(this.destinationPath('scripts/**/*'), this.destinationPath('backup/scripts'));

        // only copy scripts folder and some files
        await this.copyTemplates(`${__dirname}/templates/static/scripts/**/*`, this.destinationPath('scripts'), {
          delimiter: '??',
        });
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
