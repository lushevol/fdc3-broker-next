import yaml from 'js-yaml';
import {
  devEnvMap,
  qaEnvMap,
  prodEnvMap
} from '../../common-service-bench/env-config.js';
import { temporalDBEnvMap } from '../../service-bench-temporal/temporal-generator/env-configs.js';

const DEFAULT_ENV_FAMILIES = ['ct1'];

const getApplicationId = (templateData) => String(templateData.applicationId || '55313');

const getComponentId = (templateData) => String(templateData.componentId || '');

const getProjectSlug = (templateData) => {
  const projectName = String(templateData.pluginId);
  return projectName
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();
};

const getProjectSnake = (templateData) => getProjectSlug(templateData).replace(/-/g, '_');

const toArray = (value) => {
  if (!value) {
    return [];
  }
  return Array.isArray(value) ? value : [value];
};

const uniq = (items) => [...new Set(items.filter(Boolean))];

const normalizeFamily = (family) => {
  const key = String(family || '').trim();
  return key;
};

const getEnvFamilyAndStage = (envName) => {
  const parts = String(envName || '').split('_');
  return {
    family: parts[0] || '',
    stage: parts[1] || '',
    region: parts[2] || ''
  };
};

const getFileNameFromEnv = (envName) => {
  const { family, stage } = getEnvFamilyAndStage(envName);
  if (!family || !stage) {
    return '';
  }
  if (stage === 'prod') {
    return `${family}_${stage}`;
  }
  return `${family}_${stage}`;
};

const getDisplayName = (envName) => {
  return String(envName || '')
    .split('_')
    .map((part) => part.toUpperCase())
    .join('-');
};

const resolveSelectedFamilies = (templateData) => {
  const selected = toArray(templateData.envs).map((item) => normalizeFamily(item)).filter(Boolean);
  return selected.length > 0 ? selected : DEFAULT_ENV_FAMILIES;
};

const resolveFamilyPlan = (templateData) => {
  const selectedFamilies = resolveSelectedFamilies(templateData);
  const hasDf2 = selectedFamilies.includes('df2');

  if (hasDf2) {
    return {
      nonProdFamilies: ['df2'],
      prodFamilies: ['ct1']
    };
  }

  if (selectedFamilies.length === 1 && selectedFamilies[0] === 'ct1') {
    return {
      nonProdFamilies: ['ct1'],
      prodFamilies: ['ct1']
    };
  }

  return {
    nonProdFamilies: selectedFamilies,
    prodFamilies: selectedFamilies
  };
};

const resolveDbEnvNames = (templateData) => {
  const { nonProdFamilies, prodFamilies } = resolveFamilyPlan(templateData);
  const names = [];

  nonProdFamilies.forEach((family) => {

    toArray(devEnvMap[family]).forEach((cfg) => names.push(cfg?.name));

    if (family === 'ct1' && temporalDBEnvMap.ct1_qa_hk) {
      names.push('ct1_qa_hk');
    }

    if (qaEnvMap[family]?.name) {
      names.push(qaEnvMap[family].name);
    }

  });

  prodFamilies.forEach((family) => {
    const prodCandidates = toArray(prodEnvMap[family]).map((cfg) => cfg?.name).filter(Boolean);
    if (prodCandidates.length > 0) {
      names.push(prodCandidates[0]);
    }
  });

  return uniq(names).filter((name) => temporalDBEnvMap[name]);
};

const getSchemaName = (templateData) => {
  return `sb_${getApplicationId(templateData)}_${getComponentId(templateData)}_${getProjectSnake(templateData)}_service_orchestration`;
};

const getDbRoleUser = (templateData) => {
  return `sb-${getApplicationId(templateData)}-${getComponentId(templateData)}-app`;
};

const getDbNameByStage = (templateData, stage) => {
  return `pg_sb_${getProjectSnake(templateData)}_${stage}_01`;
};

