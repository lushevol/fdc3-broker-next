import yaml from 'js-yaml';
import {
	devEnvMap,
	qaEnvMap,
	prodEnvMap
} from '../../common-service-bench/env-config.js';

import { envK8sHostMap, temporalDBEnvMap } from './env-configs.js';

const DEFAULT_NON_PROD_K8S_API = 'https://vault-dev.sc.net:8200';
const DEFAULT_PROD_K8S_API = 'https://vault.global.standardchartered.com:8200';

const DEFAULT_ENV_FAMILIES = ['ct1'];

const NON_PROD_STAGES = new Set(['dev', 'sit', 'uat', 'qa', 'stg']);

const toArray = (value) => {
	if (!value) {
		return [];
	}
	return Array.isArray(value) ? value : [value];
};

const uniq = (items) => [...new Set(items.filter(Boolean))];

const getEnvFamilyAndStage = (envName) => {
	const parts = String(envName || '').split('_');
	return {
		family: parts[0] || '',
		stage: parts[1] || '',
		region: parts[2] || ''
	};
};

const normalizeStage = (stage) => {
	return stage;
};

const withServiceSuffix = (slug) => {
	const value = String(slug || '');
	return value.endsWith('-service') ? value : `${value}-service`;
};

const getFileNameFromEnv = (envName) => {
	const { family, stage, region } = getEnvFamilyAndStage(envName);
	if (!family || !stage) {
		return '';
	}
	if (stage === 'prod' && region) {
		return `${family}_${stage}_${region}`;
	}
	return `${family}_${stage}`;
};

const getDbNameByStage = (stage, projectSnake) => {
	const normalizedStage = normalizeStage(stage);
	return `pg_sb_${projectSnake}_${normalizedStage}_01`;
};

const getNamespaceByStage = (applicationId, componentId, projectSlug, stage) => {
	const normalizedStage = normalizeStage(stage);
	const namespaceSlug = withServiceSuffix(projectSlug);
	if (NON_PROD_STAGES.has(normalizedStage) && normalizedStage !== 'qa') {
		return `${normalizedStage}-${componentId}-${namespaceSlug}`;
	}
	return `${applicationId}-${componentId}-${namespaceSlug}`;
};

const getServiceHost = (envName) => {
	const hostConfig = envK8sHostMap[envName] || {};
	return hostConfig.url || hostConfig.host || '';
};

const getDbConfigForEnv = (envName, componentId) => {
	const fromMap = temporalDBEnvMap[envName];
	if (fromMap) {
		return {
			dbHost: fromMap.dbHost || '',
			dbPort: Number(fromMap.dbPort || 6524),
			dbEndPoint: (fromMap.dbHcvPath || '').replace('<%= componentId %>', componentId)
		};
	}
	return null;
};

const resolveSelectedEnvNames = (templateData) => {
	const familySelections = toArray(templateData.envs);
	const selectedFamilies = familySelections.length > 0 ? familySelections : DEFAULT_ENV_FAMILIES;
	const normalizedFamilies = selectedFamilies
		.map((family) => String(family || '').trim())
		.filter(Boolean);

	const hasDf2 = normalizedFamilies.includes('df2');

	const nonProdFamilies = hasDf2
		? ['df2']
		: normalizedFamilies.length === 1 && normalizedFamilies[0] === 'ct1'
			? ['ct1']
			: normalizedFamilies;

	const prodFamilies = hasDf2
		? ['ct1']
		: normalizedFamilies.length === 1 && normalizedFamilies[0] === 'ct1'
			? ['ct1']
			: normalizedFamilies;

	const names = [];

	nonProdFamilies.forEach((familyKey) => {

		toArray(devEnvMap[familyKey]).forEach((cfg) => names.push(cfg?.name));

		if (familyKey === 'ct1' && temporalDBEnvMap.ct1_qa_hk) {
			names.push('ct1_qa_hk');
		}

		if (qaEnvMap[familyKey]?.name) {
			names.push(qaEnvMap[familyKey].name);
		}

	});

	prodFamilies.forEach((familyKey) => {
		toArray(prodEnvMap[familyKey]).forEach((cfg) => names.push(cfg?.name));
	});

	return uniq(names);
};

const buildConfig = ({
	kubernetesServiceHost,
	dbEndPoint,
	k8sAPI,
	k8sRole,
	dbHost,
	dbPort,
	dbName,
	dbUser,
	schemaName
}) => {
	return {
		kubernetesServiceHost,
		lob: 'scb',
		dbEndPoint,
		k8sAPI,
		k8sRole,
		hcv: {
			role: k8sRole,
			data: [
				{
					path: dbEndPoint,
					sourceName: 'password',
					targetName: 'PLATFORM_DB_PWD',
					type: 'db'
				}
			]
		},
		server: {
			config: {
				persistence: {
					default: {
						driver: 'sql',
						sql: {
							host: dbHost,
							port: dbPort,
							database: dbName,
							user: dbUser,
							password: '',
							connectAttributes: {
								search_path: schemaName
							}
						}
					},
					visibility: {
						driver: 'sql',
						sql: {
							host: dbHost,
							port: dbPort,
							database: dbName,
							user: dbUser,
							password: '',
							connectAttributes: {
								search_path: schemaName
							}
						}
					}
				}
			}
		},
		postgresql: {
			enabled: true
		}
	};
};

const toFile = (name, contentObj) => {
	return {
		name,
		content: yaml.dump(contentObj, { lineWidth: -1 }),
		isAppPropConfig: false
	};
};

export const generator = (templateData = {}) => {
	const applicationId = String(templateData.applicationId || '55313');
	const componentId = String(templateData.componentId || '');
	const pluginId = String(templateData.pluginId || templateData.name);
	const projectSlug = pluginId
		.replace(/[^a-zA-Z0-9-]/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-|-$/g, '')
		.toLowerCase();
	const projectSnake = projectSlug.replace(/-/g, '_');
	const dbUser = `sb-${applicationId}-${componentId}-app`;
	const schemaName = `sb_${applicationId}_${componentId}_${projectSnake}_service_orchestration`;

	const envNames = resolveSelectedEnvNames(templateData);

	return envNames
		.map((envName) => {
			const dbConfig = getDbConfigForEnv(envName, componentId);
			if (!dbConfig) {
				return null;
			}

			const { stage } = getEnvFamilyAndStage(envName);
			const normalizedStage = normalizeStage(stage);
			const namespace = getNamespaceByStage(applicationId, componentId, projectSlug, normalizedStage);
			const k8sRole = `${applicationId}_${componentId}_app_k8s_${namespace}_role`;
			const fileName = getFileNameFromEnv(envName);

			if (!fileName) {
				return null;
			}

			const contentObj = buildConfig({
				kubernetesServiceHost: getServiceHost(envName),
				dbEndPoint: dbConfig.dbEndPoint,
				k8sAPI: normalizedStage === 'prod' ? DEFAULT_PROD_K8S_API : DEFAULT_NON_PROD_K8S_API,
				k8sRole,
				dbHost: dbConfig.dbHost,
				dbPort: dbConfig.dbPort,
				dbName: getDbNameByStage(normalizedStage, projectSnake),
				dbUser,
				schemaName
			});

			return toFile(fileName, contentObj);
		})
		.filter(Boolean)
		// Keep a stable order to make generated diffs predictable.
		.sort((a, b) => a.name.localeCompare(b.name));
};
