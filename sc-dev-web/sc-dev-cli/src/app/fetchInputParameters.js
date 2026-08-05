import path from "path";
import fs from "fs";
import yaml from "js-yaml";
import xml2js from 'xml2js';

export function fetchParameters(folder = process.cwd()) {
  let config = {};

  const configXml = path.join(folder, '/.scdevcli/answers.xml');
  if (fs.existsSync(configXml)) {
    const configContent = fs.readFileSync(configXml, 'utf-8');
    xml2js.parseString(configContent, { async: false, trim: true }, function (err, result) {
      if (!err) {
        Object.keys(result?.template ?? []).forEach(key => {
          config = {
            ...config,
            [key]: result.template[key]?.length ? result.template[key][0] : ''
          }
        });
        config = { ...config, existingProject: true };
      }
    });
  }
  const npmAzurePath = path.join(folder, 'azure-pipelines-npm.yml');
  const mavenAzurePath = path.join(folder, 'azure-pipelines-maven.yml');
  const serverEntryPath = path.join(folder, 'server.mjs');
  const proType = fs.existsSync(mavenAzurePath) || fs.existsSync(serverEntryPath) ? 'back' : fs.existsSync(npmAzurePath) ? 'front' : '';
  config = { ...config, existingProject: config.existingProject || !!proType };
  if (proType === 'front' || proType === 'back') {
    let azurePath = mavenAzurePath;
    if (fs.existsSync(npmAzurePath)) {
      azurePath = npmAzurePath;
    }
    const yamlContent = fs.readFileSync(azurePath, 'utf-8');
    const yamlConfig = yaml.load(yamlContent);
    const applicationId = yamlConfig?.variables?.find(item => item.name === 'ITAM')?.value;
    const componentId = yamlConfig?.variables?.find(item => item.name === 'subITAM')?.value;
    const name = yamlConfig?.variables?.find(item => item.name === 'imageName')?.value;
    const functionName = yamlConfig?.variables?.find(item => item.name === 'functionName')?.value;
    const teamEmail = yamlConfig?.variables?.find(item => item.name === 'notifyEmail')?.value;
    config = {
      ...config,
      applicationId: applicationId || config.applicationId || '55313',
      componentId: componentId || config.componentId || '00',
      teamEmail: teamEmail || config.teamEmail || '<my-team-email>@sc.com',
      name: name || config.name || 'my-project',
      functionName,
    };

    if (proType === 'front') {
      const tsConfigExist = fs.existsSync(path.join(folder, 'tsconfig.json'));
      const sbPluginExist = fs.existsSync(path.join(folder, 'service-bench.html'));
      const sbWidgetExist = fs.existsSync(path.join(folder, 'service-bench-widgets.html'));
      if (tsConfigExist && sbWidgetExist) config = { ...config, category: 'sb', type: 'service-bench-widget-lit-ts' };
      else if (tsConfigExist && sbPluginExist) config = { ...config, category: 'sb', type: 'service-bench-plugin-lit-ts' };
      else if (sbPluginExist) config = { ...config, category: 'sb', type: 'service-bench-plugin-lit' };
    } else if (fs.existsSync(path.join(folder, 'pom.xml'))) {
      const pomContent = fs.readFileSync(path.join(folder, 'pom.xml'), 'utf-8');
      xml2js.parseString(pomContent, { async: false, trim: true }, function (err, result) {
        if (!err) {
          const processParentJava = result.project?.parent?.find(item => item.artifactId?.includes('process-parent-java'));
          const graphqlParentJava = result.project?.parent?.find(item => item.artifactId?.includes('graphql-parent-java'));
          const graphqlParent = result.project?.parent?.find(item => item.artifactId?.includes('graphql-parent'));
          const funqyDependency = result.project?.dependencies?.find(dependency => dependency?.dependency?.find(item => item.artifactId?.includes('quarkus-funqy-knative-events')));
          // TODO: map available generic process api "type" tech stacks into array, and check condition from there.
          const genericOpenApiProject = config.category === "generic" && config.type === "generic-process-api-java-quarkus"
          if (processParentJava && funqyDependency) config = { ...config, category: 'sb', type: 'service-bench-batch-job-java' };
          else if (processParentJava && genericOpenApiProject) config = { ...config } // Use the base config, no changes needed.
          else if (processParentJava) config = { ...config, category: 'sb', type: 'service-bench-process-api-java' };
          else if (graphqlParentJava) config = { ...config, category: 'sb', type: 'service-bench-experience-api-java' };
          else if (graphqlParent) config = { ...config, category: 'sb', type: 'service-bench-experience-api-kotlin' };
        }
      });
    } else if (fs.existsSync(path.join(folder, 'server.mjs'))) {
      if (fs.existsSync(path.join(folder, 'src', 'schema.mjs'))) {
        config = { ...config, category: 'sb', type: 'service-bench-experience-api-nodejs' };
      } else {
        config = { ...config, category: 'sb', type: 'service-bench-process-api-nodejs' };
      }
    } else if (fs.existsSync(path.join(folder, 'notification.img'))) {
      config = { ...config, category: 'sb', type: 'service-bench-notification' };
    } else if (fs.existsSync(path.join(folder, 'requirements.txt'))) {
      const requirementsPath = path.join(folder, 'requirements.txt');
      const requirementsContent = fs.readFileSync(requirementsPath, 'utf-8');
      if (requirementsContent.includes("strawberry-graphql")) {
        config = { ...config, category: 'sb', type: 'service-bench-experience-api-python' };
      } else if( requirementsContent.includes("cloudevents")) {
        config = { ...config, category: 'sb', type: 'service-bench-batch-job-python' };
      } else {
        config = { ...config, category: 'sb', type: 'service-bench-process-api-python' };
      }
    } else if (fs.existsSync(path.join(folder, 'go.mod'))) {
      if (fs.existsSync(path.join(folder, 'gqlgen.yml'))) {
        config = { ...config, category: 'sb', type: 'service-bench-experience-api-golang' };
      } else {
        config = { ...config, category: 'sb', type: 'service-bench-process-api-golang' };
      }
    }
  }

  return config;
}