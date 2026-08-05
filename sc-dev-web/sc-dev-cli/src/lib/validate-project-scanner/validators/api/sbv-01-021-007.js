import fs from 'fs';
import path from 'path';
import { SEVERITY } from '../../index.js';

const validator = (params) => {
    const result = {
        id: 'SBV-01-021-007',
        name: 'No DEBUG log enabled in production environment',
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
            // Ignore lines like %dev.quarkus.log.level=debug
            if (/^%\w+\.quarkus\.log\.level\s*=/.test(trimmed)) return;
            // Only match quarkus.log.level (not starting with %)
            // or match quarkus.log.<any>.level
            const match = trimmed.match(/^quarkus\.log\..*level\s*=\s*(\w+)/);
            if (match) {
                const level = match[1].toLowerCase();
                if (level === 'debug') {
                    result.messages.push(`DEBUG log level is not allowed in ${file} at line ${idx + 1}. Use info or higher. Remove this config or use a %dev prefix.`);
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
