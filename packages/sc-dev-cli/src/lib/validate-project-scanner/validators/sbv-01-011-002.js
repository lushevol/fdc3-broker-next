import fs from 'fs';
import { exec } from 'node:child_process';

import { SEVERITY } from '../index.js';

// SBV-01-011-002: No critical npm dependencies
const validator = async (params) => {

    const template = {
        id: 'SBV-01-011-002',
        name: 'No critical npm dependencies',
        severity: SEVERITY.HIGH,
        messages: []
    };
    const result = [];

    const { data, pathResolver } = params;

    const packageLockFile = pathResolver('package-lock.json');
    if (!fs.existsSync(packageLockFile)) {
        result.push({
            ...template,
            path: 'package-lock.json',
            messages: ['package-lock.json cannot be found. Run npm install first.']
        });
    } else {
        const execPromise = new Promise((resolve, reject) => {
            exec(`npm audit --dry-run --audit-level=none --json`, (error, stdout, stderr) => {
                if (error) {
                    reject({ error, stdout, stderr });
                } else {
                    resolve({ stdout, stderr });
                }
            });
        });
        try {
            const { stdout } = await execPromise;
            const { metadata: { vulnerabilities }} = JSON.parse(stdout);
            const { critical } = vulnerabilities;
            if (critical > 0) {
                result.push({
                    ...template,
                    path: 'package-lock.json',
                    messages: [
                        `Found ${critical} critical vulnerabilities.`,
                        `Run npm audit for full result`
                    ]
                });
            }
        } catch (e) {
            result.push({
                ...template,
                path: 'package-lock.json',
                messages: ['Unable to complete npm audit']
            });
        }

    }

    return result;
    
}
export default validator;