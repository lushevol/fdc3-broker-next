import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

import { CommonServiceBenchMixin } from '../common-service-bench/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ServiceBenchProcessApiNodeJS = (subclass) =>
  class extends CommonServiceBenchMixin(subclass) {
    name() { return 'ServiceBenchProcessApiNodeJS' }
    async execute() {
      await super.execute();

      if (this.action === 'update') {
        await this.copyTemplates(this.destinationPath('*'), this.destinationPath('backup'));
        await this.copyTemplates(this.destinationPath('env/**/*'), this.destinationPath('backup/env'));

        // only copy scripts folder and some files
        await this.copyTemplates(`${__dirname}/templates/static/env/**/*`, this.destinationPath('env'), {
          delimiter: '%',
        });
        await this.copyTemplates(`${__dirname}/templates/static/*`, this.destinationPath(), {
          delimiter: '%',
        });
      } else {
        // copy all static files
        await this.copyTemplates(`${__dirname}/templates/static/**/*`, this.destinationPath(), {
          delimiter: '%',
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

      // copy readme files
      await fs.cp(`${__dirname}/templates/devkit`, this.destinationPath(`.devkit`), {recursive: true}, (error) => {});

      // copy cli info
      await this.copyTemplates(
        `${__dirname}/templates/.scdevcli/**/*`,
        this.destinationPath(`.scdevcli`), {
          delimiter: '??',
        }
      );
    }
  };
