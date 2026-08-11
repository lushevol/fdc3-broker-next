import fs from 'fs';

import { SEVERITY } from '../index.js';

// SBV-01-012-003: No reference to obsolete artifacts
const validator = (params) => {

    const template = {
        id: 'SBV-01-012-003',
        name: 'No reference to obsolete artifacts',
        severity: SEVERITY.LOW,
        messages: []
    };
    const result = [];

    const { data, pathResolver } = params;

    const dockerFile = pathResolver('Dockerfile');
    if (fs.existsSync(dockerFile)) {
        result.push({
            ...template,
            path: 'Dockerfile',
            messages: ['Dockerfile is no longer required. You can delete this file.']
        })
    }

    return result;
    
}
export default validator;