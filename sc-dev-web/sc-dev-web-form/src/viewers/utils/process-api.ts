export type ProcessApiListItem = {
  id: string;
  name?: string;
  displayName?: string;
  namespace?: string;
  metadataInfo?: {
    url?: string;
  };
};

export type ProcessApiParameter = {
  name: string;
  type: string;
  required: boolean;
};

export type ProcessApiEndpointMeta = {
  method: string;
  endpoint: string;
  summary: string;
  parameters: ProcessApiParameter[];
  fields: string[];
};

export type ProcessApiArgumentMeta = {
  value: string;
  in?: string;
};

export type ApiNamespaceType = 'exp' | 'process';

export const isProcessApiSource = (source: {
  type?: string;
  apiType?: ApiNamespaceType | string;
}) => source?.apiType === 'process' || source?.type === 'api-process';

export const mapProcessApiListToNamespaces = (list: any[] = []) =>
  list.map((item: any) => ({
    id: item.id,
    name: item.displayName || item.name,
    namespace: item.namespace || 'process',
    metadataInfo: item.metadataInfo,
    type: item.type || 'process' as ApiNamespaceType,
  }));

export const buildProcessApiListQuery = (name = '') => {
  const nameParam = name ? `${name}` : '';
  return `query MyQuery {
    api: _55313_128_webkit_exp_api {
      get_findApiList(query: {keyword: "${nameParam}"}) {
        id
        name
        displayName
        namespace
        type
        metadataInfo {
          url
        }
      }
    }
  }`;
};

export const buildProcessApiInfoQuery = (id: string) => `query MyQuery {
  api: _55313_128_webkit_exp_api {
    get_apiInfoById(id: "${id}")
  }
}`;

const toBasicType = (type?: string) => {
  if (!type) return 'string';
  if (type === 'integer' || type === 'number') return 'number';
  if (type === 'boolean') return 'boolean';
  if (type === 'array') return 'array';
  if (type === 'object') return 'object';
  return 'string';
};

const resolveSchemaProperties = (schema: any, components: any, prefix = ''): Record<string, any> => {
  if (!schema) return {};

  const properties = schema?.properties
    || components?.schemas?.[(schema?.$ref || schema?.items?.$ref || '').split('/').pop() || '']?.properties
    || {};

  return Object.entries(properties).reduce((acc: Record<string, any>, [key, value]: [string, any]) => {
    if (!key) return acc;

    const fieldName = `${prefix}${key}`;
    if (value?.$ref || value?.items?.$ref) {
      return {
        ...acc,
        ...resolveSchemaProperties(value, components, `${fieldName}.`),
      };
    }

    acc[fieldName] = value;
    return acc;
  }, {});
};

const extractParameters = (endpointInfo: any, components: any): ProcessApiParameter[] => {
  const headerAndQueryParams = (endpointInfo?.parameters || []).map((param: any) => ({
    name: param?.name,
    type: toBasicType(param?.schema?.type),
    required: !!param?.required,
    in: param?.in,
  }));

  // TODO: need to fix the logic for requestBody when it's in form-data or x-www-form-urlencoded format
  const requestBodySchema = Object.values(endpointInfo?.requestBody?.content || {})?.[0] as any;
  const bodyProperties = resolveSchemaProperties(requestBodySchema?.schema, components);
  const requiredFields: string[] = requestBodySchema?.schema?.required || [];
  const bodyParams = Object.entries(bodyProperties || {}).map(([name, value]: [string, any]) => ({
    name,
    type: toBasicType(value?.type),
    required: requiredFields.includes(name),
  }));

  return [...headerAndQueryParams, ...bodyParams].filter(param => !!param.name);
};

const extractResponseFields = (endpointInfo: any, components: any): string[] => {
  const responseSchema =
    endpointInfo?.responses?.['200']?.content?.['application/json']?.schema ||
    endpointInfo?.responses?.default?.content?.['application/json']?.schema;
  const properties = resolveSchemaProperties(responseSchema, components);
  return Object.keys(properties || {});
};

export const parseProcessSwaggerDoc = (apiInfo: any, tag?: string) => {
  const parsedApiInfo = apiInfo || {};
  const components = parsedApiInfo.components || {};
  const paths = parsedApiInfo.paths || {};

  const endpointMapping: Record<string, ProcessApiEndpointMeta> = {};
  const datasets: Array<{ label: string; value: string }> = [];

  // Count summaries across the whole document (all paths/methods).
  const summaryCount: Record<string, number> = {};
  Object.values(paths).forEach((endpointDef: any) => {
    Object.values(endpointDef || {}).forEach((info: any) => {
      const summary = info?.summary;
      if (!summary) return;
      summaryCount[summary] = (summaryCount[summary] || 0) + 1;
    });
  });
  Object.entries(paths).forEach(([endpoint, endpointDef]: [string, any]) => {
    Object.entries(endpointDef || {}).forEach(([method, endpointInfo]: [string, any]) => {
      const tags = endpointInfo?.tags || [];
      if (tag && !tags.includes(tag)) {
        return;
      }

      let summary = endpointInfo?.summary;
      if (summary && summaryCount[summary] > 1) {
        summary = `${summary || ''} (${method.toUpperCase()} ${endpoint})`;
      } else if (!summary) {
        summary = `${method.toUpperCase()} ${endpoint}`;
      }

      const parameters = extractParameters(endpointInfo, components);
      const fields = extractResponseFields(endpointInfo, components);

      endpointMapping[endpoint] = {
        method,
        endpoint,
        summary,
        parameters,
        fields,
      };
      datasets.push({
        label: summary,
        value: endpoint,
      });
    });
  });

  return {
    endpointMapping,
    datasets,
    components,
  };
};

