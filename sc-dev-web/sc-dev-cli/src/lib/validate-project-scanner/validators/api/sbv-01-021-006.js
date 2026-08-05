import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import {SEVERITY} from '../../index.js';
import { env } from 'process';

// ! This is a short term solution to unblock the validation for some of the old repos. 
// ! We will work with the team to migrate these repos to standard SB batch job or enable SIP SEP for them and then remove this exclusion list in the future.
// ! Please DO NOT add new repos to this exclusion list without approval from the platform team.
const EXCLUDED_REPOS = [
  '55313-191-monitoring-service-process-api',
  '55313-job-step-helper'
];

const FOLDER_PREFIXES = ['ct1_prod', 'gdcw1_prod', 'cn1_prd', 'gdcw2_prod', 'cn_prd', 'cn1_prod'];

function hasBatchJob(obj) {
    return obj && (Object.prototype.hasOwnProperty.call(obj, 'batchJobs') || Object.prototype.hasOwnProperty.call(obj, 'batchJob'));
}

function containsAngleBrackets(str) {
    return typeof str === 'string' && (str.includes('<') || str.includes('>'));
}

const validator = (params) => {
    const result = {
        id: 'SBV-01-021-006',
        name: 'API protected with ingress PEP sidecar',
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
        .filter(dirent => dirent.isDirectory() && FOLDER_PREFIXES.some(prefix => dirent.name.startsWith(prefix)))
        .map(dirent => dirent.name);
    if (subdirs.length === 0) {
        result.messages.push('No environment folder found with prefix ct1_prod, gdcw1_prod, gdcw2_prod, cn1_prd or cn_prd.');
        return [result];
    }

    if (env['BUILD_REPOSITORY_NAME']) {
        const repositoryName = env['BUILD_REPOSITORY_NAME'];
        if (EXCLUDED_REPOS.includes(repositoryName)) {
            console.log(`Skipping SBV-01-021-006 validation: repository '${repositoryName}' is in the excluded list.`);
            return [];
        }
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
            result.messages.push(`Failed to parse properties file in ${folder}: ${e.message}`);
            return;
        }
        if (hasBatchJob(config)) {
            // Skip enableSIP check if batchJobs or batchJob present
            console.log("Skipping enableSIP check due to presence of batchJobs or batchJob");
            return;
        }
        // enableSIP must exist at the top level and be true
        if (!Object.prototype.hasOwnProperty.call(config, 'enableSIP')) {
            result.messages.push(`enableSIP must be set at the top level in ${folder}/properties for production environment.`);
        } else if (config.enableSIP !== true) {
            result.messages.push(`enableSIP must be true in ${folder}/properties for production environment.`);
        }
        if (Array.isArray(config.binaryData)) {
            config.binaryData.forEach(item => {
                if (item.filename === 'config.json' && typeof item.data === 'string') {
                    try {
                        const jsonData = JSON.parse(item.data);
                        // Check authentication fields for <...>
                        if (jsonData.common && jsonData.common.authentication && typeof jsonData.common.authentication === 'object') {
                            Object.entries(jsonData.common.authentication).forEach(([key, value]) => {
                                if (containsAngleBrackets(value)) {
                                    result.messages.push(`config.json in ${folder}/properties: authentication field '${key}' contains angle brackets: '${value}'. Remove all placeholders like <...>.`);
                                }
                            });
                        }
                    } catch (e) {
                        result.messages.push(`config.json in ${folder}/properties is not valid JSON: ${e.message}`);
                    }
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
