/** Complete the X 6 presentation callback inputs without owning detail state. */
export function createDetailValueGetterParams(record: Record<string, unknown>, field: string) {
  return { row: record, field, value: record[field] };
}
