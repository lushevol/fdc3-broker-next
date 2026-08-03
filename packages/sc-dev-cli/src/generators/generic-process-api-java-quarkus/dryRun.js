import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { exit } from 'process';
import { runCommand } from '../../app/api-platform/command.js';
import { validateOpenApiFile } from '../../app/api-platform/openapi.js';
import { cleanupTmpDirectory, createTmpDirectory } from '../../app/api-platform/tmpDir.js';
import { readYmlFile } from '../../app/api-platform/ymlReader.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const GenericProcessApiJavaQuarkusDryRun = (subclass) =>
  class extends subclass {
    name() {
      return 'GenericProcessApiJavaQuarkusDryRun';
    }

    getAllFiles(dir, fileList = []) {
      const files = fs.readdirSync(dir);
      files.forEach((file) => {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
          this.getAllFiles(filePath, fileList);
        } else {
          fileList.push(filePath);
        }
      });
      return fileList;
    }

    hashFile(filePath) {
      const fileBuffer = fs.readFileSync(filePath);
      return crypto.createHash('sha256').update(fileBuffer).digest('hex');
    }

    compareTwoFoldersFileContents(folder1Path, folder2Path) {
      const files1 = this.getAllFiles(folder1Path).map((f) => path.relative(folder1Path, f));
      const files2 = this.getAllFiles(folder2Path).map((f) => path.relative(folder2Path, f));

      if (JSON.stringify(files1.sort()) !== JSON.stringify(files2.sort())) {
        console.error('Folders have different files! Files not in sync.');
        return false;
      }

      console.log('\n\nComparing generated file hashes with your project...');

      const errors = [];
      for (const file of files1) {
        const hash1 = this.hashFile(path.join(folder1Path, file));
        const hash2 = this.hashFile(path.join(folder2Path, file));

        if (hash1 !== hash2) {
          errors.push(`❌ Mismatch in file: ${file}`);
        } else {
          console.log(`✅ Found match for ${file}!`);
        }
      }

      if (errors.length > 0) {
        errors.forEach((err) => console.error(err));
        console.error('❌ File contents not the same, not in sync.');
        return false;
      }

      return true;
    }

    async execute() {
      await super.execute();

      // To check if the current generated code is valid, hash the current open api spec
      // Generate the code into a tmp folder
      // Hash the generated folder
      // Compare the hashes, if same then its legit
      // Then check the API interfaces are implemented via unit test
      console.log(`\nⓘ Information regarding test syncing/dry run process API with Open API Spec:\n\n`);
      console.log(
        `To check if the current project is valid against the Open API Spec found found in the API manifest $refs during compile time, we perform 2 checks:`,
      );
      console.log(
        '\n1: We check if the generated code matches the current Open API Spec, by hashing the contents - if they are the same, that guarantees that the models are implemented correctly.',
      );
      console.log(
        '\n2: We check that you implemented all interfaces in the generated package. This ensures that the proper rest endpoints are exposed in your REST App and since the return type of each endpoint is the Model, we can guarantee that endpoints are returning data in the correct schema',
      );
      console.log(
        '\n⚠️ Note that error schemas are not currently being checked in this version of sc-devkit. Only the success or happy-flow response schemas are being checked against at compile time.\n',
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
          `❌ It looks like you don't have an api spec found in ${openApiSpecPath}, can you check you are in the correct directory? You should be in the root directory of your project.`,
        );
        exit(1);
      }

      // First check if they have any generated files
      if (!fs.existsSync('./src/main/java/com/sc/api/generated')) {
        console.error(
          "❌ It looks like you don't have any files generated, please generate them using the resync command in scdevkit",
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

      // Move the target files to the correct directory
      console.log('✅ Generation successful, moving generated files to /src/main/java');
      fs.cpSync(
        path.join(tmpDirectory, '/target/generated-sources/openapi/src/main/java'),
        path.join(tmpDirectory, '/src/main/java'),
        { recursive: true },
        errHandler,
      );

      // copy the provider files as well for DateTime and LocalTime
      fs.cpSync(
        path.join(`${__dirname}/../../app/api-platform/files/providers`),
        path.join(tmpDirectory, `/src/main/java/com/sc/api/generated/providers`),
        { recursive: true },
        errHandler
      );

      // Check project generated files match against open api spec generated files
      // Hash folder contents
      const generatedFolderPath = './src/main/java/com/sc/api/generated';
      const tmpDirectoryGeneratedPath = path.join(
        tmpDirectory,
        './src/main/java/com/sc/api/generated',
      );
      const areFilesInSync = this.compareTwoFoldersFileContents(
        generatedFolderPath,
        tmpDirectoryGeneratedPath,
      );

      if (areFilesInSync) {
        console.log('✅ Completed check for file hashes, files are in sync!');
      } else {
        console.error(
          '❌ Completed check for file hashes, files are not in sync... drift in code detected compared to open api spec.',
        );
        exit(1);
      }

      // Check interfaces implemented
      await runCommand('mvnw test -Dtest=OpenApiSpecSyncTest -s .mvn/wrapper/settings.xml');

      // clean up tmp directory
      cleanupTmpDirectory(tmpDirectory, errHandler);

      console.log("✅ Completed dry run, your code is in sync with your open API spec!")
    }
  };
