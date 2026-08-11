import fs from 'fs';
import yaml from 'js-yaml';
import semver from 'semver';
import {SEVERITY} from '../../index.js';
import {latestHelmChart, latestBuildPacks} from '../../../../generators/common-service-bench/build-config.js';

const getVersionDetails = (version) => {
    let semverVersion = '';
    let timestamp = '';
    let buildNumber = '';
    const versions = version.split('+');
    semverVersion = versions[0];
    if (versions.length > 1) {
        const metadata = versions[1];
        const metadataParts = metadata.split('.');
        timestamp = metadataParts[0];
        if (metadataParts.length > 1) {
            try {
                buildNumber = parseInt(metadataParts[1]);
            } catch (e) {
                buildNumber = 0;
            }
        }
    }
    return {
        version: semverVersion,
        timestamp,
        buildNumber
    }
}

const isVersionOutdated = (projectVersion, latestVersion) => {
    const {
        version: projectSemverVersion,
        timestamp: projectTimestamp,
        buildNumber: projectBuildNumber
    } = getVersionDetails(projectVersion);
    const {
        version: latestSemverVersion,
        timestamp: latestTimestamp,
        buildNumber: latestBuildNumber
    } = getVersionDetails(latestVersion);
    // Compare versions
    if (semver.lt(projectSemverVersion, latestSemverVersion)) {
        return true;
    }
    // If semver versions are equal, compare timestamps
    else if (projectSemverVersion === latestSemverVersion) {
        if (projectTimestamp < latestTimestamp) {
            return true;
        }
        // If timestamps are equal, compare build numbers
        else if (projectTimestamp === latestTimestamp) {
            if (projectBuildNumber < latestBuildNumber) {
                return true;
            }
        }
    }
    return false;
}

// SBV-01-021-001: Latest DevKit Helm Chart and Buildpack are used
const validator = (params) => {

    let result = {
        id: 'SBV-01-021-001',
        name: 'Latest DevKit Helm Chart and Buildpack are used',
        severity: SEVERITY.HIGH,
        path: 'azure-pipelines-maven.yml',
        messages: []
    };

    const {data, pathResolver} = params;

    let yamlConfig = null;
    try {
        const yamlFile = pathResolver(result.path);
        const yamlContent = fs.readFileSync(yamlFile, 'utf-8');
        yamlConfig = yaml.load(yamlContent);
    } catch (e) {
        result.messages.push(`Unable to load ${result.path}.`);
    }

    if (yamlConfig && yamlConfig.parameters) {

        const devKitHelmVersion = yamlConfig.parameters.find((parameter) => parameter.name === 'devkitHelmVersion');
        const projectDevKitHelmVersion = devKitHelmVersion ? devKitHelmVersion.default : null;
        if (!devKitHelmVersion) {
            result.messages.push(`Unable to find devkitHelmVersion parameter in ${result.path}.`);
        } else if (isVersionOutdated(projectDevKitHelmVersion, latestHelmChart)) {
            result.messages.push(`devkitHelmVersion = ${projectDevKitHelmVersion}, is older than recommended version: ${latestHelmChart}.`);
        }

        const buildpackVersion = yamlConfig.parameters.find((parameter) => parameter.name === 'buildpackVersion');
        const projectBuildpackVersion = buildpackVersion ? buildpackVersion.default : null;
        const latestBuildpackVersion = latestBuildPacks['quarkus'];
        if (!projectBuildpackVersion) {
            result.messages.push(`Unable to find buildpackVersion parameter in ${result.path}.`);
        } else if (isVersionOutdated(`1.0.0+${projectBuildpackVersion}`, `1.0.0+${latestBuildpackVersion}`)) {
            result.messages.push(`buildpackVersion = ${projectBuildpackVersion}, is older than recommended version: ${latestBuildpackVersion}.`);
        }

    } else {
        result.messages.push(`Unable to find parameters in ${result.path}.`);
    }

    // Pass all checks
    if (result.messages.length === 0) {
        console.log("All checks passed for SBV-01-021-001");
        return [];
    } else {
        result.messages.push('Please update project to the latest template.')
        return [result];
    }

}
export default validator;