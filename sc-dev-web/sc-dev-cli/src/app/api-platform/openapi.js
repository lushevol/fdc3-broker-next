import fs from 'fs';
import { exit } from 'process';
import { Validator } from '@seriousme/openapi-schema-validator';

export async function validateOpenApiFile(path) {
  console.log('⏳ Performing Open API Spec validations for file: ' + path);
  console.log('⏳ Checking if open api spec is valid...');
  const isValidFile = fs.existsSync(path) && fs.statSync(path).isFile();
  if (!isValidFile) {
    console.error(
      `❌ The file "${path}" is not valid or does not exist. Please use a valid file.`,
    );
    exit(1);
  } else {
    console.log(`✅ "${path}" exists and is a valid file!`);
  }

  console.log('⏳ Checking if open api spec is a json file...');
  if (!isJsonFile(path)) {
    console.error(`❌ The file "${path}" is not a valid JSON file, please note that only JSON Open API specs 
    are supported in this release, yml/yaml support will be added in the future.`);
    exit(1);
  } else {
    console.log(`✅ "${path}" is a json file!`);
  }

  console.log('⏳ Checking if open api spec is a valid v3 spec...');
  if (!(await isValidOpenAPI(path))) {
    console.error(`❌ The file "${path}" is not a valid Open API spec. 
        Please note that we only support v3.0 and v3.1 versions for Open API.`);
    exit(1);
  } else {
    console.log(`✅ "${path}" is a valid v3 Open API spec!`);
  }
}

function isJsonFile(filePath) {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf-8');
    JSON.parse(fileContents);
    return true;
  } catch (err) {
    console.error('❌ ' + err);
    return false;
  }
}

async function isValidOpenAPI(filePath) {
  const validator = new Validator();
  const res = await validator.validate(filePath);

  if (!res.valid) {
    console.log('❌ Open API Spec does not match schema. It is invalid.');
    console.log(res.errors);
    return false;
  }

  const version = validator.version;
  // Note: we only support 3.0 and not 3.1 because the quarkus codegen does not support 3.1.x currently.
  // Also, as per API governance standards, only support >= 3.0 openapi
  const isSupportedVersion = version === '3.0' || '3.1';
  if (!isSupportedVersion) {
    console.log(
      `❌ Version: ${version} is not a supported version. Only 3.0 and 3.1 is currently supported.`,
    );
    return false;
  }

  console.log('✅ Open API spec is valid!');
  return true;
}
