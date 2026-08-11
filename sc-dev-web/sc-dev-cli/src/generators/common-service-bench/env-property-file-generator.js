import yaml from 'js-yaml';
import fs from "fs";
import {
  devEnvMap,
  rbQaEnvMap,
  qaEnvMap,
  prodEnvMap,
  varEnvMap,
  idpEnvMap,
  dbEnvMap
} from './env-config.js';

const getHcvParameters = (templateData, envName) => {
  
  let includeTrustStore = false, includeKeyStore = false;
  let name = '<%= name %>'
  const isDf2UatUk = envName === 'df2_uat_uk';
  if (templateData.cliType.includes('experience')) {
    includeTrustStore = true;
    includeKeyStore = true;
    name = "<%= name.replace(/-exp-api$/, \"\") %>";
  } else if (templateData.cliType.includes('process') || templateData.cliType.includes('mcp-api-nodejs') || templateData.cliType.includes('mcp-api-python')) {
    includeTrustStore = true;
    includeKeyStore = true;
    name = "<%= name.replace(/-process-api$/, \"\") %>";
  }

  let prefix = 'scb';
  if (envName.includes('gdce') || envName.includes('gdcw') || isDf2UatUk) {
    prefix = 'tsa';
  }

  let suffix = '_prod';
  let tsPrefix = 'trust_store';
  let ksPrefix = 'key_store';
  let isCatalyst = envName.includes('ct1_') || (envName.startsWith('df2_') && !isDf2UatUk);
  let isCatalystNonProd = false;
  if (envName.includes('dev') || envName.includes('sit') || envName.includes('uat') || envName.includes('qa')) {
    tsPrefix = '';
    ksPrefix = '';
    isCatalystNonProd = isCatalyst;
    if (isCatalyst) {
      tsPrefix = 'trust_store_ts_cert'
      ksPrefix = 'key_store_ks_cert';
      suffix = '';
    } else if (isDf2UatUk) {
      suffix = 'onprem_non_prod';
    } else if (envName.includes('df')) {
      suffix = 'df_non_prod';
    } else {
      suffix = 'onprem_non_prod';
    }
  }

  const sbITAM = '55313';
  let role = `${sbITAM}_<%= componentId %>_app_k8s_${sbITAM}-<%= componentId %>-${name}_role`;
  if (envName == 'ct1_dev_hk' || envName == 'ct1_sit_hk' || envName == 'ct1_uat_hk' || envName == 'df2_sit_sg' || envName == 'df2_uat_sg') {
    const nonProdEnvCode = envName.substr(4).substr(0, 3);
    role = `${sbITAM}_<%= componentId %>_app_k8s_${nonProdEnvCode}-<%= componentId %>-${name}_role`;
  }
  let data = [];
  if (includeTrustStore) {
    data.push({
      path: `${prefix}/${sbITAM}/<%= componentId %>/app/kv/data/${tsPrefix}${suffix}`,
      sourceName: isCatalyst ? 'trust_store_ts_cert' : 'truststore_cert',
      targetName: 'truststore.jks',
      type: 'file'
    });
    data.push({
      path: `${prefix}/${sbITAM}/<%= componentId %>/app/kv/data/${tsPrefix}${suffix}` + (isCatalystNonProd ? "_key" : ""),
      sourceName: isCatalyst ? 'trust_store_ts_cert_key' : 'truststore_cert_key',
      targetName: 'TRUSTSTORE_PASSWORD',
      type: 'static'
    });
  }
  if (includeKeyStore) {
    data.push({
      path: `${prefix}/${sbITAM}/<%= componentId %>/app/kv/data/${ksPrefix}${suffix}`,
      sourceName: isCatalyst ? 'key_store_ks_cert' : 'keystore_cert',
      targetName: 'keystore.jks',
      type: 'file'
    });
    data.push({
      path: `${prefix}/${sbITAM}/<%= componentId %>/app/kv/data/${ksPrefix}${suffix}` + (isCatalystNonProd ? "_key" : ""),
      sourceName: isCatalyst ? 'key_store_ks_cert_key' : 'keystore_cert_key',
      targetName: 'KEYSTORE_PASSWORD',
      type: 'static'
    });
  }

  return {
    role,
    data
  };

}

