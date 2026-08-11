import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { SEVERITY } from '../../index.js';

const K8SROLE_REGEX = /^55313_\d+_app_k8s_[\w\-]+_role$/;
const CN_GDCW_GDCE_ID_K8SROLE_REGEX = /^55313_[\w\-]+_app_k8s_[\w\-]+_role$/;
const CT_K8SROLE_REGEX = /^55313_(\d+|global)_app_k8s_[\w\-]+_role$/;

const CT_FOLDER_PREFIXES = ['ct_','ct1_'];
const DF2_FOLDER_PREFIXES = ['df2_'];
const CN_GDCW_GDCE_ID_FOLDER_PREFIXES = ['gdce_','gdce1_', 'gdcw1_', 'cn_', 'cn1_', 'gdcw2_', 'id1_'];

const validator = (params) => {
    let result = {
        id: 'SBV-01-025-001',
        name: 'HCV Role in correct naming convention',
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
        if (config && config.hcv && config.hcv.role) {
            const role = config.hcv.role;
            let regexToUse = K8SROLE_REGEX;
            if (
                CT_FOLDER_PREFIXES.some(prefix => folder.startsWith(prefix)) || 
                DF2_FOLDER_PREFIXES.some(prefix => folder.startsWith(prefix))
            ) {
                regexToUse = CT_K8SROLE_REGEX;
            } else if (CN_GDCW_GDCE_ID_FOLDER_PREFIXES.some(prefix => folder.startsWith(prefix))) {
                regexToUse = CN_GDCW_GDCE_ID_K8SROLE_REGEX;
            }
            if (!regexToUse.test(role)) {
                result.messages.push(`Invalid hcv role naming in ${folder}/${propertiesFile}: ${role}`);
            }
        }
    });
    if (result.messages.length === 0) {
        return [];
    } else {
        return [result];
    }
};

export default validator;