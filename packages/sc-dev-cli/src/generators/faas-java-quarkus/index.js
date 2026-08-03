import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const FaasJavaQuarkus = (subclass) =>
  class extends subclass {
    name() { return 'FaasJavaQuarkus' }
    async execute() {
      await super.execute();

      if (this.action === 'update') {
        await this.copyTemplates(this.destinationPath('*'), this.destinationPath('backup'));
        await this.copyTemplates(this.destinationPath('env/**/*'), this.destinationPath('backup/env'));
        await this.copyTemplates(this.destinationPath('.sc-devkit/**/*'), this.destinationPath('backup/.sc-devkit'));

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
        `${__dirname}/templates/pom.xml.template`,
        this.destinationPath(`pom.xml`),
        { delimiter: '%' }
      );
      await this.copyTemplate(
        `${__dirname}/templates/gitignore`,
        this.destinationPath(`.gitignore`),
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
