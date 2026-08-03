import fs from 'fs';
import yaml from 'js-yaml';

import { SEVERITY } from '../index.js';

const sonarExclusionWhitelist = [
    '**/__tests__/**',
    '**/*.test.*'
];

// SBV-01-011-003: No bypassing Sonar check for code quality
const validator = (params) => {

    let result = {
        id: 'SBV-01-011-003',
        name: 'No bypassing Sonar check for code quality',
        severity: SEVERITY.HIGH,
        path: 'azure-pipelines-npm.yml',
        messages: []
    };

    const { data, pathResolver } = params;

    let yamlConfig = null;
    try {
        const yamlFile = pathResolver(result.path);
        const yamlContent = fs.readFileSync(yamlFile, 'utf-8');
        yamlConfig = yaml.load(yamlContent);
    } catch (e) {
        result.messages.push(`Unable to load ${result.path}.`);
    }

    if (yamlConfig && yamlConfig.extends && yamlConfig.extends.parameters && yamlConfig.extends.parameters.buildStackParams) {

        const buildStackParams = yamlConfig.extends.parameters.buildStackParams;

        if (!buildStackParams.sonarSources || buildStackParams.sonarSources !== './src') {
            result.messages.push(`sonarSources is not set to ./src.`);
        }

        if (buildStackParams.sonarExclusions) {
            const notWhitelistedExclusions = [];
            buildStackParams.sonarExclusions.split(',').map((exclusion) => exclusion.trim()).filter((exclusion) => {
                if (!sonarExclusionWhitelist.includes(exclusion)) {
                    notWhitelistedExclusions.push(exclusion);
                }
            })
            if (notWhitelistedExclusions.length > 0) {
                result.messages.push(`Allowed exclusions in sonarExclusions: ${sonarExclusionWhitelist.join(',')}`)
                result.messages.push(`Found non-whitelisted exclusions: ${notWhitelistedExclusions.join(',')}`);
            }
        }

        if (buildStackParams.sonarCoverageExclusions) {
            result.messages.push(`sonarCoverageExclusions should not be set.`);
        }        

        if (!buildStackParams.generateUnitTestReport) {
            result.messages.push(`generateUnitTestReport is not set to true`);
        }

        if (!buildStackParams.generateCodeCoverage) {
            result.messages.push(`generateCodeCoverage is not set to true`);
        }

    } else {
        result.messages.push(`Unable to find buildStackParams in ${result.path}.`);
    }

    // Pass all checks
    if (result.messages.length === 0) {
        return [];
    } else {
        result.messages.push('Please update project to the latest template.')
        return [result];
    }
    
}
export default validator;