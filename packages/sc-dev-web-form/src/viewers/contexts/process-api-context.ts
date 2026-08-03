import { createContext } from '@lit/context';
import type { FormDefinition } from '../../models/FormDefinition.js';
import type { DataSource } from '../../models/DataSource.js';
import { contexts } from './constant.js';
import { isProcessApiSource, loadParsedProcessApiInfo } from '../utils/process-api.js';

type ParsedProcessApiInfo = {
  endpointMapping?: Record<string, { summary?: string; fields?: string[] }>;
};

type ProcessApiCacheEntry = {
  fields: string[];
  loading: boolean;
  error?: unknown;
  promise?: Promise<string[]>;
  lastLoadedAt?: number;
  sourceKey?: string;
};

export interface ProcessApiContextValue {
  getCachedFields: (dataSource?: DataSource) => string[];
  getOrLoadFields: (dataSource?: DataSource) => Promise<string[]>;
  primeByDefinition: (definition?: FormDefinition) => Promise<void>;
  invalidateByDataSourceId: (dataSourceId?: string) => void;
}

const EMPTY_FIELDS: string[] = [];

const buildSourceKey = (dataSource?: DataSource) => [
  dataSource?.id || '',
  dataSource?.apiNameSpaceId || '',
  dataSource?.apiQueryName || '',
  dataSource?.apiEndpointSummary || '',
  dataSource?.apiEndpoint || '',
].join('::');

const resolveProcessDatasetKey = (
  dataSource: DataSource,
  endpointMapping: Record<string, { summary?: string; fields?: string[] }> = {},
) => {
  const keys = Object.keys(endpointMapping || {});
  if (!keys.length) {
    return '';
  }

  const candidates = [
    dataSource.apiQueryName,
    dataSource.apiEndpointSummary,
    dataSource.apiEndpoint,
    dataSource.apiQueryNameLabel,
  ]
    .filter((item: string | undefined): item is string => !!item)
    .map((item: string) => item.trim());

  const valueMatch = keys.find((key: string) => candidates.includes(key));
  if (valueMatch) {
    return valueMatch;
  }

  const labelMatch = Object.entries(endpointMapping).find(([, value]) =>
    candidates.includes(String(value?.summary || '').trim()),
  );

  return labelMatch?.[0] || '';
};

const createCacheEntry = (): ProcessApiCacheEntry => ({
  fields: [],
  loading: false,
});

export const createProcessApiContextValue = (
  graphQLClient: any,
  onUpdated?: () => void,
): ProcessApiContextValue => {
  const cacheByDataSourceId: Record<string, ProcessApiCacheEntry> = {};
  const apiInfoPromiseByNamespaceId: Record<string, Promise<ParsedProcessApiInfo>> = {};

  const getEntry = (dataSourceId: string) => {
    if (!cacheByDataSourceId[dataSourceId]) {
      cacheByDataSourceId[dataSourceId] = createCacheEntry();
    }
    return cacheByDataSourceId[dataSourceId];
  };

  const getCachedFields = (dataSource?: DataSource): string[] => {
    if (!dataSource) return EMPTY_FIELDS;
    if (!isProcessApiSource(dataSource)) {
      if (Array.isArray(dataSource.apiFields)) {
        return dataSource.apiFields.filter(Boolean) as string[];
      }
      return EMPTY_FIELDS;
    }

    const entry = cacheByDataSourceId[dataSource.id];
    return entry?.fields || EMPTY_FIELDS;
  };

  const getOrLoadFields = async (dataSource?: DataSource): Promise<string[]> => {
    if (!dataSource) return EMPTY_FIELDS;
    if (!isProcessApiSource(dataSource)) {
      return getCachedFields(dataSource);
    }

    const dataSourceId = dataSource.id;
    if (!dataSourceId) return EMPTY_FIELDS;

    const entry = getEntry(dataSourceId);
    const sourceKey = buildSourceKey(dataSource);

    if (entry.sourceKey === sourceKey && entry.fields.length > 0) {
      return entry.fields;
    }

    if (entry.loading && entry.promise && entry.sourceKey === sourceKey) {
      return entry.promise;
    }

    const namespaceId = dataSource.apiNameSpaceId;
    if (!namespaceId || !graphQLClient) {
      entry.fields = [];
      entry.loading = false;
      entry.sourceKey = sourceKey;
      onUpdated?.();
      return entry.fields;
    }

    entry.loading = true;
    entry.error = undefined;
    entry.sourceKey = sourceKey;

    entry.promise = (async () => {
      try {
        const parsedPromise = apiInfoPromiseByNamespaceId[namespaceId]
          || loadParsedProcessApiInfo(graphQLClient, namespaceId);
        apiInfoPromiseByNamespaceId[namespaceId] = parsedPromise;

        const parsed = await parsedPromise;
        const datasetKey = resolveProcessDatasetKey(dataSource, parsed?.endpointMapping || {});
        const endpointMeta = parsed?.endpointMapping?.[datasetKey] || {};
        const fields = Array.isArray(endpointMeta.fields)
          ? endpointMeta.fields.filter((item: string | null | undefined): item is string => !!item)
          : [];

        entry.fields = fields;
        entry.lastLoadedAt = Date.now();
        return fields;
      } catch (error) {
        delete apiInfoPromiseByNamespaceId[namespaceId];
        entry.error = error;
        entry.fields = [];
        return EMPTY_FIELDS;
      } finally {
        entry.loading = false;
        entry.promise = undefined;
        onUpdated?.();
      }
    })();

    return entry.promise;
  };

  const primeByDefinition = async (definition?: FormDefinition): Promise<void> => {
    const dataSources = definition?.getDataSources?.() || [];
    const processSources = (dataSources as DataSource[]).filter((source: DataSource) =>
      isProcessApiSource(source),
    );

    await Promise.all(processSources.map((source: DataSource) => getOrLoadFields(source)));
  };

  const invalidateByDataSourceId = (dataSourceId?: string) => {
    if (!dataSourceId) return;
    delete cacheByDataSourceId[dataSourceId];
    onUpdated?.();
  };

  return {
    getCachedFields,
    getOrLoadFields,
    primeByDefinition,
    invalidateByDataSourceId,
  };
};

export const processApiContext = createContext<ProcessApiContextValue>(contexts.PROCESS_API);
