/* eslint-disable no-console */
import chalk from 'chalk';
import prompts from 'prompts';
import commandLineArgs from 'command-line-args';
import { executeMixinGenerator } from '@open-wc/create/dist/core.js';

import header from './header.js';
import { gatherMixins } from './gatherMixins.js';
import Generator from '../Generator.js';
import { fetchParameters } from './fetchInputParameters.js';

/**
 * Allows to control the data via command line
 *
 * example:
 * npm init create-sc-project --type java --writeToDisk true
 */
export const optionDefinitions = [
  { name: 'action', type: String },
  { name: 'destinationPath', type: String },
  { name: 'category', type: String },
  { name: 'type', type: String },
  { name: 'name', type: String },
  { name: 'applicationId', type: Number },
  { name: 'componentId', type: String },
  { name: 'teamEmail', type: String },
  { name: 'bankId', type: Number },
  { name: 'openapi', type: String },
  { name: 'openapiAction', type: String },
  { name: 'writeToDisk', type: String },
  { name: 'overwriteFile', type: String },
  { name: 'envs', type: String, multiple: true }, // array df2, ct1, cn1, gdcw1, gdcw2, id1
  { name: 'envQa', type: String }, // df2, cn1, gdcw2
  { name: 'envRollbackQa', type: String }, // df2, cn1, gdcw2
  { name: 'idpKeyAlias', type: String },
  { name: 'idpClientId', type: String },
  { name: 'idpServiceUrn', type: String },
  { name: 'idpStoreName', type: String },
  { name: 'updateType', type: String },
  { name: 'db', type: String },
];

const extraCmdArgs = ['envs', 'idpKeyAlias', 'idpClientId', 'idpServiceUrn', 'idpStoreName', 'envQa', 'envRollbackQa', 'db']

const overrides = commandLineArgs(optionDefinitions);
prompts.override(overrides);

