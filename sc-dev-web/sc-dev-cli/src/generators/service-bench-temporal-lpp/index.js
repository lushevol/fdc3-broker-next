import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import {CommonServiceBenchMixin} from "../common-service-bench/index.js";
import { generator as temporalLppPipelineGenerator } from './temporal-db-generator/temporal-lpp-pipeline-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ServiceBenchTemporalLpp = (subclass) =>
    class extends subclass {
    name() { return 'ServiceBenchTemporalLpp' }
    async execute() {
      await super.execute();

      const applicationId = String(this.templateData.applicationId || this.options.applicationId || '55313');
      const componentId = String(this.templateData.componentId || this.options.componentId || '346');
      const dbRoleUser = `sb-${applicationId}-${componentId}-app`;
      this.templateData.pluginId = this.templateData.name.replace('-service-orchestration-svc-lpp', '');


      this.templateData = {
        ...this.templateData,
        dbRoleUser,
      };

      if (this.update) {
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

      // Write generated pipeline after static copy so it remains the final version.
      const { file, content } = temporalLppPipelineGenerator(this.templateData);
      this.writeFileToPath(this.destinationPath(file), content);

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
