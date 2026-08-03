import fs from 'fs/promises';
import {parseStringPromise} from 'xml2js';
import {SEVERITY} from '../../index.js';
import {latestParentVersion} from '../../../../generators/common-service-bench/build-config.js';

const PARENT_CONFIGS = [
    {
        groupId: 'com.sc.devkit',
        artifactId: 'graphql-parent',
        minVersion: latestParentVersion["graphql-kotlin"],
    },
    {
        groupId: 'com.sc.devkit',
        artifactId: 'graphql-parent-java',
        minVersion: latestParentVersion["graphql-java"],
    },
    {
        groupId: 'com.sc.devkit',
        artifactId: 'process-parent-java',
        minVersion: latestParentVersion["process-java"],
    },
    {
        groupId: 'com.sc.devkit',
        artifactId: 'process-parent-kotlin',
        minVersion: latestParentVersion["process-kotlin"],
    },
    {
        groupId: 'com.sc.devkit.api',
        artifactId: 'devkit-api-common',
        minVersion: latestParentVersion["process-common-api"],
    },
    {
        groupId: 'com.sc.devkit',
        artifactId: 'devkit-graphql-common',
        minVersion: latestParentVersion["graphql-common"],
    },
];

function parseVersion(ver) {
    // example 4.0.0-8054678
    const [main, num] = ver.split('-');
    return {main, num: Number(num)};
}

function isVersionLower(current, minimum) {
    const c = parseVersion(current);
    const m = parseVersion(minimum);
    if (c.main < m.main) return true;
    if (c.main > m.main) return false;
    // when main are equal, compare number
    return c.num < m.num;
}

export default async function ({data, pathResolver}) {
    const result = {
        id: 'SBV-01-021-002',
        name: 'Latest experience api or process api parent and dependency version are used',
        severity: SEVERITY.HIGH,
        path: 'pom.xml',
        messages: [],
    };
    let pomContent = '';
    let pomPath = '';
    try {
        pomPath = pathResolver('pom.xml');
        pomContent = await fs.readFile(pomPath, 'utf-8');
    } catch (e) {
        result.messages.push(`read pom failed: ${e.message}`);
        return [result];
    }
    let pom;
    try {
        pom = await parseStringPromise(pomContent);
    } catch (e) {
        result.messages.push(`parse pom.xml failed: ${e.message}`);
        return [result];
    }
    // check parent
    const parent = pom?.project?.parent?.[0];
    if (!parent) {
        return [];
    }
    const parentGroupId = parent.groupId?.[0];
    const parentArtifactId = parent.artifactId?.[0];
    const parentVersion = parent.version?.[0];
    for (const cfg of PARENT_CONFIGS) {
        if (parentGroupId === cfg.groupId && parentArtifactId === cfg.artifactId) {
            if (isVersionLower(parentVersion, cfg.minVersion)) {
                result.messages.push(
                    `Parent ${parentGroupId}:${parentArtifactId} version ${parentVersion} is lower than required minimum ${cfg.minVersion}.`
                );
            }
        }
    }

    // check dependencies
    const properties = pom?.project?.properties?.[0] || {};
    const versionMap = {};
    for (const [key, val] of Object.entries(properties)) {
        if (Array.isArray(val) && val.length > 0) {
            versionMap[key] = val[0];
        }
    }

    const dependenciesNode = pom?.project?.dependencies?.[0];
    const dependencies = Array.isArray(dependenciesNode?.dependency) ? dependenciesNode.dependency : [];
    for (const dep of dependencies) {
        const groupId = dep.groupId?.[0];
        const artifactId = dep.artifactId?.[0];
        let version = dep.version?.[0];
        if (version && version.startsWith('${') && version.endsWith('}')) {
            const varName = version.slice(2, -1);
            if (versionMap[varName]) {
                version = versionMap[varName];
            } else {
                result.messages.push(
                    `Dependency ${groupId}:${artifactId} version uses variable \${${varName}}, but not found in <properties>.`
                );
                continue;
            }
        }
        for (const cfg of PARENT_CONFIGS) {
            if (groupId === cfg.groupId && artifactId === cfg.artifactId) {
                if (isVersionLower(version, cfg.minVersion)) {
                    result.messages.push(
                        `Dependency ${groupId}:${artifactId} version ${version} is lower than required minimum ${cfg.minVersion}.`
                    );
                }
            }
        }
    }
    if (result.messages.length === 0) {
        return [];
    } else {
        result.messages.push('Please update parent or dependency version in pom.xml to the latest recommended version.');
        return [result];
    }
}