const existingParameters = fetchParameters();
export const questions = [
  {
    type: 'select',
    name: 'action',
    message: 'Do you want to create, update, or validate a project?',
    choices: [
      { title: 'Create', value: 'create' },
      { title: 'Update', value: 'update' },
      { title: 'Validate', value: 'validate' },
    ],
  },
  {
    type: (_, values) => {
      let create = false;
      if (!values.action || values.action === 'create' || !existingParameters.category || !existingParameters.existingProject) {
        create = true;
      }
      return create ? 'select' : false;
    },
    name: 'category',
    message: 'What kind of project would you like to create?',
    choices: [
      { title: 'Service Bench', value: 'sb' },
      { title: 'WebKit', value: 'webkit' },
      { title: 'FaaS', value: 'faas' },
      { title: 'Generic', value: 'generic' },
    ],
  },
  {
    type: (_, values) => (values.action === 'update' ? 'select' : null),
    name: 'updateType',
    message: 'What would you like to update?',
    choices: (_, values) => {
      const effectiveCategory = values.category || existingParameters.category;
      const choices = [
        { title: 'Update to latest template', value: 'project' },
        { title: 'Update AI Agents & Skills', value: 'ai-agent-skill' },
      ];
      if (effectiveCategory === 'sb') {
        choices.push({ title: 'Update to SC WebKit 2.0', value: 'sc-webkit-version' });
      }
      return choices;
    },
  },
  {
    type: (_, values) => (values.updateType === 'sc-webkit-version' ? 'select' : null),
    name: 'sbUpdateTargetType',
    message: 'Select your target project directory, please.',
    choices: [
      {
        title: 'Current directory (must be the root, the parent directory of src)',
        value: 'current',
      },
      {
        title: 'Manually input...',
        value: 'manual',
      },
    ],
  },
  {
    type: (prev) => (prev === 'manual' ? 'text' : null),
    name: 'sbUpdateTargetDir',
    message: 'Input your target project directory to scan, please.',
  },
  {
    type: (_, values) => {
      let create = false;
      if (!values.action || values.action === 'create' || !existingParameters.type || !existingParameters.existingProject) {
        create = true;
      }
      return create ? 'select' : null
    },
    name: 'type',
    message: 'Select one of these templates:',
    choices: (_, values) => {
      if (values.category === 'webkit') {
        return [
          { title: 'Basic (No framework)', value: 'webkit-basic' },
          { title: 'Basic (React)', value: 'webkit-basic-react' },
          { title: 'Basic (Lit)', value: 'webkit-basic-lit' },
          /*
          {title: 'Sample App (React)', value: 'webkit-demo-react'},
          {title: 'Sample App (Angular)', value: 'webkit-demo-angular'}
          */
        ];
      } else if (values.category === 'faas') {
        return [
          { title: 'Java (Quarkus)', value: 'faas-java-quarkus' },
          {
            title: 'Java (Spring Boot) - Coming Soon!',
            value: 'faas-java-springboot',
            disabled: true,
          },
          { title: 'Python - Coming Soon!', value: 'faas-python', disabled: true },
        ];
      } else if (values.category === 'sb') {
        return [
          { title: 'UI - Plugin (Lit)', value: 'service-bench-plugin-lit' },
          { title: 'UI - Plugin (Lit + TypeScript)', value: 'service-bench-plugin-lit-ts' },
          { title: 'UI - Plugin (React)', value: 'service-bench-plugin-react' },
          { title: 'UI - Widget (Lit + TypeScript)', value: 'service-bench-widget-lit-ts' },
          {
            title: 'API - Kotlin Experience API (GraphQL)',
            value: 'service-bench-experience-api-kotlin',
          },
          { title: 'API - Kotlin Process API', value: 'service-bench-process-api-kotlin' },
          {
            title: 'API - Java Experience API (GraphQL)',
            value: 'service-bench-experience-api-java',
          },
          { title: 'API - Java Process API', value: 'service-bench-process-api-java' },
          { title: 'API - NodeJS Experience API (GraphQL) - BETA', value: 'service-bench-experience-api-nodejs' },
          { title: 'API - NodeJS Process API - BETA', value: 'service-bench-process-api-nodejs' },
          { title: 'API - Python Experience API (GraphQL) - BETA', value: 'service-bench-experience-api-python' },
          { title: 'API - Python Process API - BETA', value: 'service-bench-process-api-python' },
          { title: 'API - Golang Experience API (GraphQL) - BETA', value: 'service-bench-experience-api-golang' },
          { title: 'API - Golang Process API - BETA', value: 'service-bench-process-api-golang' },
          { title: 'API - Notification (Schedule & Retry)', value: 'service-bench-notification' },
          { title: 'JOB - Java Batch Job', value: 'service-bench-batch-job-java' },
          { title: 'JOB - Python Batch Job - BETA', value: 'service-bench-batch-job-python' },
          { title: 'MCP - Golang MCP Server', value: 'service-bench-mcp-process-api-golang' },
          { title: 'MCP - Java MCP Server', value: 'service-bench-mcp-process-api-java' },
          { title: 'MCP - Java MCP Server (Native)', value: 'service-bench-mcp-process-api-java-native' },
          { title: 'MCP - Kotlin MCP Server', value: 'service-bench-mcp-process-api-kotlin' },
          { title: 'MCP - Kotlin MCP Server (Native)', value: 'service-bench-mcp-process-api-kotlin-native' },
          { title: 'MCP - Python MCP Server - BETA', value: 'service-bench-mcp-api-python' },
          { title: 'MCP - NodeJS MCP Server - BETA', value: 'service-bench-mcp-api-nodejs' },
          { title: 'TEST - Playwright Test Suite', value: 'service-bench-test-playwright' },
        ];
      } else if (values.category === 'generic') {
        return [
          {
            title: 'API - Java Quarkus Process API (OpenAPI/Contract-first)',
            value: 'generic-process-api-java-quarkus',
          },
        ];
      } else {
        return [{ title: 'Webkit Basic (No framework)', value: 'webkit-basic' }];
      }
    },
  },
  {
    type: (_, values) => {
      return values.action === 'create' && values.type === 'generic-process-api-java-quarkus'
        ? 'text'
        : false;
    },
    name: 'openapi',
    message: 'Please provide the relative path to your OpenAPI spec, ie: ./pet-swagger.json',
  },
  {
    type: (_, values) => {
      return values.action === 'update' &&
        !values.sbUpdateTargetType &&
        values.updateType !== 'ai-agent-skill' &&
        existingParameters.type === 'generic-process-api-java-quarkus'
        ? 'select'
        : false;
    },
    name: 'openapiAction',
    message:
      'Resync or perform dry run to check if your contract-first process API is in sync with your project. Prevent your code from drifting from your spec! Please use the root directory of your project.',
    choices: [
      { title: 'Dry Run - Test', value: 'dry-run' },
      { title: 'Resync', value: 'resync' },
    ],
  },
  {
    type: (_, values) => {
      let create = false;
      if (!values.action || values.action === 'create' || !existingParameters.name || !existingParameters.existingProject) {
        create = true;
      }
      return create ? 'text' : false;
    },
    name: 'name',
    message: 'What is the name of your project?',
  },
  {
    type: (_, values) => {
      let create = false;
      if (!values.action || values.action === 'create' || !existingParameters.applicationId || !existingParameters.existingProject) {
        create = true;
      }
      return create ? 'number' : false;
    },
    name: 'applicationId',
    message: 'What is your application ID?',
    initial: (_, values) => {
      if (values.category === 'sb') {
        return '55313';
      } else {
        return undefined;
      }
    },
  },
  {
    type: (_, values) => {
      let create = false;
      if (!values.action || values.action === 'create' || !existingParameters.componentId || !existingParameters.existingProject) {
        create = true;
      }
      return create && values.category === 'sb' ? 'text' : false;
    },
    name: 'componentId',
    message: 'What is your Component ID?',
    initial: '00',
  },
  {
    type: (_, values) => {
      let create = false;
      if (!values.action || values.action === 'create' || !existingParameters.teamEmail || !existingParameters.existingProject) {
        create = true;
      }
      return create && values.category === 'sb' ? 'text' : false;
    },
    name: 'teamEmail',
    message: 'What is your team email?',
    initial: 'my-team-email@sc.com',
  },
  {
    type: (_, values) => {
      const info = {
        ...existingParameters,
        ...values,
      };
      if (info.type === 'generic-process-api-java-quarkus') {
        return false;
      }
      if (info.sbUpdateTargetType) {
        return false;
      }
      if (info.updateType === 'ai-agent-skill') {
        return false;
      }
      let create = false;
      if (!values.action || values.action === 'create' || !existingParameters.bankId || !existingParameters.existingProject) {
        create = true;
      }
      const useBankId = (info.category === 'faas' ||
        info.type === 'service-bench-experience-api-kotlin' ||
        info.type === 'service-bench-experience-api-java' ||
        info.type === 'service-bench-process-api-java' ||
        info.type === 'service-bench-process-api-kotlin' ||
        info.type === 'service-bench-batch-job-java' ||
        info.type === 'service-bench-batch-job-python' ||
        info.type === 'service-bench-notification' ||
        info.type === 'service-bench-process-api-nodejs' ||
        info.type === 'service-bench-experience-api-nodejs' ||
        info.type === 'service-bench-process-api-python' ||
        info.type === 'service-bench-experience-api-python' ||
        info.type === 'service-bench-process-api-golang' ||
        info.type === 'service-bench-experience-api-golang' ||
        info.type === 'service-bench-mcp-process-api-java' ||
        info.type === 'service-bench-mcp-process-api-java-native' ||
        info.type === 'service-bench-mcp-process-api-kotlin' ||
        info.type === 'service-bench-mcp-process-api-kotlin-native' ||
        info.type === 'service-bench-mcp-api-python' ||
        info.type === 'service-bench-mcp-api-nodejs' ||
        info.type === 'service-bench-mcp-process-api-golang');
      return create && useBankId ? 'number' : false;
    },
    name: 'bankId',
    message: 'What is the your bank ID? This value is used to map your shared folder in VM',
  },
];

