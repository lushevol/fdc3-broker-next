import { fileURLToPath } from 'url';
import { dirname } from 'path';
import xml2js from 'xml2js';
import { installAgentsAndSkills } from '../ai-agent-skill/index.js';

import { generator as pipelineGenerator } from './azure-pipeline-generator.js';
import { generator as envPropFileGenerator } from './env-property-file-generator.js';
import {
  rbQaEnvMap,
  qaEnvMap,
} from './env-config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const CommonServiceBenchMixin = (subclass) =>
  class extends subclass {
    name() { return 'CommonServiceBench' }

    _getEnv(env) {
      // if envs not passed then return undefined to use default value
      return this.templateData.envs ? String(this.templateData.envs.includes(env)) : undefined;
    }

    async execute() {
      await super.execute();

      // Generate azure pipeline yml file
      if (this.templateData.cliCategory === 'sb') {

        const envDf2 = process.env['SC_DEVKIT_CLI_ENV_DF2'] || this._getEnv('df2') || '1';
        const envCt1 = process.env['SC_DEVKIT_CLI_ENV_CT1'] || this._getEnv('ct1') || '1';
        const envGdcw1 = process.env['SC_DEVKIT_CLI_ENV_GDCW1'] || this._getEnv('gdcw1') || '0';
        const envGdcw2 = process.env['SC_DEVKIT_CLI_ENV_GDCW2'] || this._getEnv('gdcw2') || '0';
        const envCn1 = process.env['SC_DEVKIT_CLI_ENV_CN1'] || this._getEnv('cn1') || '0';
        const envId1 = process.env['SC_DEVKIT_CLI_ENV_ID1'] || this._getEnv('id1') || '0';

        // QA
        const _envQa = qaEnvMap[this.templateData.envQa] ? this.templateData.envQa : undefined;
        const _envRollbackQa = rbQaEnvMap[this.templateData.envRollbackQa] ? this.templateData.envRollbackQa : undefined;
        const envQa = process.env['SC_DEVKIT_CLI_ENV_QA'] || _envQa || 'df2';
        const envRollbackQa = process.env['SC_DEVKIT_CLI_ENV_ROLLBACK_QA'] || _envRollbackQa || 'df2';

        const devEnvs = [];
        const qaEnv = envQa;
        const rbQaEnv = envRollbackQa;
        const prodEnvs = [];
        if (envDf2 === '1' || envDf2 === 'true') {
          devEnvs.push('df2');
        }
        if (envCt1 === '1' || envCt1 === 'true') {
          prodEnvs.push('ct1');
        }
        if (envGdcw1 === '1' || envGdcw1 === 'true') {
          prodEnvs.push('gdcw1');
        }
        if (envGdcw2 === '1' || envGdcw2 === 'true') {
          devEnvs.push('df2_uat_uk');
          prodEnvs.push('gdcw2');
        }
        if (envCn1 === '1' || envCn1 === 'true') {
          devEnvs.push('cn1');
          prodEnvs.push('cn1');
        }
        if (envId1 === '1' || envId1 === 'true') {
          devEnvs.push('id1');
          prodEnvs.push('id1');
        }
        

        const { file, content } = pipelineGenerator(
          this.templateData,
          devEnvs,
          rbQaEnv,
          qaEnv,
          prodEnvs
        );
        this.writeFileToPath(this.destinationPath(file), content);

        // Add env config files
        const envFiles = envPropFileGenerator(
          this.templateData,
          devEnvs,
          rbQaEnv,
          qaEnv,
          prodEnvs
        )
        envFiles.forEach(({ name, content, isAppPropConfig }) => {
          if (!isAppPropConfig) { // update normal env properties yaml file
            const processedContent = this.processTemplate(content, this.templateData);
            this.writeFileToPath(this.destinationPath(`env/${name}/properties.yml`), processedContent);
          } else { // update  application.properties
            if (name) {
              this.writeFileToPath(this.destinationPath(name), content);
            }
          }
        })

      }

      // Generate answer xml
      const answers = {
        template: {
          category: this.templateData.cliCategory,
          type: this.templateData.cliType,
          name: this.templateData.name,
          applicationId: this.templateData.applicationId,
          componentId: this.templateData.componentId,
          teamEmail: this.templateData.teamEmail
        }
      }
      if (this.templateData.bankId) {
        answers.template.bankId = this.templateData.bankId
      }
      var answersXml = new xml2js.Builder().buildObject(answers);
      this.writeFileToPath(this.destinationPath('.scdevcli/answers.xml'), answersXml);

      // copy all other files
      await this.copyTemplates(`${__dirname}/templates/static/**/*`, this.destinationPath(), {
        delimiter: '%',
      });

      // Copy ai-agent-skill agents and skills into .github (loads from Artifactory when available)
      await installAgentsAndSkills({
        category: this.templateData.cliCategory,
        type: this.templateData.cliType,
        targetDir: this.destinationPath('.github'),
      });

    }
  };
