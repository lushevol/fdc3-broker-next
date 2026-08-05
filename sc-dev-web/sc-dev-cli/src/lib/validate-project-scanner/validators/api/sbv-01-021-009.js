import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {SEVERITY} from '../../index.js';

const validator = (params) => {
    const result = {
        id: 'SBV-01-021-009',
        name: 'Verify the rest client url config',
        severity: SEVERITY.HIGH,
        path: 'src/main/resources/application.properties',
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
            const restClientUrlPattern = /^quarkus\.rest-client\.[\w\-]+\.url\s*=\s*\$\{[^}]+\}$/;
            if (restClientUrlPattern.test(trimmed)) {
                const match = trimmed.match(/\$\{([^}:]+):\s+[^}]+\}/);
                if (match) {
                    const rawVar = trimmed.match(/\$\{[^}]+\}/)[0];
                    const highlighted = rawVar.replace(/(:)(\s+)/, (m, p1, p2) => `${p1}\x1b[41m${p2}\x1b[0m`);
                    const highlightedLine = trimmed.replace(rawVar, highlighted);
                    result.messages.push(`Line ${idx + 1}: quarkus.rest-client.xxx.url variable after colon must not have space: ${highlightedLine}`);
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
