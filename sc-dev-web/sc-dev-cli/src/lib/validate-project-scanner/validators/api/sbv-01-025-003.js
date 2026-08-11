import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { SEVERITY } from '../../index.js';

// keystore and truststore vaulting may be manually done, so let us not enforce this right now.
const CT_REQUIRED_SOURCENAMES = [
    'trust_store_ts_cert',
    'trust_store_ts_cert_key',
    'key_store_ks_cert',
    'key_store_ks_cert_key'
];

const GDCW_REQUIRED_SOURCENAMES = [
    'truststore_cert',
    'truststore_cert_key',
    'keystore_cert',
    'keystore_cert_key'
];

const CT_LIKE_FOLDER_PREFIXES = ['ct1', 'df2'];
const GDCW_STYLE_FOLDER_PREFIXES = ['gdcw1', 'gdcw2'];
const GDCW_STYLE_EXACT_FOLDERS = ['df2_uat_uk'];

const validator = (params) => {
    let result = {
        id: 'SBV-01-025-003',
        name: 'Truststore and keystore are vaulted in HCV',
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
        if (config && config.hcv && Array.isArray(config.hcv.data)) {
            const foundSourceNames = config.hcv.data.map(item => item && item.sourceName).filter(Boolean);
            if (GDCW_STYLE_EXACT_FOLDERS.includes(folder)
                || GDCW_STYLE_FOLDER_PREFIXES.some(prefix => folder.startsWith(prefix))) {
                GDCW_REQUIRED_SOURCENAMES.forEach(name => {
                    if (!foundSourceNames.includes(name)) {
                        result.messages.push(`Missing required sourceName '${name}' in hcv.data of ${folder}/${propertiesFile}`);
                    }
                });
            } else if (CT_LIKE_FOLDER_PREFIXES.some(prefix => folder.startsWith(prefix))) {
                CT_REQUIRED_SOURCENAMES.forEach(name => {
                    if (!foundSourceNames.includes(name)) {
                        result.messages.push(`Missing required sourceName '${name}' in hcv.data of ${folder}/${propertiesFile}`);
                    }
                });
            }
        } else {
            result.messages.push(`No valid hcv.data array found in ${folder}/${propertiesFile}`);
        }
    });
    if (result.messages.length === 0) {
        return [];
    } else {
        return [result];
    }
};

export default validator;