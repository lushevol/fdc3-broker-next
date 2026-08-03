import fs from 'fs';
import yaml from 'js-yaml';

import { SEVERITY } from '../index.js';

// SBV-01-012-001: Correct build image definition
const validator = (params) => {

    let result = {
        id: 'SBV-01-012-001',
        name: 'Correct build image definition',
        severity: SEVERITY.HIGH,
        path: 'image.yml',
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

    if (yamlConfig && yamlConfig.images) {

        const images = yamlConfig.images;

        if (!images['main-container-image']) {
            result.messages.push(`main-container-image is not defined`);
        } else if (
            images['main-container-image']['imagePath'] !== 'mainContainerImageName'
            || images['main-container-image']['version'] !== 'imageTags'
            || !images['main-container-image']['promote']
        ) {
            result.messages.push(`File content is not the same as the provided template`);
        }

    } else {
        result.messages.push(`Unable to find images in ${result.path}.`);
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