export const loadParsedProcessApiInfo = async (
  graphQLClient: any,
  id: string,
) => {
  const response = await graphQLClient?.query(buildProcessApiInfoQuery(id));
  const jsonData = await response.json();
  const responseData = jsonData.data || jsonData;

  let apiInfo: any = {};
  try {
    apiInfo = JSON.parse(responseData?.api?.get_apiInfoById || '{}');
  } catch (error) {
    apiInfo = {};
  }

  return parseProcessSwaggerDoc(apiInfo);
};

export const generateRestQuery = (config: any) => {
  const payload = Object.entries(config?.filters || {}).reduce(
    (acc: Record<string, any>, [key, value]: [string, any]) => {
      acc[key] = value?.value;
      return acc;
    },
    {} as Record<string, any>,
  );

  return {
    apiNameSpace: config?.apiNameSpace,
    endpoint: config?.apiEndpoint,
    method: (config?.apiMethod || 'POST').toUpperCase(),
    payload,
    apiArguments: config?.apiArguments || [],
  };
};

export const parseProcessNamespace = (
  namespace: string,
): { functionName: string; ns: string } => {
  const withoutProtocol = (namespace || '').replace(/^https?:\/\//, '');
  const dotIndex = withoutProtocol.indexOf('.');
  if (dotIndex === -1) {
    return { functionName: withoutProtocol, ns: '' };
  }
  return {
    functionName: withoutProtocol.substring(0, dotIndex),
    ns: withoutProtocol.substring(dotIndex + 1),
  };
};

const getProcessParamIn = (
  apiArguments: ProcessApiArgumentMeta[] = [],
  name: string,
) => apiArguments.find((item: ProcessApiArgumentMeta) => item?.value === name)?.in;

const buildProcessPath = (
  endpoint: string,
  method: string,
  payload: Record<string, any>,
  apiArguments: ProcessApiArgumentMeta[] = [],
) => {
  const upperMethod = method.toUpperCase();
  let path = endpoint || '';
  const pathParamKeys = new Set<string>();

  const pathParams = apiArguments.filter((item: ProcessApiArgumentMeta) => item?.in === 'path');
  pathParams.forEach((param: ProcessApiArgumentMeta) => {
    const key = param?.value;
    pathParamKeys.add(key);
    const rawValue = payload[key] || '';
    const encodedValue = encodeURIComponent(rawValue);
    path = path.replace(new RegExp(`\\{${key}\\}`, 'g'), encodedValue);
  });

  path = path.replace(/\{([^}]+)\}/g, (match: string, key: string) => {
    const value = payload[key];
    if (value === undefined || value === null || value === '') {
      return match;
    }
    pathParamKeys.add(key);
    return encodeURIComponent(value);
  });

  if (upperMethod === 'GET') {
    const queryParams = Object.entries(payload)
      .filter(([key, value]) => {
        if (value === undefined || value === null || value === '') return false;
        const paramIn = getProcessParamIn(apiArguments, key);
        if (paramIn === 'path') return false;
        if (!paramIn && pathParamKeys.has(key)) return false;
        return paramIn === 'query' || !paramIn;
      })
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);

    if (queryParams.length > 0) {
      path = `${path}${path.includes('?') ? '&' : '?'}${queryParams.join('&')}`;
    }
  }

  return { path, pathParamKeys };
};

const buildProcessPayload = (
  method: string,
  payload: Record<string, any>,
  apiArguments: ProcessApiArgumentMeta[] = [],
) => {
  const upperMethod = method.toUpperCase();
  return Object.entries(payload).reduce((acc: Record<string, any>, [key, value]) => {
    const paramIn = getProcessParamIn(apiArguments, key);
    if (paramIn === 'path') {
      return acc;
    }
    if (upperMethod === 'GET' && (paramIn === 'query' || !paramIn)) {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
};

export const invokeProcessApiRaw = async (
  restClient: any,
  config: {
    apiNameSpace: string;
    endpoint: string;
    method: string;
    payload?: Record<string, any>;
    apiArguments?: ProcessApiArgumentMeta[];
  },
) => {
  const method = (config.method || 'POST').toUpperCase();
  const payload = config.payload || {};
  const apiArguments = config.apiArguments || [];
  const { functionName, ns } = parseProcessNamespace(config.apiNameSpace);
  const { path } = buildProcessPath(config.endpoint, method, payload, apiArguments);
  const requestPayload = buildProcessPayload(method, payload, apiArguments);

  return restClient?.request(
    '55313-128-webkit-plugin-webkit-exp-api',
    'api/webkit/v1/proxy:invoke',
    'POST',
    JSON.stringify({
      ns,
      functionName,
      endpoint: '',
      path,
      method,
      payload: requestPayload,
    }),
    {
      'Content-Type': 'application/json',
    },
  );
};
