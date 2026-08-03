import path from 'path';
import fs from 'fs';
import { mkdirpSync } from 'mkdirp';
import glob from 'glob';
import { executeMixinGenerator, processTemplate } from '@open-wc/create/dist/core.js';
import { gatherMixins, optionDefinitions, questions } from './app/index.js';

export const allOptions = optionDefinitions;

export const getMandatoryOptions = function (values) {
  return questions.map(({ name, type }) => {
    if (!type) {
      return null;
    } else if (typeof (type) === 'string') {
      return name;
    } else if (typeof (type) === 'function') {
      return !!type(null, values) ? name : null;
    } else {
      return null;
    }
  }).filter((option) => !!option);
}

function getClassName(name) {
  return name
    .split('-')
    .reduce((previous, part) => previous + part.charAt(0).toUpperCase() + part.slice(1), '');
}

class Generator {
  constructor() {
    this.generatorName = 'sc-dev-cli-generator';
  }

  execute() {
    if (this.options.category) {
      const { category } = this.options;
      this.templateData = { ...this.templateData, cliCategory: category };
    }
    if (this.options.type) {
      const { type } = this.options;
      this.templateData = { ...this.templateData, cliType: type };
    }
    if (this.options.name) {
      const name = this.options.name.toLowerCase().replace(/\s+/g, '-');
      const className = getClassName(name);
      this.templateData = { ...this.templateData, name, className };
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
    if (this.options.envs) {
      let { envs } = this.options;
      envs = typeof envs === 'string' ? [envs] : envs;
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
  }

  async end() { }

  destinationPath(destination = '') {
    return path.join(this.options.destinationPath, destination);
  }

  writeFileToPath(filePath, content) {
    const parentDir = path.dirname(filePath);
    console.log(`parentDir = ${parentDir}`);
    mkdirpSync(parentDir);
    fs.writeFileSync(filePath, content, 'utf8');
  }

  processTemplate(content, templateData = this.templateData, ejsOptions = {}) {
    return processTemplate(content, templateData, ejsOptions);
  }

  copyTemplate(from, to, ejsOptions = {}) {
    const fileContent = fs.existsSync(from) ? fs.readFileSync(from, {
      encoding: 'utf8',
      flag: 'r',
    }) : false;
    if (fileContent) {
      const processed = processTemplate(fileContent.toString(), this.templateData, ejsOptions);
      fs.writeFileSync(to, processed, 'utf8');
    }
  }

  copyTemplateJsonInto(from, to, _, ejsOptions = {}) {
    console.warn('JSON merge template is unsupported in generate.js');
    const fileContent = fs.existsSync(from) ? fs.readFileSync(from, {
      encoding: 'utf8',
      flag: 'r',
    }) : false;
    if (fileContent) {
      const processed = processTemplate(fileContent.toString(), this.templateData, ejsOptions);
      fs.writeFileSync(to, processed, 'utf8');
    }
  }

  async copyTemplates(fromGlob, toDir = this.destinationPath(), ejsOptions = {}) {
    return new Promise(resolve => {
      glob(fromGlob, {
        dot: true
      }, (er, files) => {
        const copiedFiles = [];
        files.forEach(filePath => {
          if (!fs.lstatSync(filePath).isDirectory()) {
            const fileContent = fs.existsSync(filePath) ? fs.readFileSync(filePath, {
              encoding: 'utf8',
              flag: 'r',
            }) : false;

            if (fileContent !== false) {
              const processed = processTemplate(fileContent.toString(), this.templateData, ejsOptions); // find path write to (force / also on windows)

              const replace = path.join(fromGlob.replace(/\*/g, '')).replace(/\\(?! )/g, '/');

              const toPath = filePath.replace(replace, `${toDir}/`);
              copiedFiles.push({
                toPath,
                processed
              });
              fs.mkdirSync(path.dirname(toPath), { recursive: true });
              fs.writeFileSync(toPath, processed, 'utf8');
            }
          }
        });
        resolve(copiedFiles);
      });
    });
  }
}

const GenerateMixin = (subclass) =>
  // eslint-disable-next-line no-shadow
  class GenerateMixin extends subclass {

    async execute() {
      const mixins = gatherMixins(this.options);
      // app is separate to prevent circular imports
      await executeMixinGenerator(mixins, this.options, Generator);
    }

  };

const generate = async (options = {}) => {
  await executeMixinGenerator([GenerateMixin], options, Generator);
};

export default generate;