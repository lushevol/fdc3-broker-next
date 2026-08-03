import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import { validateOpenApiFile } from '../../app/api-platform/openapi.js';
import { runCommand } from '../../app/api-platform/command.js';
import { cleanupTmpDirectory, createTmpDirectory } from '../../app/api-platform/tmpDir.js';

/* eslint-disable no-console */

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const GenericProcessApiJavaQuarkusGenerate = (subclass) =>
  class extends subclass {
    name() {
      return 'GenericProcessApiJavaQuarkusGenerate';
    }

    async execute() {
      await super.execute();

      /*
        To create a process_api using an open api spec,
        we first get the open api spec file from the developer.

        the file can either be in a json file extension or yml/yaml extension (to be added).
        TODO: if yml/yaml, we convert it to json to prepare it to be added into api registry.

        we should also perform validations that the file exists, is an open api spec etc.
      */

      console.log(
        `\nⓘ Information regarding creating a service bench process API using a contract-first (Open API Spec) method:\n\n`,
      );
      console.log(
        `We take in an open API spec that you provide based on your relative path, and use an openapi-generator tool to generate a set of .java files for you.`,
      );
      console.log(
        `These files will be placed in the com.sc.api.generated package, and will be checked against at CI to ensure that there won't be a desync between your code and the Open API Spec`,
      );
      console.log(
        `You must implement the Interfaces generated to ensure that your REST Application exposes the corresponding @Paths and return data according to the schema defined in the Open API Spec file`,
      );
      console.log(
        `\n⚠️ Note: @JsonProperty is available to be set via "x-field-json-property" property in open api spec, just set the property in your specification for that specific field for @JsonProperty("some_example_property") to be generated.`,
      );
      console.log('\n');

      // Load and perform validations on the open api spec.
      const openApiSpecPath = this.options.openapi;

      console.log(`\n\nⓘ Using Open API spec from ${openApiSpecPath} to generate project.`);
      await validateOpenApiFile(openApiSpecPath);

      // Error handler for file write operations.
      const errHandler = (error) => console.error('❌ ' + error);

      // We copy files to a tmp directory first, then use copyTemplates to copy ensure copy.
      const tmpDirectory = createTmpDirectory(__dirname, errHandler);

      // Copy gitignore
      console.log('⏳ Copying gitignore...');
      fs.cpSync(
        `${__dirname}/templates/gitignore`,
        path.join(tmpDirectory, '.gitignore'),
        { recursive: true },
        errHandler,
      );

      // copy maven wrapper
      console.log('⏳ Copying maven wrapper...');
      fs.cpSync(
        `${__dirname}/../../app/api-platform/files/maven`,
        tmpDirectory,
        { recursive: true },
        errHandler,
      );

      // copy openapi-generator files configurations
      console.log('⏳ Copying openapi generator files and configurations');
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
      console.log('⏳ Preparation complete, scaffolding openapi project...');
      await runCommand('mvnw clean package -s .mvn/wrapper/settings.xml', tmpDirectory);

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
      console.log('🗑️ Cleaning up generated files...');
      fs.rmSync(
        path.join(tmpDirectory, '.openapi-generator-ignore'),
        { recursive: true },
        errHandler,
      );
      fs.rmSync(path.join(tmpDirectory, '/target'), { recursive: true }, errHandler);
      fs.rmSync(path.join(tmpDirectory, '/pom.xml'), { recursive: true }, errHandler);
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

      // copy the provider files for DateTime and LocalTime types
      fs.cpSync(
        path.join(`${__dirname}/../../app/api-platform/files/providers`),
        path.join(tmpDirectory, `src/main/java/com/sc/api/generated/providers`),
        { recursive: true },
        errHandler,
      );

      // Copy .scdevcli folder, to track cli commands
      fs.cpSync(
        path.join(`${__dirname}/templates/.scdevcli/answers.xml`),
        path.join(tmpDirectory, "/.scdevcli/answers.xml"),
        { recursive: true },
      )

      // Copy API Platform assets in
      console.log('⏳ Copying API manifest...');
      fs.cpSync(
        `${__dirname}/../../app/api-platform/files/manifest/api-manifest.yml`,
        path.join(tmpDirectory, 'api/api-manifest.yml'),
        { recursive: true },
      );
      fs.cpSync(
        openApiSpecPath,
        path.join(tmpDirectory, 'api/openapi.json'),
        { recursive: true },
      );

      // Copy other static files in
      console.log('⏳ Copying other required project static files...');
      await this.copyTemplates(`${__dirname}/templates/static/**/*`, this.destinationPath(), {
        delimiter: '%',
      });

      // Copy pom xml template
      await this.copyTemplate(
        `${__dirname}/templates/pom.xml.template`,
        this.destinationPath(`pom.xml`),
        { delimiter: '%' }
      );

      // Move tmp folder in
      console.log('⏳ Copying tmp staging folder in... ' + tmpDirectory);
      await this.copyTemplates(
        tmpDirectory + '/**/*',
        this.destinationPath(),
        { recursive: true },
        { delimiter: '??' },
      );

      // clean up tmp directory
      cleanupTmpDirectory(tmpDirectory, errHandler);

      console.log('✅ Completed generation of project!');
      console.log(
        '📄 Contract-first Process API generated, write this file structure to disk to proceed.',
      );
    }
  };
