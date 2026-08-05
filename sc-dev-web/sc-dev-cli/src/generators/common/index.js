import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const CommonMixin = (subclass) =>
  class extends subclass {
    name() { return 'Common' }
    async execute() {
      await super.execute();

      // copy all other files
      await this.copyTemplates(`${__dirname}/templates/static/**/*`, this.destinationPath(), {
        delimiter: '%',
      });
      
    }
  };