export const AppMixin = (subclass) =>
  // eslint-disable-next-line no-shadow
  class AppMixin extends subclass {
    constructor() {
      super();
      this.wantsWriteToDisk = false;
      this.wantsRecreateInfo = false;
    }

    async execute() {

      // Header
      let showLogo = true;
      if (overrides.action) {
        showLogo = false;
      }
      console.log(header(showLogo));

      let options = null;
      if (overrides.action === 'validate') {
        // Non-interactive validation, all options are derives from overrides
        options = { ...overrides };
      } else {
        // Show question
        options = await prompts(questions, {
          onCancel: () => {
            process.exit();
          },
        });
      }

      if (options.action === 'validate') {
        if (!existingParameters.existingProject) {
          console.error(
            chalk.redBright`Unable to proceed with validation. Current directory is not an SC DevKit project.`,
          );
          process.exit();
        } else {
          // when doing the validation, no need to prompt if noEnd.
          options.noEnd = true;
        }
      }

      if (
        options.action === 'update' &&
        options.updateType === 'sc-webkit-version' &&
        options.sbUpdateTargetType
      ) {
        options.type = 'scan-webkit-break-change';
        // when doing the webkit update migration, no need to prompt if noEnd.
        options.noEnd = true;
      }

      if (options.action === 'update' && options.updateType === 'ai-agent-skill') {
        options.type = 'ai-agent-skill';
        options.noEnd = true;
      }

      if (options.action === 'update' && !existingParameters.existingProject) {
        console.error(
          'Unable to proceed with update. Current directory is not an SC DevKit project (created with @scdevkit/cli v0.1.0-20240802.4 or later).',
        );
        process.exit();
      }
      this.options = { ...options };
      if (existingParameters && existingParameters.existingProject) {
        this.options = {
          ...existingParameters,
          ...options,
          existingProject: true,
        };
      }

      // add extra args from command line to options
      extraCmdArgs.forEach(arg => this.options[arg] ??= overrides[arg])

      if (this.options.name && !existingParameters.existingProject) {
        this.options.name = this.options.name.toLowerCase().replace(/\s+/g, '-');
      }

      const mixins = gatherMixins(this.options);
      // app is separate to prevent circular imports
      await executeMixinGenerator(mixins, this.options, Generator);
    }
  };

export { gatherMixins };
export default AppMixin;
