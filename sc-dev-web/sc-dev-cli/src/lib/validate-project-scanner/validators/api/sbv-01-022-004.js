import fs from 'fs';
import path from 'path';
import { SEVERITY } from '../../index.js';

const validator = (params) => {
    let result = {
        id: 'SBV-01-022-004',
        name: 'No reference to obsolete artifacts',
        severity: SEVERITY.LOW,
        path: '/',
        messages: []
    };

    const { pathResolver } = params;
    const rootPath = pathResolver('.');
    const foundDockerfiles = [];

    function findDockerfiles(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                // Skip node_modules and .git for performance
                // if (entry.name === 'node_modules' || entry.name === '.git') continue;
                findDockerfiles(fullPath);
            } else if (entry.isFile() && entry.name === 'Dockerfile') {
                foundDockerfiles.push(path.relative(rootPath, fullPath));
            }
        }
    }

    try {
        console.log("rootPath", rootPath);
        findDockerfiles(rootPath);
    } catch (e) {
        result.messages.push('Error while scanning for Dockerfile: ' + e.message);
    }

    if (foundDockerfiles.length > 0) {
        foundDockerfiles.forEach(f => {
            console.log("f", f);
            result.messages.push(`Obsolete artifact found: ${f}`);
        });
        result.messages.push('Please remove all Dockerfile files from the repository.');
        return [result];
    }
    return [];
};

export default validator;