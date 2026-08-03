import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { generator as temporalPipelineGenerator } from './temporal-generator/temporal-pipelie-generator.js';
import { generator as temporalEnvPropertyFileGenerator } from './temporal-generator/temporal-env-property-file-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ServiceBenchTemporal = (subclass) =>
    class extends subclass {
  name() { return 'ServiceBenchTemporal' }
    async execute() {
      // Ensure common mixin does not generate the default SB pipeline for temporal template.
      process.env.SC_DEVKIT_SKIP_DEFAULT_PIPELINE = '1';

      await super.execute();

      this.templateData.pluginId = this.templateData.name.replace('-service-orchestration-svc-deployment', '');

      if (this.update) {
        await this.copyTemplates(this.destinationPath('*'), this.destinationPath('backup'));
        await this.copyTemplates(this.destinationPath('env/**/*'), this.destinationPath('backup/env'));

        // only copy selected top-level static files for update mode
        await this.copyTemplates(`${__dirname}/templates/static/*`, this.destinationPath(), {
          delimiter: '%',
        });
      } else {
        // copy all static files
        await this.copyTemplates(`${__dirname}/templates/static/**/*`, this.destinationPath(), {
          delimiter: '%',
        });
      }

      // Write generated pipeline after static copy so it remains the final version.
      const { file, content } = temporalPipelineGenerator(this.templateData);
      this.writeFileToPath(this.destinationPath(file), content);

      // Write generated env values after static copy so it remains the final version.
      const envFiles = temporalEnvPropertyFileGenerator(this.templateData);
      envFiles.forEach(({ name, content }) => {
        this.writeFileToPath(this.destinationPath(`helm/env/${name}/values.yaml`), content);
      });

      await this.copyTemplate(
        `${__dirname}/templates/gitignore`,
        this.destinationPath(`.gitignore`),
        { delimiter: '??' }
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