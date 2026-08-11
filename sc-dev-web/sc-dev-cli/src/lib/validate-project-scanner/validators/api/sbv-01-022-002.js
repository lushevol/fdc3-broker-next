import fs from 'fs';
import yaml from 'js-yaml';

import { SEVERITY } from '../../index.js';

import { varEnvMap } from '../../../../generators/common-service-bench/env-config.js'

const validator = (params) => {

    let result = {
        id: 'SBV-01-022-002',
        name: 'No reference to unavailable infrastructure',
        severity: SEVERITY.HIGH,
        path: 'azure-pipelines-maven.yml',
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

    if (yamlConfig && yamlConfig.extends && yamlConfig.extends.parameters && yamlConfig.extends.parameters.deployEnvironments) {

        const deployEnvironments = yamlConfig.extends.parameters.deployEnvironments;
        deployEnvironments.forEach((environment) => {
            const name = environment.name;
            if (name === 'qa' || name === 'rollback_qa' || name.startsWith('release')) {
                // Skip check
            } else {
                let checkName = name.startsWith('rollback_') ? name.replace('rollback_', ''): name;
                if (!varEnvMap[checkName]) {
                    result.messages.push(`Environment is not available: ${name}.`);
                }
            }
        });

    } else {
        result.messages.push(`Unable to find deployEnvironments in ${result.path}.`);
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