import yaml from 'js-yaml';

import {
  latestHelmChart,
  latestBuildPacks,
  latestNodeVersion
} from './build-config.js';

import {
  devEnvMap,
  rbQaEnvMap,
  preQaEnvMap,
  qaEnvMap,
  prodEnvMap
} from './env-config.js';

const getTriggers = () => {
  return [
    'develop',
    'feature/*',
    'release/*',
    'catalyst/*'
  ]
}

const getParameters = (buildTemplate) => {
  const parameters = [
    {
      name: 'releaseId',
      type: 'string',
      displayName: 'Release WorkItem ID',
      default: '0',
    }, {
      name: 'packageVersion',
      type: 'string',
      displayName: 'Package Version',
      default: '1.0.0-$(Build.BuildId)',
    }, {
      name: 'devkitHelmVersion',
      type: 'string',
      displayName: 'DevKit Helm Version',
      default: latestHelmChart,
    }, {
      name: 'rollbackBuildNumber',
      type: 'string',
      displayName: 'Last successful Release Build Number to rollback',
      default: '0',
    }
  ]
  if (latestBuildPacks[buildTemplate]) {
    parameters.push({
      name: 'buildpackVersion',
      type: 'string',
      displayName: 'Buildpack Version',
      default: latestBuildPacks[buildTemplate]
    })
  }
  return parameters;
}

const getVariables = (templateData) => {
  let imagePrefix = 'sc-devkit';
  let functionName = templateData.name;
  if (templateData.cliType.includes('plugin')) {
    imagePrefix = 'sb-plugin';
    functionName = 'ui';
  } else if (templateData.cliType.includes('widget')) {
    imagePrefix = 'sb-widget';
    functionName = `sb-widget-${templateData.name}`;
  } else if (templateData.cliType.includes('experience-api')) {
    functionName = 'exp-api';
  } else if (templateData.cliType.includes('process-api')) {
    functionName = 'proc-api';
  }
  // Use existing functionName if exist
  if (templateData.cliAction === 'update' && templateData.functionName) {
    functionName = templateData.functionName;
  }


  return [
    {
      group: 'ServicePrincipleAKS'
    }, {
      name: 'ITAM',
      value: templateData.applicationId
    }, {
      name: 'subITAM',
      value: templateData.componentId
    }, {
      name: 'imageName',
      value: templateData.name
    }, {
      name: 'imageTag',
      value: '$(Build.SourceBranchName)_$(Build.BuildNumber)'
    }, {
      name: 'imageRepo',
      value: 'ado'
    }, {
      name: 'imagePrefix',
      value: imagePrefix
    }, {
      name: 'functionName',
      value: functionName
    }, {
      name: 'notifyEmail',
      value: templateData.teamEmail
    }
  ]
}

const getCommonParameters = () => {
  return {
    ITAM: '${{variables.ITAM}}',
    subITAM: '${{variables.subITAM}}',
    devFactory: true,
    featureRelease: true,
    releaseId: '${{ parameters.releaseId }}'
  }
}