const getSIPParameters = (templateData, envName) => {

  const idpEnv = idpEnvMap[envName];
  const { authnEndpoint, apiEndpoint } = idpEnv;
  const isCNEnv = /^cn\d*_/.test(envName);
  const idpClientId = isCNEnv ? templateData.idpClientId?.replace(/-[^-]+-sys$/, '-cn-sys') : templateData.idpClientId;
  const idpServiceUrn = isCNEnv ? templateData.idpServiceUrn?.replace(/-[^-]+$/, '-cn') : templateData.idpServiceUrn;

  const sipConfig = {
    common: {
      authentication: {
        token_url: `${authnEndpoint}/realms/internal-system/protocol/openid-connect/token`,
        client_id: idpClientId ?? '<your_client_id>',
        key_alias: templateData.idpKeyAlias ?? '<keystore_entry_alias>'
      }
    },
    rules: [
      {
        match: {
          url: '/q/health/.*',
          method: ['GET']
        },
        handlers: []
      }
    ]
  };

  let authProtectionRealm = '';
  let authProtectionMatch = null;
  if (templateData.cliType.includes('experience')) {
    authProtectionRealm = 'staff';
    authProtectionMatch = {
      method: ['POST'],
      body: '[\\s\\S]*?((post|get|put|delete|patch)_\\w*)[\\s\\S]*'
    }
    // Bypass GraphQL introspection query
    sipConfig.rules.push({
      match: {
        method: ['POST'],
        body: '\\{(\\s*\"operationName\"\\s*:\\s*\"IntrospectionQuery\"\\s*,)?\\s*\"query\"\\s*:\\s*\"query\\s+IntrospectionQuery\\s+\\{\\s+__schema\\s+\\{\\s+queryType\\s+\\{\\s+name\\s+}\\s+mutationType\\s+\\{\\s+name\\s+}\\s+subscriptionType\\s+\\{\\s+name\\s+}\\s+types\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__Type\\{\\s+kind\\s+name\\s+description\\s+fields\\(includeDeprecated:\\s+true\\)\\s+\\{\\s+name\\s+description\\s+args\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__InputValue\\{\\s+name\\s+description\\s+type\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__Type\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+defaultValue\\s+}\\s+}\\s+type\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__Type\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+isDeprecated\\s+deprecationReason\\s+}\\s+inputFields\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__InputValue\\{\\s+name\\s+description\\s+type\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__Type\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+defaultValue\\s+}\\s+}\\s+interfaces\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__Type\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+enumValues\\(includeDeprecated:\\s+true\\)\\s+\\{\\s+name\\s+description\\s+isDeprecated\\s+deprecationReason\\s+}\\s+possibleTypes\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__Type\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+directives\\s+\\{\\s+name\\s+description\\s+locations\\s+args\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__InputValue\\{\\s+name\\s+description\\s+type\\s+\\{\\s+\\.\\.\\.\\s+on\\s+__Type\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+ofType\\s+\\{\\s+kind\\s+name\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+}\\s+defaultValue\\s+}\\s+}\\s+}\\s+}\\s+}\\s*\"\\s*}'
      },
      handlers: []
    });
  } else if (templateData.cliType.includes('process') || templateData.cliType.includes('mcp-api-nodejs') || templateData.cliType.includes('mcp-api-python')) {
    authProtectionRealm = 'internal-system';
    authProtectionMatch = {
      url: '[\\S\\s]*',
      method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  }

  if (authProtectionRealm && authProtectionMatch) {
    const protectionHandlers = [
      {
        id: 'authenticator',
        config: {
          jwks_uri: `${authnEndpoint}/realms/${authProtectionRealm}/protocol/openid-connect/certs`,
          required_audience: [idpServiceUrn ?? '<your_service_urn>']
        }
      }
    ];
    if (!envName.includes('dev')) {
      protectionHandlers.push({
        id: 'authorizer',
        config: {
          url: `${apiEndpoint}/api/v1/services/${idpServiceUrn ?? '<your-service-urn>'}/stores/${templateData.idpStoreName ?? '<your-store-name>'}/tuples:check`,
          config: {
            relation: 'can_call',
            object: 'endpoint:{{Request.method}}_{{Matcher.group1}}',
            user: 'user:{{Token.sub}}'
          }
        }
      })
    }
    sipConfig.rules.push({
      match: authProtectionMatch,
      handlers: protectionHandlers
    });
  }

  return {
    filename: 'config.json',
    base64enc: true,
    data: JSON.stringify(sipConfig, null, 2)
  }

}

const getSEPParameters = (templateData, envName) => {

  const idpEnv = idpEnvMap[envName];
  const { authnEndpoint } = idpEnv;
  const isCNEnv = /^cn\d*_/.test(envName);
  const idpClientId = isCNEnv ? templateData.idpClientId?.replace(/-[^-]+-sys$/, '-cn-sys') : templateData.idpClientId;

  const sepConfig = {
    common: {
      authentication: {
        token_url: `${authnEndpoint}/realms/internal-system/protocol/openid-connect/token`,
        client_id: idpClientId ?? '<your_client_id>',
        key_alias: templateData.idpKeyAlias ?? '<keystore_entry_alias>'
      }
    },
    rules: []
  };

  if (templateData.cliType.includes('experience')) {
    sepConfig.rules.push({
      match: {
        url: '[\\S\\s]*',
        method: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
      },
      handlers: [
        {
          id: 'tokenGenerator'
        }
      ]
    });
  }

  return {
    filename: 'config-egress.json',
    base64enc: true,
    data: JSON.stringify(sepConfig, null, 2)
  }

}

const getDbParameters = (envName, templateData) => {
  const sbITAM = '55313';
  const { dbHost, dbPort, dbHcvPath } = dbEnvMap[envName];
  const envStage = envName.split('_')[1]; // e.g. 'dev', 'sit', 'uat'
  const dbBaseName = templateData.name.replace(/-service(?!.*-service).*-process-api$/, '').replace(/-/g, '_');
  return {
    hcvData: {
      targetName: 'PLATFORM_DB_PWD',
      sourceName: 'password',
      path: dbHcvPath,
      type: 'db'
    },
    envData: [
      { name: 'PLATFORM_DB_NODE', value: `${dbHost}:${dbPort}` },
      { name: 'PLATFORM_DB_NAME', value: `pg_sb_${dbBaseName}_${envStage}_01` },
      { name: 'PLATFORM_DB_USER', value: `sb-${sbITAM}-${templateData.componentId}-app` }
    ]
  };
};

const isDbEnabled = (templateData) =>
  (templateData.db === true || templateData.db === 'true');


const updateEnvConfig = (templateData, envObj) => {
  const { name } = envObj;
  const componentId = `<%= componentId %>`;
  let envConfig = undefined;
  let propertyFilePath = "./env/" + name + "/properties.yml";
  let ctNonProdEndpointEnvData = [];
  let appPropConfig;
  let needUpdateAppProps = false;


  if (fs.existsSync(propertyFilePath)) {
    const yamlContent = fs.readFileSync(propertyFilePath, 'utf-8');
    envConfig = yaml.load(yamlContent);
  }

  if (!envConfig && (name == 'ct1_dev_hk' || name == 'ct1_sit_hk' || name == 'ct1_uat_hk' || name == 'ct1_qa_hk')) {

    propertyFilePath = "./env/gdce1_sit_jumbo/properties.yml";
    if (name == 'ct1_uat_hk' || name == 'ct1_qa_hk') {
      propertyFilePath = "./env/gdce1_uat_jumbo/properties.yml";
    }

    if (fs.existsSync(propertyFilePath)) {
      const yamlContent = fs.readFileSync(propertyFilePath, 'utf-8');
      envConfig = yaml.load(yamlContent);

      let ctNonProdEnvCode = name.substr(4).substr(0, 3);
      if (ctNonProdEnvCode.startsWith("qa")) {
        ctNonProdEnvCode = "qa";
      }
      let hcvConfigKey = undefined;
      if (envConfig.hcv) {
        hcvConfigKey = "hcv";
      } else if (envConfig.replace_to_hcv_once_onboarded) {
        hcvConfigKey = "replace_to_hcv_once_onboarded";
      }

      if (hcvConfigKey) {
        if (envConfig[hcvConfigKey].role) {
          const roleParts = envConfig[hcvConfigKey].role.split('_app_k8s_');
          if (roleParts && roleParts.length > 1) {
            const componentPattern = /^55313-[\d]+-.*$/;
            if (name == 'ct1_qa_hk') {
              envConfig[hcvConfigKey].role = `55313_<%= componentId %>_app_k8s_` + roleParts[1];
            } else {
              if (componentPattern.test(roleParts[1])) {
                envConfig[hcvConfigKey].role = `55313_<%= componentId %>_app_k8s_` + ctNonProdEnvCode + roleParts[1].substr(5);
              } else {
                envConfig[hcvConfigKey].role = `55313_<%= componentId %>_app_k8s_` + ctNonProdEnvCode + roleParts[1];
              }
            }
          }
        }

        if (envConfig[hcvConfigKey].data) {
          envConfig[hcvConfigKey].data.forEach((hcvItem) => {
            if (hcvItem.path?.indexOf('/app/kv/data/') > 0) {
              const hcvItemParts = hcvItem.path.split('/app/kv/data/');
              hcvItem.path = 'scb/55313/' + componentId + '/app/kv/data/' + hcvItemParts[1];
            } else if (hcvItem.path?.indexOf('/hklvddsvb0001a.pi.dev.net/static-creds/') > 0 ||
              hcvItem.path?.indexOf('/hklvddsvb0002a.pi.dev.net/static-creds/') > 0) {
              hcvItem.path = 'scb/hkifz4pl1wfkq00.hk.standardchartered.com/static-creds/postgres_sb-55313-' + componentId + '-app';
            } else if (hcvItem.path?.startsWith('tsa/')) {
              hcvItem.path = 'scb' + hcvItem.path.substr(3);
            }
          })
        }
      }
    }

    // update internal local address to new pattern in application.properties and ct_sit/ct_uat env files
    if (name == 'ct1_uat_hk' || name == 'ct1_sit_hk' || name == 'ct1_dev_hk') {
      const appProperitesFilePath =
        "./src/main/resources/application.properties";
      if (fs.existsSync(appProperitesFilePath)) {
        const fileContent = fs.readFileSync(appProperitesFilePath, 'utf-8');
        let destFileContent = fileContent;
        const localAddressPattern = /(?<key>.+?)\s*?=(?<value>(?<startStr>.*?)(?<localAddress>http:\/\/.*.svc.cluster.local[^}\n\r]*)(?<endStr>.*))/g;

        const matches = fileContent.matchAll(localAddressPattern);

        for (const match of matches) {
          const { key, value, localAddress } = match?.groups;
          // skip comment lines
          if (key.match(/^\s*#/)) {
            continue;
          }
          const env = name.substr(4).substr(0, 3);
          const varName = key.toUpperCase().replaceAll(/\W/g, '_').replace(/_{2,}/g, '_');
          const varValue = localAddress.replace(/\.55313/, `.${env}`);
          let envVarName = varName;
          // static value
          if (!value.includes("${")) { // need to update application.properties
            needUpdateAppProps = true;
            destFileContent = destFileContent.replaceAll(match[0], `${key}=\${${varName}:${value}}`);
          } else { // with variables ${
            const definedVarName = value.match(/\$\{(?<var>\S+?):/)?.groups.var;
            if (definedVarName === varName) { // already processed, no need to change application properties
              envVarName = varName
            } else { // defined with different variable name, update local address to that env variable
              envVarName = definedVarName;
            }
          }
          // add new env variable
          ctNonProdEndpointEnvData.push({
            name: envVarName,
            value: varValue,
          })
        }
        // If need udpate application.properties file, assign needed inforamation to appPropConfig
        if (needUpdateAppProps) {
          appPropConfig = {
            name: appProperitesFilePath,
            content: destFileContent,
            isAppPropConfig: true
          }
        }
      }
    }
  } else if (!envConfig && (name == 'df2_sit_sg' || name == 'df2_uat_sg' || name == 'df2_qa_sg')) {
    if (name == 'df2_sit_sg') {
      propertyFilePath = './env/ct1_sit_hk/properties.yml';
    } else if (name == 'df2_uat_sg') {
      propertyFilePath = './env/ct1_uat_hk/properties.yml';
    } else if (name == 'df2_qa_sg') {
      propertyFilePath = './env/ct1_qa_hk/properties.yml';
    }

    if (fs.existsSync(propertyFilePath)) {
      const yamlContent = fs.readFileSync(propertyFilePath, 'utf-8');
      envConfig = yaml.load(yamlContent);
    }
  } else if (!envConfig && name == 'df2_uat_uk') {
    propertyFilePath = './env/gdcw2_uat_ark/properties.yml';
    if (fs.existsSync(propertyFilePath)) {
      const yamlContent = fs.readFileSync(propertyFilePath, 'utf-8');
      envConfig = yaml.load(yamlContent);
    }
  } else if (!envConfig && name == 'gdcw2_prod_ark') {
    propertyFilePath = "./env/gdcw1_prod_ark/properties.yml";
    if (fs.existsSync(propertyFilePath)) {
      const yamlContent = fs.readFileSync(propertyFilePath, 'utf-8');
      envConfig = yaml.load(yamlContent);
    }
  } else if (!envConfig && name == 'gdcw2_prod_watford') {
    propertyFilePath = "./env/gdcw1_prod_watford/properties.yml";
    if (fs.existsSync(propertyFilePath)) {
      const yamlContent = fs.readFileSync(propertyFilePath, 'utf-8');
      envConfig = yaml.load(yamlContent);
    }
  } else if (!envConfig && name == 'gdcw2_uat_ark') {
    propertyFilePath = "./env/gdce1_uat_jumbo/properties.yml";
    if (fs.existsSync(propertyFilePath)) {
      const yamlContent = fs.readFileSync(propertyFilePath, 'utf-8');
      envConfig = yaml.load(yamlContent);
      }
  }

  if (!envConfig) {
    envConfig = buildNewEnvConfig(templateData, envObj);
  }

  if (!envConfig.envData) {
    envConfig.envData = [];
  }

  let envData_SB_ENV_ID = undefined;
  let envData_SB_ENV_TYPE = undefined;
  let envData_SB_URL = undefined;

  envConfig.envData.forEach((envItem) => {
    if (envItem.name == 'SB_ENV_ID') {
      envData_SB_ENV_ID = envItem;
    } else if (envItem.name == 'SB_ENV_TYPE') {
      envData_SB_ENV_TYPE = envItem;
    } else if (envItem.name == 'SB_URL') {
      envData_SB_URL = envItem;
    }
  })

  if (!envData_SB_ENV_ID) {
    envData_SB_ENV_ID = { name: "SB_ENV_ID" };
    envConfig.envData.push(envData_SB_ENV_ID);
  }
  if (!envData_SB_ENV_TYPE) {
    envData_SB_ENV_TYPE = { name: "SB_ENV_TYPE" };
    envConfig.envData.push(envData_SB_ENV_TYPE);
  }
  if (!envData_SB_URL) {
    envData_SB_URL = { name: "SB_URL" };
    envConfig.envData.push(envData_SB_URL);
  }
  envData_SB_ENV_ID.value = name;
  envData_SB_ENV_TYPE.value = varEnvMap[name].type;
  envData_SB_URL.value = varEnvMap[name].url;

  if (name == 'df2_sit_sg' || name == 'df2_uat_sg' || name == 'df2_qa_sg' || name == 'df2_uat_uk') {
    const hasDbConfig = envConfig.envData?.some((item) =>
      item.name === 'PLATFORM_DB_NODE' || item.name === 'PLATFORM_DB_NAME' || item.name === 'PLATFORM_DB_USER'
    ) || envConfig.hcv?.data?.some((item) => item.targetName === 'PLATFORM_DB_PWD');

    if (hasDbConfig && templateData.cliType.includes('process') && dbEnvMap[name]) {
      const { hcvData, envData: dbEnvData } = getDbParameters(name, templateData);

      if (!envConfig.hcv) {
        envConfig.hcv = { data: [] };
      }
      if (!envConfig.hcv.data) {
        envConfig.hcv.data = [];
      }

      // PLATFORM_DB_PWD
      const oldHcvData = envConfig.hcv.data.find((item) => item.targetName === hcvData.targetName);
      if (oldHcvData) {
        oldHcvData.sourceName = hcvData.sourceName;
        oldHcvData.path = hcvData.path;
        oldHcvData.type = hcvData.type;
      } else {
        envConfig.hcv.data.push(hcvData);
      }

      // PLATFORM_DB_NODE, PLATFORM_DB_NAME, PLATFORM_DB_USER
      dbEnvData.forEach((item) => {
        const oldData = envConfig.envData.find((data) => data.name === item.name);
        if (oldData) {
          oldData.value = item.value;
        } else {
          envConfig.envData.push(item);
        }
      })
    }
  }

  if (ctNonProdEndpointEnvData.length > 0) {
    ctNonProdEndpointEnvData.forEach(item => {
      const oldData = envConfig.envData.find(data => data.name === item.name);
      if (oldData) {
        oldData.value = item.value;
      } else {
        envConfig.envData.push(item);
      }
    })
  }

  if (appPropConfig) {
    envConfig.__appPropConfig = appPropConfig;
  }
  // update SIP config (binaryData->config.json), SEP config (binaryData->config-egress.json) when format is not matched with pattern { common, rules }
  envConfig.binaryData?.forEach(item => {
    let data
    try {
      data = JSON.parse(item?.data);
    } catch (e) { }
    if (item?.filename === 'config.json' && (!data?.hasOwnProperty("common") || !data?.hasOwnProperty("rules"))) {
      const SIPParameters = getSIPParameters(templateData, name);
      item.base64enc = SIPParameters.base64enc;
      item.data = SIPParameters.data;
    }
    if (item?.filename === 'config-egress.json' && (!data?.hasOwnProperty("common") || !data?.hasOwnProperty("rules"))) {
      const SEPParameters = getSEPParameters(templateData, name);
      item.base64enc = SEPParameters.base64enc;
      item.data = SEPParameters.data;
    }
  })

  return envConfig;
}

const buildNewEnvConfig = (templateData, envObj) => {
  const { name } = envObj;
  const envConfig = {
    functionType: 'private-api',
    enableRestLivenessProbe: true,
    enableRestReadinessProbe: true,
    envData: [
      {
        name: 'SB_ENV_ID',
        value: name
      },
      {
        name: 'SB_ENV_TYPE',
        value: varEnvMap[name].type
      },
      {
        name: 'SB_URL',
        value: varEnvMap[name].url
      }
    ],
    binaryData: []
  };

  if (templateData.cliType.includes('nodejs')) {
    envConfig.runtime = 'nodejs';
  } else if (templateData.cliType.includes('python')) {
    envConfig.runtime = 'python';
  } else if (templateData.cliType.includes('golang')) {
    envConfig.runtime = 'go';
  } else if (templateData.cliType.includes('java') || templateData.cliType.includes('kotlin')) {
    envConfig.runtime = 'java';
  }

  const { role, data } = getHcvParameters(templateData, name);
  envConfig.hcv = { role, data };

  if (isDbEnabled(templateData) && templateData.cliType.includes('process') && name.startsWith('ct1_') && dbEnvMap[name]) {
    const { hcvData, envData: dbEnvData } = getDbParameters(name, templateData);
    envConfig.hcv.data.push(hcvData);
    dbEnvData.forEach(item => envConfig.envData.push(item));
  }
  if (templateData.cliType.includes('experience')) {

    if (name.includes('dev') || name.includes('sit')) {
      envConfig.enableSIP = false
      envConfig.enableSEP = false
    } else {
      envConfig.enableSIP = true
      envConfig.enableSEP = true
    }
    envConfig.binaryData.push(getSIPParameters(templateData, name));
    envConfig.binaryData.push(getSEPParameters(templateData, name));

  } else if (templateData.cliType.includes('process') || templateData.cliType.includes('mcp-api-nodejs') || templateData.cliType.includes('mcp-api-python')) {

    if (name.includes('dev') || name.includes('sit')) {
      envConfig.enableSIP = false
    } else {
      envConfig.enableSIP = true
    }
    envConfig.binaryData.push(getSIPParameters(templateData, name));
    
    if (templateData.cliType.includes('native')) {
      envConfig.isNative = true;
      envConfig.scaleToZero = true;
    }
  }

  return envConfig;
}

export const generator = (templateData, devEnvs, rbQaEnv, qaEnv, prodEnvs) => {

  let addEnvConfigs = true;
  if (templateData.cliType.includes('plugin') || templateData.cliType.includes('widget')) {
    addEnvConfigs = false;
  }

  if (!addEnvConfigs) {
    return [];
  }

  const allEnvConfigs = [];
  devEnvs.forEach((env) => {
    devEnvMap[env].forEach((envObj) => {
      allEnvConfigs.push(envObj);
    });
  });
  allEnvConfigs.push(rbQaEnvMap[rbQaEnv]);
  allEnvConfigs.push(qaEnvMap[qaEnv]);
  prodEnvs.forEach((env) => {
    prodEnvMap[env].forEach((envObj) => {
      allEnvConfigs.push(envObj);
    });
  });
  let appPropConfig;
  const allConfs = allEnvConfigs.map((envObj) => {
    const { name } = envObj;
    let envConfig = {};
    if (templateData.cliAction === 'update') {
      envConfig = updateEnvConfig(templateData, envObj);
      if (envConfig.__appPropConfig) {
        appPropConfig = envConfig.__appPropConfig;
        delete envConfig.__appPropConfig;
      }
    } else {
      envConfig = buildNewEnvConfig(templateData, envObj);
    }

    return {
      name,
      content: yaml.dump(envConfig, {
        lineWidth: -1
      })
    }

  });
  // add application.properties information to the array
  if (appPropConfig) {
    allConfs.push(appPropConfig);
  }

  return allConfs;

}