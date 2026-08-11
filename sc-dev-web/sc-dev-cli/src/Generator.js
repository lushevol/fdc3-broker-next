/* eslint-disable no-console, import/no-cycle */
import path from 'path';
import {
  processTemplate as coreProcessTemplate,
  writeFileToPath as coreWriteFileToPath,
  writeFilesToDisk,
} from '@open-wc/create/dist/core.js';
import _Generator from '@open-wc/create/dist/Generator.js';
import chalk from 'chalk';

/**
 * Options for the generator
 * @typedef {object} GeneratorOptions
 * @property {string} [name] the project name
 * @property {string} [destinationPath='auto'] path to output to. default value 'auto' will output to current working directory
 * @property {'true'|'false'} [writeToDisk] whether to write to disk
 */

function optionsToCommand(options) {
  let command = `npx -y @scdevkit/cli@latest `;
  Object.keys(options).forEach((key) => {
    if (key !== '_scaffoldFilesFor') {
      const value = options[key];

      if (typeof value === 'string' || typeof value === 'number') {
        command += `--${key} ${value} `;
      } else if (typeof value === 'boolean' && value === true) {
        command += `--${key} `;
      } else if (Array.isArray(value)) {
        command += `--${key} ${value.join(' ')} `;
      }
    }
  });
  return command;
}

function getClassName(name) {
  return name
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

class Generator extends _Generator.default {
  constructor() {
    super();
    this.generatorName = 'sc-devkit-cli';
  }

  writeFileToPath(filePath, content) {
    coreWriteFileToPath(filePath, content);
  }

  processTemplate(content, templateData) {
    return coreProcessTemplate(content, templateData);
  }

  execute() {
    this.action = 'create';
    if (this.options.action === 'update' && this.options.existingProject) {
      this.action = 'update';
    } else if (this.options.action === 'validate' && this.options.existingProject) {
      this.action = 'validate';
    }
    if (this.options.action) {
      const { action } = this.options;
      this.templateData = { ...this.templateData, cliAction: action };
    }
    if (this.options.category) {
      const { category } = this.options;
      this.templateData = { ...this.templateData, cliCategory: category };
    }
    if (this.options.type) {
      const { type } = this.options;
      this.templateData = { ...this.templateData, cliType: type };
    }
    if (this.options.sbUpdateTargetType) {
      this.templateData = {
        ...this.templateData,
        sbUpdateTargetType: this.options.sbUpdateTargetType,
        sbUpdateTargetDir: this.options.sbUpdateTargetDir,
      };
    }
    if (this.options.name) {
      const { name, applicationId, componentId } = this.options;
      const className = getClassName(name);
      this.templateData = { ...this.templateData, name, className };

      if (this.action === 'update' || this.action === 'validate') {
        this.options.destinationPath = process.cwd();
      } else if (this.options.type === 'service-bench-test-playwright') {
        this.options.destinationPath = path.join(
          process.cwd(),
          `${applicationId}${componentId ? `-${componentId}` : ''}-${name}-e2e`,
        );
      } else if (this.options.category === 'generic') {
        this.options.destinationPath = path.join(process.cwd(), `${applicationId}-${name}`);
      } else if (this.options.destinationPath === 'auto') {
        this.options.destinationPath = path.join(
          process.cwd(),
          `${applicationId}${componentId ? `-${componentId}` : ''}${this.options.type.startsWith('service-bench-widget') ? '-widget' : ''
          }-${name}`,
        );
      }
    }
    if (this.options.applicationId) {
      const { applicationId } = this.options;
      this.templateData = { ...this.templateData, applicationId };
    }
    if (this.options.componentId) {
      const { componentId } = this.options;
      this.templateData = { ...this.templateData, componentId };
    }
    if (this.options.teamEmail) {
      const { teamEmail } = this.options;
      this.templateData = { ...this.templateData, teamEmail };
    }
    if (this.options.bankId) {
      const { bankId } = this.options;
      this.templateData = { ...this.templateData, bankId };
    }
    if (this.options.db) {
      const { db } = this.options;
      this.templateData = { ...this.templateData, db };
    }
    if (this.options.functionName) {
      const { functionName } = this.options;
      this.templateData = { ...this.templateData, functionName };
    }

    if (this.options.envs) {
      const { envs } = this.options;
      this.templateData = { ...this.templateData, envs };
    }
    if (this.options.envQa) {
      const { envQa } = this.options;
      this.templateData = { ...this.templateData, envQa };
    }
    if (this.options.envRollbackQa) {
      const { envRollbackQa } = this.options;
      this.templateData = { ...this.templateData, envRollbackQa };
    }
    if (this.options.idpClientId) {
      const { idpClientId } = this.options;
      this.templateData = { ...this.templateData, idpClientId };
    }
    if (this.options.idpKeyAlias) {
      const { idpKeyAlias } = this.options;
      this.templateData = { ...this.templateData, idpKeyAlias };
    }
    if (this.options.idpServiceUrn) {
      const { idpServiceUrn } = this.options;
      this.templateData = { ...this.templateData, idpServiceUrn };
    }
    if (this.options.idpStoreName) {
      const { idpStoreName } = this.options;
      this.templateData = { ...this.templateData, idpStoreName };
    }
    // E2E (Playwright) specific fields
    if (this.options.type === 'service-bench-test-playwright') {      // Derive pluginDisplayName from name (kebab-case → Title Case)
      // e.g. "integration-hub" → "Integration Hub"
      // NOTE: verify this matches the exact aria-label of the nav item in Service Bench
      const rawName = this.options.name || 'service-bench-plugin';
      const pluginDisplayName = rawName
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      this.templateData = { ...this.templateData, pluginDisplayName };

      // pluginEntryPath defaults to '/' — update in navigator.page.ts if your plugin has a specific entry path
      const pluginEntryPath = '/';
      this.templateData = { ...this.templateData, pluginEntryPath };
    }
  }

  async end() {
    if (this.wantsWriteToDisk) {
      this.options.writeToDisk = await writeFilesToDisk();
    }

    if (this.wantsRecreateInfo) {
      console.log(chalk.white(`The project is ${this.action === 'update' ? 'updated' : 'set up'} now!`));
      console.log('');
      console.log(this.action === 'update' ? 'Run' : 'To go into the directory, run:');
      if (this.action === 'create') {
        console.log(
          chalk.cyanBright(
            `  cd ${this.templateData.applicationId}${this.options.type.startsWith('service-bench-widget') ? '-widget' : ''
            }-${this.templateData.name}`,
          ),
        );
      }
      if (this.options.category === 'webkit') {
        console.log(chalk.cyanBright(`  npm install`));
        console.log(chalk.cyanBright(`  npm start`));
      } else if (
        this.options.type.startsWith('service-bench-widget') ||
        this.options.type.startsWith('service-bench-plugin')
      ) {
        console.log(chalk.cyanBright(`  npm install`));
        console.log(chalk.cyanBright(`  npm start`));
      }
      console.log('');
      console.log('If you want to rerun this exact same generator you can do so by executing:');
      console.log(optionsToCommand(this.options, this.generatorName));
    }
  }
}

export default Generator;
