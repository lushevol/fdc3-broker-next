#!/usr/bin/env node

/* eslint-disable no-console */

import semver from 'semver';
import chalk from 'chalk';
import { executeMixinGenerator } from '@open-wc/create/dist/core.js';
import Generator from './Generator.js';
import { AppMixin } from './app/index.js';

(async () => {
  try {
    if (semver.lte(process.version, '16.0.0')) {
      console.error(
        chalk.bgRed('\nUh oh! Looks like you dont have Node v16 or higher installed!\n'),
      );
      console.log(`You can do this by going to ${chalk.underline.blue(`https://artifactory.global.standardchartered.com/artifactory/technology-standard-release/application/application-development/languages-frameworks-build-tools-runtime/nodejs/`)}`);
    } else {
      await executeMixinGenerator([AppMixin], {}, Generator);
    }
  } catch (err) {
    console.log(err);
  }
})();
