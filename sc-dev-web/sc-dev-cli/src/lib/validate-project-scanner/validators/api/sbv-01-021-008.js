import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {SEVERITY} from '../../index.js';

const validator = (params) => {
    const result = {
        id: 'SBV-01-021-008',
        name: 'No any format of request response log  enabled in production environment',
        severity: SEVERITY.HIGH,
        path: 'src/main/resources',
        messages: []
    };
    const { pathResolver } = params;
    const resourcesPath = pathResolver('src/main/resources');
    if (!fs.existsSync(resourcesPath)) {
        // If the directory does not exist, skip check
        return [];
    }
    // Find all application*.properties files
    const files = fs.readdirSync(resourcesPath).filter(f => f.startsWith('application') && f.endsWith('.properties'));
    files.forEach(file => {
        const filePath = path.join(resourcesPath, file);
        const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
        lines.forEach((line, idx) => {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) return;

            // validate quarkus.rest-client.logging.scope=request-response
            if (/^%\w+\.quarkus\.rest-client\.logging\.scope\s*=/.test(trimmed)) return;
            const scopeMatch = trimmed.match(/^quarkus\.rest-client\.logging\.scope\s*=\s*(\S+)/);
            if (scopeMatch) {
                const value = scopeMatch[1];
                if (value === 'request-response') {
                    result.messages.push(`'quarkus.rest-client.logging.scope=request-response' is not allowed in ${file} at line ${idx + 1}. Remove this config or use a %dev prefix.`);
                }
            }
        });
    });
    if (result.messages.length === 0) {
        return [];
    } else {
        return [result];
    }
};

export default validator;