const getDbCfgByEnvName = (envName, componentId) => {
  const cfg = temporalDBEnvMap[envName] || {};
  return {
    dbHost: cfg.dbHost || '',
    dbPort: Number(cfg.dbPort || 6524),
    dbHcvPath: String(cfg.dbHcvPath || '').replace('<%= componentId %>', componentId)
  };
};

const getDboSecretPathByEnvName = (templateData, envName) => {
  const componentId = getComponentId(templateData);
  const cfg = getDbCfgByEnvName(envName, componentId);
  if (!cfg.dbHost) {
    return '';
  }
  return `scb/${cfg.dbHost}/static-creds/postgres_sb-${getApplicationId(templateData)}-${componentId}-dbo`;
};

const getJdbcUrl = (templateData, envName) => {
  const componentId = getComponentId(templateData);
  const { stage } = getEnvFamilyAndStage(envName);
  const cfg = getDbCfgByEnvName(envName, componentId);
  const dbName = getDbNameByStage(templateData, stage);
  return `jdbc:postgresql://${cfg.dbHost}:${cfg.dbPort}/${dbName}?currentSchema=$(SCHEMA_NAME)&sslmode=require`;
};

const getTriggers = () => {
  return ['develop', 'release/*', 'main', 'feature/*'];
};

const getParameters = () => {
  return [
    {
      name: 'releaseId',
      type: 'string',
      displayName: 'Release WorkItem ID',
      default: 'NONE'
    },
    {
      name: 'secretType',
      type: 'string',
      default: 'hc-vault',
      values: ['hc-vault', 'ado-secret']
    }
  ];
};

const getResources = () => {
  return {
    repositories: [
      {
        repository: 'templates',
        name: 'dj-core/governed-templates',
        ref: 'main',
        type: 'git'
      }
    ]
  };
};

const getVariables = (templateData) => {
  const componentId = getComponentId(templateData);
  const dbEnvNames = resolveDbEnvNames(templateData);
  const firstNonProdEnv = dbEnvNames.find((name) => getEnvFamilyAndStage(name).stage !== 'prod') || '';
  const nonProdCfg = firstNonProdEnv ? getDbCfgByEnvName(firstNonProdEnv, componentId) : { dbHost: '', dbPort: 6524 };
  return [
    {
      name: 'BRANCH_NAME',
      value: '$(Build.SourceBranchName)'
    },
    {
      name: 'VERSION',
      value: '1.0.0-$(Build.BuildId)'
    },
    {
      name: 'DB_PACKAGE_VERSION',
      value: '1.0.0-$(Build.BuildId)'
    },
    {
      name: 'DB_SNAPSHOT_VERSION',
      value: '0.0.1'
    },
    {
      name: 'SCHEMA_NAME',
      value: getSchemaName(templateData)
    },
    {
      group: `${getApplicationId(templateData)}-${componentId}-NonProd`
    }
  ];
};

const getNotifyUsers = () => {
  return 'API_Management@exchange.standardchartered.com';
};

const createDbDeployment = ({
  name,
  environment,
  displayName,
  dependsOn,
  secretPath,
  nonProdHCV = false,
  jdbcURL,
  hasGenie,
  qaStageName
}) => {
  const deployment = {
    name,
    environment,
    displayName,
    dependsOn,
    notifyUsers: getNotifyUsers(),
    pool: 'sc-linux'
  };

  if (typeof hasGenie === 'boolean') {
    deployment.hasGenie = hasGenie;
  }

  if (qaStageName) {
    deployment.qaStageName = qaStageName;
  }

  if (!jdbcURL) {
    return deployment;
  }

  deployment.devApproval = true;
  deployment.deploymentSecretConfigs = [
    {
      secretName: 'pgCred',
      secretPath
    }
  ];
  deployment.vaultDboCred = 'pgCred';

  if (nonProdHCV) {
    deployment.nonProdHCV = true;
  }

  deployment.versioning = {
    packageVersion: '$(DB_PACKAGE_VERSION)',
    command: {
      name: 'update',
      params: {
        inline: '',
        global: '--default-schema-name=$(SCHEMA_NAME)'
      }
    },
    target: {
      instance: {
        jdbcURL,
        secretType: '${{ parameters.secretType }}'
      }
    }
  };

  return deployment;
};

