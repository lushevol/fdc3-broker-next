import yaml from 'js-yaml';
import {
  devEnvMap,
  qaEnvMap,
  prodEnvMap
} from '../../common-service-bench/env-config.js';

const DEFAULT_ENV_FAMILIES = ['ct1'];

const getTriggers = () => {
  return [
    'release/*',
    'develop',
    'feature/*'
  ];
};

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

const getApplicationId = (templateData) => String(templateData.applicationId || '55313');

const getComponentId = (templateData) => String(templateData.componentId || '');

const getProjectSlug = (templateData) => {
  const pluginId = String(templateData.pluginId || templateData.name || 'service-orchestration');
  return pluginId
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'service-orchestration';
};

const getDefaultNamespace = (templateData) => {
  const applicationId = getApplicationId(templateData);
  const componentId = getComponentId(templateData);
  const namespaceSlug = withServiceSuffix(getProjectSlug(templateData));
  return `${applicationId}-${componentId}-${namespaceSlug}`;
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

const getNamespaceByStage = (applicationId, componentId, projectSlug, stage) => {
  const normalizedStage = normalizeStage(stage);
  const namespaceSlug = withServiceSuffix(projectSlug);
  if (normalizedStage === 'dev' || normalizedStage === 'sit' || normalizedStage === 'uat') {
    return `${normalizedStage}-${componentId}-${namespaceSlug}`;
  }
  return `${applicationId}-${componentId}-${namespaceSlug}`;
};

const resolveSelectedFamilies = (templateData) => {
  const selected = toArray(templateData.envs).map((item) => String(item).trim()).filter(Boolean);
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

const resolveDeploymentEnvs = (templateData) => {
  const { nonProdFamilies, prodFamilies } = resolveFamilyPlan(templateData);
  const names = [];

  nonProdFamilies.forEach((family) => {
    const hasDev = devEnvMap[family];
    toArray(hasDev).forEach((cfg) => names.push(cfg?.name));

    if (qaEnvMap[family]?.name) {
      names.push(qaEnvMap[family].name);
    } else if (family === 'ct1') {
      names.push('ct1_qa_hk');
    }

  });

  prodFamilies.forEach((family) => {
    toArray(prodEnvMap[family]).forEach((cfg) => names.push(cfg?.name));
  });

  return uniq(names);
};

const buildKubeconfigMap = () => {
  const map = {};

  Object.values(devEnvMap).forEach((items) => {
    toArray(items).forEach((cfg) => {
      if (cfg?.name && cfg?.secureFileName) {
        map[cfg.name] = cfg.secureFileName;
      }
    });
  });

  Object.values(qaEnvMap).forEach((cfg) => {
    if (cfg?.name && cfg?.secureFileName) {
      map[cfg.name] = cfg.secureFileName;
    }
  });

  Object.values(prodEnvMap).forEach((items) => {
    toArray(items).forEach((cfg) => {
      if (cfg?.name && cfg?.secureFileName) {
        map[cfg.name] = cfg.secureFileName;
      }
    });
  });

  // ct1 QA uses the same non-prod kubeconfig as ct1 sit/uat/dev.
  if (!map.ct1_qa_hk) {
    map.ct1_qa_hk = map.ct1_sit_hk || map.ct1_uat_hk || map.ct1_dev_hk || '';
  }

  return map;
};

const KUBECONFIG_BY_ENV = buildKubeconfigMap();

const getKubeconfig = (envName) => {
  const { family } = getEnvFamilyAndStage(envName);
  // DF environments currently should not set kubeconfig explicitly.
  if (family === 'df2') {
    return '';
  }
  return KUBECONFIG_BY_ENV[envName] || '';
};

const getDisplayName = (envName) => {
  const parts = String(envName).split('_');
  return parts.map((part) => part.toUpperCase()).join('-');
};

const getParameters = (templateData) => {
  return [
    {
      name: 'releaseId',
      type: 'string',
      displayName: 'Release WorkItem ID',
      default: 'NONE'
    },
    {
      name: 'componentName',
      type: 'string',
      displayName: 'Component Name',
      default: 'SB temporal Helm'
    },
    {
      name: 'rollbackBuildNumber',
      type: 'string',
      default: '0'
    },
    {
      name: 'rollbackQA',
      type: 'boolean',
      default: false
    },
    {
      name: 'namespace',
      type: 'string',
      default: getDefaultNamespace(templateData)
    }
  ];
};

const getResources = () => {
  return {
    repositories: [
      {
        repository: 'governed-templates',
        name: 'dj-core/governed-templates',
        ref: 'main',
        type: 'git'
      }
    ]
  };
};

const getVariables = (templateData) => {
  return [
    {
      name: 'helmChartPath',
      value: 'helm'
    },
    {
      name: 'appServiceName',
      value: 'temporal'
    },
    {
      group: 'ServicePrincipleAKS'
    },
    {
      name: 'notifyUsers',
      value: templateData.teamEmail || 'API_Management@exchange.standardchartered.com'
    }
  ];
};

const createDeployment = ({
  name,
  environment,
  displayName,
  dependsOn,
  kubeconfig,
  namespace,
  envValuesPath,
  enableManualPIT = false,
  rollback = false
}) => {
  const deployment = {
    name,
    environment,
    displayName,
    dependsOn,
    notifyUsers: '$(notifyUsers)',
    pool: 'sc-linux',
    run_mode: 'helm',
    secretsFileSelector: `$(Build.ArtifactStagingDirectory)/$(helmChartPath)/${envValuesPath}`,
    helm_params: {
      namespace,
      release: '$(appServiceName)',
      chart: '$(helmChartPath)',
      values_file: '$(helmChartPath)/values.yaml',
      extra_args: [
        '--wait',
        '--timeout 10m',
        '--atomic',
        '--cleanup-on-fail',
        `--namespace=${namespace}`,
        '--create-namespace',
        `--set k8sNamespace=${namespace}`,
        `-f $(Build.ArtifactStagingDirectory)/$(helmChartPath)/${envValuesPath}`
      ].join(' ')
    }
  };

  if (kubeconfig && String(kubeconfig).trim()) {
    deployment.k8s_params = {
      kubeconfig
    };
  }

  if (enableManualPIT) {
    deployment.enableManualPIT = true;
  }

  if (rollback) {
    deployment.rollbackBuildNumber = '${{parameters.rollbackBuildNumber}}';
  }

  return deployment;
};

const getDeployEnvironments = (templateData) => {
  const applicationId = getApplicationId(templateData);
  const componentId = getComponentId(templateData);
  const projectSlug = getProjectSlug(templateData);

  const releaseDependsOn = [];
  const nonProdDeployments = [];
  const prodDeployments = [];
  const envNames = resolveDeploymentEnvs(templateData);

  envNames.forEach((envName) => {
    const { stage } = getEnvFamilyAndStage(envName);
    const normalizedStage = normalizeStage(stage);
    const outputName = getFileNameFromEnv(envName);
    if (!outputName) {
      return;
    }

    const namespace = normalizedStage === 'qa' || normalizedStage === 'prod'
      ? '${{parameters.namespace}}'
      : getNamespaceByStage(applicationId, componentId, projectSlug, normalizedStage);

    const environment = normalizedStage === 'prod'
      ? 'production'
      : normalizedStage === 'qa'
        ? 'qa'
        : 'dev';

    const dependsOn = [];
    if (normalizedStage === 'dev' || normalizedStage === 'sit') {
      dependsOn.push('CI');
    } else if (normalizedStage === 'uat') {
      const hasSit = envNames.some((n) => normalizeStage(getEnvFamilyAndStage(n).stage) === 'sit');
      dependsOn.push(hasSit ? outputName.replace('_uat', '_sit') : 'CI');
    } else if (normalizedStage === 'qa') {
      const hasUat = envNames.some((n) => normalizeStage(getEnvFamilyAndStage(n).stage) === 'uat');
      dependsOn.push(hasUat ? outputName.replace('_qa', '_uat') : 'CI');
      releaseDependsOn.push(outputName);
    } else if (normalizedStage === 'prod') {
      dependsOn.push('release');
    }

    const deployment = createDeployment({
      name: outputName,
      environment,
      displayName: getDisplayName(outputName),
      dependsOn,
      kubeconfig: getKubeconfig(envName),
      namespace,
      envValuesPath: `env/${outputName}/values.yaml`,
      enableManualPIT: normalizedStage === 'prod'
    });

    if (normalizedStage === 'prod') {
      prodDeployments.push(deployment);
      prodDeployments.push(
        createDeployment({
          name: `rb_${outputName}`,
          environment,
          displayName: `Rollback ${getDisplayName(outputName)}`,
          dependsOn: [outputName],
          kubeconfig: getKubeconfig(envName),
          namespace,
          envValuesPath: `env/${outputName}/values.yaml`,
          enableManualPIT: true,
          rollback: true
        })
      );
      return;
    }

    nonProdDeployments.push(deployment);
  });

  const qaStageName = releaseDependsOn[0] || nonProdDeployments.find((item) => item.environment === 'qa')?.name || 'qa';

  const deployments = [...nonProdDeployments];

  deployments.push({
    name: 'release_checks',
    environment: 'pre-release',
    displayName: 'Release Checks',
    dependsOn: releaseDependsOn.length ? releaseDependsOn : ['CI'],
    notifyUsers: '$(notifyUsers)',
    pool: 'sc-linux',
    qaStageName
  });

  deployments.push({
    name: 'release',
    environment: 'release',
    displayName: 'RELEASE',
    dependsOn: ['release_checks'],
    notifyUsers: '$(notifyUsers)',
    pool: 'sc-linux'
  });

  return deployments.concat(prodDeployments);
};

const getTemplateParameters = (templateData) => {
  const applicationId = getApplicationId(templateData);
  const componentId = getComponentId(templateData);
  return {
    featureRelease: true,
    ITAM: applicationId,
    subITAM: componentId,
    releaseId: '${{ parameters.releaseId }}',
    buildStackName: 'generic',
    devFactory: true,
    buildStackParams: {
      pool: 'sc-linux',
      archiveType: 'zip',
      folderPathArchive: '$(helmChartPath)',
      TargetPathArtifactory: `generic-release/${applicationId}-serviceBench`,
      postinputFileList: ['helm/values.yaml'],
      featureBranchScan: true,
      featureRelease: true,
      skipEarlyFeedback: true
    },
    deployStackName: 'skecaasapp',
    secondaryDeployStackName: 'aks',
    deployStackParams: {
      runQaRollback: '${{parameters.rollbackQA}}'
    },
    deployEnvironments: getDeployEnvironments(templateData)
  };
};

export const generator = (templateData = {}) => {
  const pipelineYml = {
    trigger: getTriggers(),
    parameters: getParameters(templateData),
    resources: getResources(),
    variables: getVariables(templateData),
    extends: {
      template: 'governed-template/build-and-deploy.yml@governed-templates',
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
