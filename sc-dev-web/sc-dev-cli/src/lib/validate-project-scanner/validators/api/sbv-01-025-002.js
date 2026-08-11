import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { SEVERITY } from '../../index.js';

const validator = (params) => {
    let result = {
        id: 'SBV-01-025-002',
        name: 'HCV Path and Source in correct naming convention',
        severity: SEVERITY.HIGH,
        path: 'env/',
        messages: []
    };

    const { pathResolver } = params;
    const envPath = pathResolver('env');
    if (!fs.existsSync(envPath)) {
        result.messages.push('env directory does not exist.');
        return [result];
    }
    const subdirs = fs.readdirSync(envPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);
    subdirs.forEach(folder => {
        const folderPath = path.join(envPath, folder);
        const files = fs.readdirSync(folderPath);
        const propertiesFile = files.find(f => /^properties(\..*)?$/.test(f));
        if (!propertiesFile) return;
        const propertiesPath = path.join(folderPath, propertiesFile);
        let config;
        try {
            const content = fs.readFileSync(propertiesPath, 'utf8');
            config = yaml.load(content);
        } catch (e) {
            result.messages.push(`Failed to parse properties file in ${folder}: ${e.message}`);
            return;
        }
        // Validate: sourceName of HCV data must NOT start with number
        if (config && config.hcv && Array.isArray(config.hcv.data)) {
            config.hcv.data.forEach((item, idx) => {
                if (item && typeof item.sourceName === 'string' && /^\d/.test(item.sourceName)) {
                    result.messages.push(`Invalid HCV sourceName in ${folder}/${propertiesFile} (hcv.data[${idx}]): sourceName '${item.sourceName}' must NOT start with a number.`);
                }
            });
        }
    });
    if (result.messages.length === 0) {
        return [];
    } else {
        return [result];
    }
};

export default validator;