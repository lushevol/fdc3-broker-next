import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { SEVERITY } from '../../index.js';

const validator = (params) => {
    let result = {
        id: 'SBV-01-022-005',
        name: 'No duplicate name entries in envData',
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

        if (config && Array.isArray(config.envData)) {
            const names = config.envData
                .map((item, idx) => ({ name: item && item.name, idx }))
                .filter(item => item.name !== undefined && item.name !== null);

            const nameCount = names.reduce((acc, { name }) => {
                acc[name] = (acc[name] || 0) + 1;
                return acc;
            }, {});

            const duplicates = Object.entries(nameCount)
                .filter(([, count]) => count > 1)
                .map(([name]) => name);

            duplicates.forEach(dupName => {
                result.messages.push(
                    `Duplicate envData name '${dupName}' found in ${folder}/${propertiesFile}`
                );
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