const getDeployEnvironments = (templateData) => {
  const dbEnvNames = resolveDbEnvNames(templateData);
  const nonProdDeployments = [];
  const prodDeployments = [];
  const qaStageNames = [];

  dbEnvNames.forEach((envName) => {
    const { stage } = getEnvFamilyAndStage(envName);
    const outputName = getFileNameFromEnv(envName);
    if (!outputName) {
      return;
    }

    const environment = stage === 'prod' ? 'production' : stage === 'qa' ? 'qa' : 'dev';
    const dependsOn = [];

    if (stage === 'dev' || stage === 'sit') {
      dependsOn.push('CI');
    } else if (stage === 'uat') {
      const sitName = outputName.replace('_uat', '_sit');
      dependsOn.push(dbEnvNames.some((n) => getFileNameFromEnv(n) === sitName) ? sitName : 'CI');
    } else if (stage === 'qa') {
      const uatName = outputName.replace('_qa', '_uat');
      dependsOn.push(dbEnvNames.some((n) => getFileNameFromEnv(n) === uatName) ? uatName : 'CI');
      qaStageNames.push(outputName);
    } else if (stage === 'prod') {
      dependsOn.push('release');
    }

    const deployment = createDbDeployment({
      name: outputName,
      environment,
      displayName: getDisplayName(outputName),
      dependsOn,
      secretPath: getDboSecretPathByEnvName(templateData, envName),
      nonProdHCV: stage !== 'prod',
      jdbcURL: stage === 'prod' ? '$(catalystPdJDBCURL)' : getJdbcUrl(templateData, envName)
    });

    if (stage === 'prod') {
      prodDeployments.push(deployment);
      return;
    }

    nonProdDeployments.push(deployment);
  });

  const releaseChecksDepends = qaStageNames.length ? qaStageNames : ['CI'];
  const qaStageName = qaStageNames[0] || 'qa';

  const deployments = [...nonProdDeployments];

  deployments.push(
    createDbDeployment({
      name: 'release_checks',
      environment: 'pre-release',
      displayName: 'Release Checks',
      dependsOn: releaseChecksDepends,
      hasGenie: false,
      qaStageName
    })
  );

  deployments.push(
    createDbDeployment({
      name: 'release',
      environment: 'release',
      displayName: 'Release',
      dependsOn: ['release_checks'],
      hasGenie: false
    })
  );

  return deployments.concat(prodDeployments);
};

const getTemplateParameters = (templateData) => {
  const applicationId = getApplicationId(templateData);
  const componentId = getComponentId(templateData);
  return {
    releaseId: '${{ parameters.releaseId }}',
    featureRelease: true,
    ITAM: applicationId,
    subITAM: componentId,
    adoManagedVault: true,
    instanceId: componentId,
    buildStackName: 'generic',
    buildStackParams: {
      pool: 'sc-linux',
      featureRelease: true,
      featureBranchScan: true,
      archiveType: 'zip',
      database: {
        versioning: {
          packageVersion: '$(DB_PACKAGE_VERSION)',
          snapshotVersion: '$(DB_SNAPSHOT_VERSION)',
          enabled: true
        }
      }
    },
    deployStackName: 'database',
    deployEnvironments: getDeployEnvironments(templateData)
  };
};

export const generator = (templateData = {}) => {
  const pipelineYml = {
    trigger: getTriggers(),
    parameters: getParameters(),
    resources: getResources(),
    variables: getVariables(templateData),
    extends: {
      template: 'governed-template/build-and-deploy.yml@templates',
      parameters: getTemplateParameters(templateData)
    }
  };

  return {
    file: 'azure-pipelines-generic.yml',
    content: yaml.dump(pipelineYml, {
      lineWidth: -1
    })
  };
};