const getCIParameters = (buildTemplate) => {
  let buildStackName = '';
  let buildStackParams = {
    pool: 'sc-linux',
    featureBranchScan: true,
    featureRelease: true,
    dockerBuild: true,
    imageTag: '${{variables.imageTag}}',
    imageRepo: '${{variables.imageRepo}}',
    imagePrefix: '${{variables.imagePrefix}}',
    imageName: '${{variables.imageName}}',
    imageListFilePath: 'image.yml',
    calculateImageDigest: true,
    postInputFileList: ['image.yml'],
    postVariableList: [
      {
        name: 'mainContainerImageName',
        value: 'ado\\/$(Build.Repository.Name)\\/${{variables.imageRepo}}\\/${{variables.imagePrefix}}-${{variables.imageName}}'
      }
    ],
    extraPackArgs: '--env "BUILD_BUILDID" --env "BUILD_BUILDNUMBER"'
  }

  if (buildTemplate === 'quarkus-native') {
    buildStackParams.pool = "sc-rhel8ec2-large"
  }

  if (latestBuildPacks[buildTemplate]) {
    buildStackParams.buildpackImageName = 'buildpack-' + buildTemplate + ':${{parameters.buildpackVersion}}';
    buildStackParams.builderImageName = 'builder-' + buildTemplate + ':${{parameters.buildpackVersion}}'
  }

  if (buildTemplate === 'node' || buildTemplate === 'nodeapi') {
    buildStackName = 'sc-devkit-node';
    buildStackParams.nodeVersion = latestNodeVersion;
    buildStackParams = {
      ...buildStackParams,
      npmTaskList: [
        {
          name: 'Set version',
          task: 'version ${{ parameters.packageVersion }} --no-git-tag-version'
        }, {
          name: 'Run Build',
          task: 'run build'
        }, {
          name: 'Run Test',
          task: 'run test'
        }
      ],
      generateUnitTestReport: true,
      generateCodeCoverage: true,
      testResultsFiles: '$(Build.SourcesDirectory)/$(Build.Repository.Name)/report/junit-report.xml',
      sonarSources: './src'
    }
  }

  if (buildTemplate === 'quarkus' || buildTemplate === 'java' || buildTemplate === 'quarkus-native') {
    buildStackName = 'sc-devkit-maven';
    buildStackParams = {
      ...buildStackParams,
      goals: 'clean package -Dquarkus.package.type=uber-jar',
      packageVersion: '${{parameters.packageVersion}}',
      testResultsFiles: '**/surefire-reports/TEST-*.xml',
      sonarCoverageJacocoXmlReportPaths: '**/jacoco-report/jacoco.xml',
      sonarSources: 'src/main',
      jdkVersion: '21',
      mavenVersion: '3.9.9',
      sonarExclusions: '**/test/**,**/*.yml,**/*.yaml,**/*.xml'
    }
  }

  // Add env folder for Node API
  if (buildTemplate === 'nodeapi') {
    buildStackParams = {
      ...buildStackParams,
      archiveType: 'zip',
      deploymentFolderName: 'env',
      archiveIncludeRootFolder: true
    }
  }

  if (buildTemplate === 'python') {
    buildStackName = 'sc-devkit-python';
    buildStackParams = {
      ...buildStackParams,
      archiveType: 'zip',
      deploymentFolderName: 'env',
      deployStackName: 'helm',
      // ensure the Dockerfile path is set for python builds till ADO govenrned template updated
      dockerFilePaths: [
        { imageTag: '${{variables.imageTag}}' }
      ],
      pythonVersion: '3.12.7',
      testRequirementsFilePath: 'requirements.txt',
      unitTestArgs: '-sv --tb=no test/',
      usePyprojectToml: false
    }
  }

  if (buildTemplate === 'go') {
    buildStackName = 'sc-devkit-go';
    buildStackParams = {
      ...buildStackParams,
      goVersion: '1.23.0',
      goBuildTargets: {
        goEnvironmentVariables: {
          GOBIN: '$(Build.ArtifactStagingDirectory)'
        },
        goOs: 'linux',
        goArch: 'amd64'
      },
      goTestArgs: '-v -coverpkg=./...',
      sonarExclusions: '**/*_test.go,**/generated.go',
      srcDir: './',
      targetPathArtifactory: 'generic-release/ado',
      skipEarlyFeedback: true,
      extraFoldersToPackage: ["env"]
    }
  }

  return {
    buildStackName,
    buildStackParams
  }
}

const getDevDeployments = (devEnvs, configResolver = (config) => config) => {
  const deployments = [];
  devEnvs.forEach((env) => {
    const deploymentConfigs = devEnvMap[env];
    deploymentConfigs.forEach((config, i) => {
      const devConfig = { ...config };
      if (i === 0) {
        // This is not supported by knativeaks with subITAM (which assumes -dev in 2nd position only)
        // devConfig.devApproval = false;
      }
      deployments.push(
        configResolver({
          ...devConfig,
          notifyUsers: '${{variables.notifyEmail}}',
          pool: config.pool || 'sc-linux',
          environment: 'dev',
          dependsOn: config.dependsOn || ['CI']
        }, config)
      );
    })
  })
  return deployments;
}

const getRbQaDeployments = (qaEnv, configResolver = (config) => config) => {
  const deploymentConfig = rbQaEnvMap[qaEnv];
  return [
    configResolver({
      ...deploymentConfig,
      notifyUsers: '${{variables.notifyEmail}}',
      pool: deploymentConfig.pool || 'sc-linux',
      rollbackBuildNumber: '${{parameters.rollbackBuildNumber}}',
      functionName: '${{variables.functionName}}',
      environment: 'qa',
      name: 'rollback_qa',
      dependsOn: ['df2_qa_sg'],
    }, deploymentConfig)
  ]
}

const getQaDeployments = (qaEnv, devEnvs, configResolver = (config) => config) => {
  const deploymentConfig = qaEnvMap[qaEnv];
  const preQaEnv = devEnvs.map((env) => preQaEnvMap[env]).filter((env) => env);
  return [
    configResolver({
      ...deploymentConfig,
      enableManualPIT: true,
      notifyUsers: '${{variables.notifyEmail}}',
      pool: deploymentConfig.pool || 'sc-linux',
      environment: 'qa',
      name: 'df2_qa_sg',
      dependsOn: preQaEnv
    }, deploymentConfig)
  ]
}

const getReleaseDeployments = () => {
  return [
    {
      name: 'release_checks',
      environment: 'pre-release',
      displayName: 'Release Checks',
      notifyUsers: '${{variables.notifyEmail}}',
      pool: 'sc-linux',
      hasGenie: false,
      qaStageName: 'qa',
      dependsOn: ['df2_qa_sg'],
    }, {
      name: 'release',
      environment: 'release',
      displayName: 'Release',
      notifyUsers: '${{variables.notifyEmail}}',
      pool: 'sc-linux',
      hasGenie: false,
      dependsOn: ['release_checks']
    }
  ]
}

