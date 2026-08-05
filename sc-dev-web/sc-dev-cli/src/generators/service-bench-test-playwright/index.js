import { fileURLToPath } from 'url';
import { dirname } from 'path';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const ServiceBenchTestPlaywright = (subclass) =>
  class extends subclass {
    name() { return 'ServiceBenchTestPlaywright'; }

    async execute() {
      await super.execute();

      // copy all static template files (no EJS-style processing needed for most)
      await this.copyTemplates(
        `${__dirname}/templates/static/**/*`,
        this.destinationPath(),
        { delimiter: '??' },
      );

      // .gitignore must be renamed (npm strips dotfiles from published packages)
      await this.copyTemplate(
        `${__dirname}/templates/gitignore`,
        this.destinationPath('.gitignore'),
        { delimiter: '??' },
      );

      // package.json is merged so users can layer extra scripts on top
      this.copyTemplateJsonInto(
        `${__dirname}/templates/package.json`,
        this.destinationPath('package.json'),
        { mode: 'merge' },
        { delimiter: '??' },
      );

      // copy cli metadata
      await this.copyTemplates(
        `${__dirname}/templates/.scdevcli/**/*`,
        this.destinationPath('.scdevcli'),
        { delimiter: '??' },
      );
    }

    async end() {
      await super.end();

      const { pluginDisplayName, pluginEntryPath } = this.templateData;

      console.log('');
      console.log(chalk.green('  ✅  E2E project generated successfully!'));
      console.log('');
      console.log(chalk.white('  Next steps:'));
      console.log('');
      console.log(chalk.cyan(`    cd ${this.destinationPath()}`));
      console.log(chalk.cyan('    git init && git add .'));
      console.log(chalk.cyan('    git commit -m "init: playwright e2e suite"'));
      console.log(chalk.cyan('    git remote add origin <your-ado-repo-url>'));
      console.log(chalk.cyan('    git push -u origin main'));

      console.log('');
      console.log(chalk.white('  ADO Pipeline (one-time setup):'));
      console.log(chalk.white('    1. Create a pipeline pointing to azure-pipelines/e2e-manual.yml'));
      console.log(chalk.white('    2. Add secret Variables: test_account / test_pwd'));
      console.log(chalk.white('    3. Ensure the pipeline uses the sc-genie agent pool'));
      console.log('');
      console.log(chalk.white('  Run smoke tests locally:'));
      console.log(chalk.cyan(`    E2E_ENV=sit TEST_ACCOUNT=<bank-id> TEST_PWD=<password> npm run test:sit:smoke`));
      console.log('');
      console.log(chalk.white(`  Plugin: ${pluginDisplayName}  |  Entry: ${pluginEntryPath}`));
      console.log('');
    }
  };
