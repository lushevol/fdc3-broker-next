import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

import { SEVERITY } from '../../index.js';

const PROD_PREFIXES = ['ct1_prod', 'gdcw1_prod', 'cn1_prd', 'gdcw2_prod', 'cn_prd', 'cn1_prod'];
const LOWER_ENV_KEYWORDS = ['dev', 'sit', 'qa', 'test', 'uat'];

const validator = (params) => {
    let result = {
        id: 'SBV-01-022-003',
        name: 'No cross reference among different environment',
        severity: SEVERITY.HIGH,
        path: 'env/',
        messages: []
    };

    const {pathResolver} = params;
    const envPath = pathResolver('env');
    if (!fs.existsSync(envPath)) {
        result.messages.push('env directory does not exist.');
        return [result];
    }

    const subdirs = fs.readdirSync(envPath, {withFileTypes: true})
        .filter(dirent => dirent.isDirectory() && PROD_PREFIXES.some(prefix => dirent.name.startsWith(prefix)))
        .map(dirent => dirent.name);
    if (subdirs.length === 0) {
        result.messages.push('No environment folder found with prefix ct1_prod, gdcw1_prod, gdcw2_prod, cn_prd or cn1_prd.');
        return [result];
    }
    subdirs.forEach(folder => {
        const folderPath = path.join(envPath, folder);
        // Find any file in the folder whose name starts with 'properties' (no extension restriction)
        const files = fs.readdirSync(folderPath);
        const propertiesFile = files.find(f => /^properties(\..*)?$/.test(f));
        if (!propertiesFile) {
            result.messages.push(`Missing properties file in ${folder}`);
            return;
        }
        const propertiesPath = path.join(folderPath, propertiesFile);
        let config;
        try {
            const content = fs.readFileSync(propertiesPath, 'utf8');
            config = yaml.load(content);
        } catch (e) {
            result.messages.push(`Failed to parse properties in ${folder.name}: ${e.message}`);
            return;
        }
        if (!config || !config.binaryData || !Array.isArray(config.binaryData)) return;
        config.binaryData.forEach(item => {
            if ((item.filename === 'config.json' || item.filename === 'config-egress.json') && typeof item.data === 'string') {
                let json;
                try {
                    json = JSON.parse(item.data);
                } catch (e) {
                    result.messages.push(`${folder}/properties: ${item.filename} is not valid JSON.`);
                    return;
                }
                const tokenUrl = json?.common?.authentication?.token_url;
                if (typeof tokenUrl === 'string') {
                    let host = '';
                    try {
                        host = new URL(tokenUrl).host;
                    } catch (e) {
                        result.messages.push(`${folder}/properties: ${item.filename} token_url is not a valid URL: ${tokenUrl}`);
                        return;
                    }
                    const lowerEnv = LOWER_ENV_KEYWORDS.find(k => host.toLowerCase().includes(k));
                    if (lowerEnv) {
                        result.messages.push(`${folder}/properties: ${item.filename} token_url domain must not contain lower environment keywords (dev, sit, qa, etc). Found: ${host}`);
                    }
                }
            }
        });
    });
    if (result.messages.length === 0) {
        return [];
    } else {
        return [result];
    }
}
export default validator;