const getProdDeployments = (prodEnvs, configResolver = (config) => config) => {
  const deployments = [];
  prodEnvs.forEach((env) => {
    const deploymentConfigs = prodEnvMap[env];
    deploymentConfigs.forEach((config) => {
      deployments.push(
        configResolver({
          name: config.name,
          environment: 'production',
          displayName: config.displayName,
          enableManualPIT: true,
          notifyUsers: '${{variables.notifyEmail}}',
          pool: 'sc-linux',
          secureFileName: config.secureFileName,
          dependsOn: config.dependsOn || ['release']
        }, config)
      );
      deployments.push(
        configResolver({
          name: `rollback_${config.name}`,
          environment: 'production',
          displayName: `Rollback ${config.displayName}`,
          notifyUsers: '${{variables.notifyEmail}}',
          pool: 'sc-linux',
          rollbackBuildNumber: '${{parameters.rollbackBuildNumber}}',
          functionName: '${{variables.functionName}}',
          secureFileName: config.secureFileName,
          dependsOn: [config.name]
        }, config)
      );
    })
  })
  return deployments;
}

const getCDParameters = (devEnvs, rbQaEnv, qaEnv, prodEnvs, configResolver) => {
  const deployStackName = 'knative';
  const secondaryDeployStackName = 'knativeaks';
  const deployStackParams = {
    functionName: '${{variables.functionName}}',
    imageTag: '${{variables.imageTag}}',
    imageRepo: 'ado/$(Build.Repository.Name)/${{variables.imageRepo}}',
    imagePrefix: '${{variables.imagePrefix}}',
    imageName: '${{variables.imageName}}',
    devkitHelmVersion: '${{parameters.devkitHelmVersion}}',
    runQaRollback: false
  }
  const deployEnvironments = [
    ...getDevDeployments(devEnvs, configResolver),
    ...getRbQaDeployments(rbQaEnv, configResolver),
    ...getQaDeployments(qaEnv, devEnvs, configResolver),
    ...getReleaseDeployments(),
    ...getProdDeployments(prodEnvs, configResolver)
  ]

  return {
    deployStackName,
    secondaryDeployStackName,
    deployStackParams,
    deployEnvironments
  }

}


const getTemplateParameters = (buildTemplate, devEnvs, rbQaEnv, qaEnv, prodEnvs) => {
  const configResolver = (config, params) => {
    let additionalHelmArgs = '';
    if (buildTemplate === 'node') {
      additionalHelmArgs = '--set functionType=ui';
    } else if (buildTemplate === 'nodeapi' || buildTemplate === 'quarkus' || buildTemplate === 'java' || buildTemplate === 'python' || buildTemplate === 'go' || buildTemplate === 'quarkus-native') {
      additionalHelmArgs = '-f $(Build.ArtifactStagingDirectory)/env/' + params.name + '/properties.yml';
    }

    let extraHelmArgs = config.extraHelmArgs || '';
    if (additionalHelmArgs) {
      extraHelmArgs = (extraHelmArgs) ? `${extraHelmArgs} ${additionalHelmArgs}` : additionalHelmArgs;
    }
    return {
      ...config,
      extraHelmArgs
    }
  }
  const templateParameters = {
    ...getCommonParameters(),
    ...getCIParameters(buildTemplate),
    ...getCDParameters(devEnvs, rbQaEnv, qaEnv, prodEnvs, configResolver)
  };

  return templateParameters;
}

const getResources = () => {
  return {
    repositories: [
      {
        repository: 'modular-templates',
        name: 'dj-core/governed-templates',
        ref: 'main',
        type: 'git'
      }
    ]
  }
}

export const generator = (templateData, devEnvs, rbQaEnv, qaEnv, prodEnvs) => {

  let buildTemplate = 'quarkus';
  let pipelineYmlFile = 'azure-pipelines-maven.yml';
  if (templateData.cliType.includes('plugin') || templateData.cliType.includes('widget')) {
    buildTemplate = 'node';
    pipelineYmlFile = 'azure-pipelines-npm.yml';
  } else if (templateData.cliType.includes('node')) {
    buildTemplate = 'nodeapi';
    pipelineYmlFile = 'azure-pipelines-npm.yml';
  } else if (templateData.cliType.includes('python')) {
    buildTemplate = 'python';
    pipelineYmlFile = 'azure-pipelines-python.yml';
  } else if (templateData.cliType.includes('golang')) {
      buildTemplate = 'go';
      pipelineYmlFile = 'azure-pipelines-go.yml';
  } else if (buildTemplate === 'quarkus' && templateData.cliType.includes('native')) {
    buildTemplate = 'quarkus-native';
  }

  const pipelineYml = {};
  pipelineYml.trigger = getTriggers();
  pipelineYml.parameters = getParameters(buildTemplate);
  pipelineYml.variables = getVariables(templateData);
  pipelineYml.resources = getResources();
  pipelineYml.extends = {
    template: 'governed-template/build-and-deploy.yml@modular-templates',
    parameters: getTemplateParameters(buildTemplate, devEnvs, rbQaEnv, qaEnv, prodEnvs)
  }


  return {
    file: pipelineYmlFile,
    content: yaml.dump(pipelineYml, {
      lineWidth: -1
    })
  }

}