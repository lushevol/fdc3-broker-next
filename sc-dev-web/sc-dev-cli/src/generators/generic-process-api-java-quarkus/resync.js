import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { exit } from 'process';
import { runCommand } from '../../app/api-platform/command.js';
import { validateOpenApiFile } from '../../app/api-platform/openapi.js';
import { cleanupTmpDirectory, createTmpDirectory } from '../../app/api-platform/tmpDir.js';
import { readYmlFile } from '../../app/api-platform/ymlReader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const GenericProcessApiJavaQuarkusResync = (subclass) =>
  class extends subclass {
    name() {
      return 'GenericProcessApiJavaQuarkusResync';
    }

    async execute() {
      await super.execute();

      console.log(`\nⓘ Information regarding resyncing process API with Open API Spec:\n\n`);
      console.log(
        `To resync your project, we use your current Open API Spec found in the API manifest $refs to generate the new files.`,
      );
      console.log(
        `\n⚠️ Note: @JsonProperty is available to be set via "x-field-json-property" property in open api spec, just set the property in your specification for that specific field for @JsonProperty("some_example_property") to be generated.`,
      );
      console.log('\n');

      if (!fs.existsSync("./api/api-manifest.yml")) {
        console.error(
          "❌ It looks like you don't have an api manifest found in /api/api-manifest.yml, can you check you are in the correct directory? You should be in the root directory of your project.",
        );
        exit(1);
      }

      // TODO: Only do the first open api spec for now, do the rest next time.
      const manifest = readYmlFile("./api/api-manifest.yml")
      const openApiSpecPath = manifest.spec.documentation[0].$ref;

      if (!fs.existsSync(openApiSpecPath)) {
        console.error(
          "❌ It looks like you don't have an api spec, can you check you are in the correct directory? You should be in the root directory of your project.",
        );
        exit(1);
      }

      // Load and perform validations on the open api spec.
      console.log(`\n\nⓘ Using Open API spec from ${openApiSpecPath} to generate project.`);
      await validateOpenApiFile(openApiSpecPath);

      // Error handler for file write operations.
      const errHandler = (error) => console.error('❌ ' + error);

      // We copy files to a tmp directory first, then use copyTemplates to copy ensure copy.
      const tmpDirectory = createTmpDirectory(__dirname, errHandler);

      // Clean up generated package first
      if (fs.existsSync('./src/main/java/com/sc/api/generated')) {
        fs.rmSync('./src/main/java/com/sc/api/generated', { recursive: true }, errHandler);
      }

      // copy maven wrapper
      console.log('⏳ Copying maven wrapper...');
      fs.cpSync(
        `${__dirname}/../../app/api-platform/files/maven`,
        tmpDirectory,
        { recursive: true },
        errHandler,
      );

      // copy pom.xml and openapi-generator configurations
      console.log('⏳ Copying pom.xml and openapi generator configurations');
      fs.cpSync(
        `${__dirname}/../../app/api-platform/files/openapi-generator`,
        tmpDirectory,
        { recursive: true },
        errHandler,
      );

      // Copy the open api file to the resources folder, so that we can use it to generate code.
      console.log('⏳ Copying open api spec file...');
      fs.cpSync(
        openApiSpecPath,
        path.join(tmpDirectory, '/src/main/resources/openapi.json'),
        { recursive: true },
        errHandler,
      );

      /*
        We use mvnw or maven wrapper to remove maven dependency from the developer.
      */
      // Use maven to generate the project
      await runCommand('mvnw clean package -s .mvn/wrapper/settings.xml', tmpDirectory);
      
      // copy the provider files as well for DateTime and LocalTime
      fs.cpSync(
        path.join(`${__dirname}/../../app/api-platform/files/providers`),
        path.join(tmpDirectory, `/src/main/java/com/sc/api/generated/providers`),
        { recursive: true },
        errHandler
      );
      
      // Move the target files to the correct directory
      console.log('✅ Generation successful, moving generated files to /src/main/java');
      fs.cpSync(
        path.join(tmpDirectory, '/target/generated-sources/openapi/src/main/java'),
        path.join(tmpDirectory, '/src/main/java'),
        { recursive: true },
        errHandler,
      );

      /*
        Clean up unnecessary files from the generated folder
      */
      // Remove target folder
      console.log('🗑️ Cleaning up generated files...');
      fs.rmSync(
        path.join(tmpDirectory, '.openapi-generator-ignore'),
        { recursive: true },
        errHandler,
      );
      fs.rmSync(path.join(tmpDirectory, '/target'), { recursive: true }, errHandler);
      fs.rmSync(path.join(tmpDirectory, '/pom.xml'), { recursive: true }, errHandler);
      fs.rmSync(path.join(tmpDirectory, '/mvnw'), { recursive: true }, errHandler);
      fs.rmSync(path.join(tmpDirectory, '/mvnw.cmd'), { recursive: true }, errHandler);
      fs.rmSync(path.join(tmpDirectory, '/.mvn'), { recursive: true }, errHandler);
      fs.rmSync(
        path.join(tmpDirectory, '/src/main/resources/openapi.json'),
        { recursive: true },
        errHandler,
      );
      fs.rmdirSync(
        path.join(tmpDirectory, '/src/main/resources/templates'),
        { recursive: true },
        errHandler,
      );

      console.log('⏳ Copying tmp staging folder in... ' + tmpDirectory);
      await this.copyTemplates(
        tmpDirectory + '/**/*',
        './',
        { recursive: true },
        { delimiter: '??' },
      );

      // clean up tmp directory
      cleanupTmpDirectory(tmpDirectory, errHandler);

      console.log('✅ Completed generation of project!');
      console.log(
        '📄 Contract-first code files generated, write this file structure to disk to proceed.',
      );
    }
  };
