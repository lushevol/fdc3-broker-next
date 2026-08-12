import {
  queryCounterpartyDynamicList,
  queryFetchPortfolio,
} from '@cashflow-ratan/ratanutils/http/graphql';

interface MessageApi {
  info(message: string): void;
  error(message: string): void;
}

interface ReferenceRecord {
  readonly fmId?: string;
  readonly counterpartyLongName?: string;
  readonly fm_profile_sys_gen_id?: string;
  readonly lmp_long_name?: string;
  readonly Name?: string;
  readonly [key: string]: unknown;
}

function options(records: readonly ReferenceRecord[], fieldName: string) {
  return records.map((record) => {
    const value =
      fieldName === 'lmp_long_name' ? record.lmp_long_name : record.fm_profile_sys_gen_id;
    return { label: String(value ?? ''), value: String(value ?? '') };
  });
}

export function debounceFindConterparty(
  value: string,
  fieldName: string,
  callback: (result: { label: string; value: string }[]) => void,
  messageApi: MessageApi,
  label: string,
) {
  queryCounterpartyDynamicList(fieldName, value)
    .then((response: { referenceData?: ReferenceRecord[] }) => {
      const records = response.referenceData ?? [];
      const result = records.map((record) => ({
        label: `${record.fmId ?? ''} | ${record.counterpartyLongName ?? ''}`,
        value: String(fieldName === 'fmId' ? (record.fmId ?? '') : (record[fieldName] ?? '')),
      }));
      if (result.length === 0) messageApi?.info(`[${label}] No data found`);
      callback(result);
    })
    .catch(() => callback([]));
}

export function debounceGetDynamicList(
  searchName: string,
  fieldName: string,
  callback: (result: { label: string; value: string }[]) => void,
  messageApi?: MessageApi,
  label?: string,
) {
  if (!searchName) return callback([]);
  if (searchName.length === 1 && fieldName !== 'fm_profile_sys_gen_id') {
    messageApi?.info('Please input more than two characters !');
    return callback([]);
  }
  queryCounterpartyDynamicList(fieldName, searchName)
    .then((response: { referenceData?: ReferenceRecord[] }) => {
      const result = options(response.referenceData ?? [], fieldName);
      if (result.length === 0) messageApi?.info(`[${label}] No data found`);
      callback(result);
    })
    .catch(() => callback([]));
}

export function getDynamicListForPortfolio(
  searchName: string,
  _fieldName: string,
  callback: (result: { label: string; value: string }[]) => void,
  messageApi?: MessageApi,
  label?: string,
) {
  if (searchName.length < 2) {
    if (searchName.length === 1) {
      messageApi?.info('Please input more than two characters !');
    }
    return callback([]);
  }
  queryFetchPortfolio(searchName)
    .then((response: { fetchPortfolio?: ReferenceRecord[] }) => {
      const result = (response.fetchPortfolio ?? []).map((record) => ({
        label: String(record.Name ?? ''),
        value: String(record.Name ?? ''),
      }));
      if (result.length === 0) messageApi?.info(`[${label}] No data found`);
      callback(result);
    })
    .catch((error: Error) => {
      messageApi?.error(error.message);
      callback([]);
    });
}
