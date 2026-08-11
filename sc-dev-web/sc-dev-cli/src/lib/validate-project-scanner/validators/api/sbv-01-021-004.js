import fs from 'fs';
import yaml from 'js-yaml';
import {SEVERITY} from '../../index.js';

const WHITELIST = [
    '**/test/**',
    '**/*.yml',
    '**/*.yaml',
    '**/*.xml',
];

function isInWhitelist(pattern) {
    return WHITELIST.some((white) => pattern.trim() === white);
}

const validator = (params) => {
    const result = {
        id: 'SBV-01-021-004',
        name: 'No bypassing Sonar check for code quality',
        severity: SEVERITY.HIGH,
        path: 'azure-pipelines-maven.yml',
        messages: []
    };

    const {pathResolver} = params;
    const ymlPath = pathResolver(result.path);
    if (!fs.existsSync(ymlPath)) {
        result.messages.push('azure-pipelines-maven.yml does not exist');
        return [result];
    }
    let yml;
    try {
        yml = yaml.load(fs.readFileSync(ymlPath, 'utf8'));
    } catch (e) {
        result.messages.push('Failed to parse azure-pipelines-maven.yml: ' + e.message);
        return [result];
    }
    const buildStackParams = yml?.extends?.parameters?.buildStackParams;
    if (!buildStackParams) {
        result.messages.push('azure-pipelines-maven.yml is missing extends.parameters.buildStackParams configuration');
        return [result];
    }
    // Check sonarSources
    if (buildStackParams.sonarSources !== 'src/main') {
        result.messages.push(`sonarSources must be src/main, current: ${buildStackParams.sonarSources}`);
    }
    // Check sonarExclusions
    if (buildStackParams.sonarExclusions) {
        const exclusions = buildStackParams.sonarExclusions.split(',').map((s) => s.trim());
        const notAllowed = exclusions.filter((item) => !isInWhitelist(item));
        if (notAllowed.length > 0) {
            result.messages.push(`sonarExclusions contains not allowed values: ${notAllowed.join(', ')}. Only allowed: ${WHITELIST.join(', ')}`);
        }
    }
    if (result.messages.length === 0) {
        return [];
    } else {
        result.messages.push('Please update sonarSources and sonarExclusions according to the template.');
        return [result];
    }
};

export default validator;
