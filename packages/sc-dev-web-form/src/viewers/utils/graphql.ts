export type GrapghqlKind = 'SCALAR' | 'OBJECT' | 'INTERFACE' | 'UNION' | 'ENUM' | 'INPUT_OBJECT' | 'LIST' | 'NON_NULL'

export interface ParseGraphQLResult {
  required: boolean
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'enum'
  origin: GraphQLParams
  name: string
  children: any[]
  options?: Array<{name: string, description: string}>
}

interface Oftype {
  name: string
  kind: GrapghqlKind
  ofType?: Oftype
}

export interface GraphQLParams {
  name?: string
  type: {
    kind: GrapghqlKind
    ofType?: Oftype
    // kind=SCALAR, name will be String、Int、Float、Boolean、ID、Object
    // kind=OBJECT, name will be interface name
    name?: string
  }
  enumValues?: Array<{
    name: string
    description: string
    isDeprecated: boolean
  }>
}

export interface GraphQLListItem {
  name: string
  kind: GrapghqlKind
  description?: string
  fields: FieldItem[]
  enumValues?: Array<{
    name: string
    isDeprecated: boolean
    description: string
  }>
  inputFields?: FieldItem[]
}

export interface Option {
  label: string
  value: string
  type?: string
}

export type Namespace = {
  namespace: string;
  id: string;
  name: string;
}

interface FieldItem {
  name: string
  isDeprecated: boolean
  args: GraphQLParams[]
  type: GraphQLParams['type']
}

const getScalarResultType = (currentType: string) => {
  if (['Int', 'Float'].includes(currentType)) {
    return 'number';
  } else if (currentType === 'Boolean') {
    return 'boolean';
  }
  return 'string';
};

export const parseGraphQL = (current: GraphQLParams, typeList: GraphQLListItem[]) => {
  const { name, type } = current;
  let result: ParseGraphQLResult = {
    origin: current,
    name,
  } as ParseGraphQLResult;
  if (type.kind === 'NON_NULL') {
    result.required = true;
    result = {
      ...parseGraphQL({ type: type.ofType! } as GraphQLParams, typeList),
      ...result,
    };
  } else if (type.kind === 'SCALAR') {
    result.type = getScalarResultType(type.name!);
  } else if (['OBJECT', 'INPUT_OBJECT'].includes(type.kind)) {
    result.type = 'object';
    const children: GraphQLParams[]  = (typeList.find(item => {
      const target = type.ofType ? type.ofType.name : type.name;
      return item.name === target;
    })?.[type.kind === 'OBJECT' ? 'fields' : 'inputFields'] || []) as GraphQLParams[];
    result.children = children.map(item => {
      return parseGraphQL(item, typeList);
    });
  } else if (type.kind === 'LIST') {
    result.type = 'array';
    if (type.ofType?.kind === 'SCALAR') {
      result.children = [{ type: getScalarResultType(type?.ofType?.name ?? '') }];
    } else if (type.ofType?.kind === 'NON_NULL') {
      if (type?.ofType?.ofType?.kind === 'SCALAR') {
        result.children = [{ type: getScalarResultType(type?.ofType.ofType.name ?? '') }];
      } else if (['OBJECT', 'INPUT_OBJECT'].includes(type?.ofType.ofType!.kind)) {
        const children: GraphQLParams[]  = (typeList.find(item => item.name === type.ofType!.ofType!.name)?.[type.ofType.ofType!.kind === 'OBJECT' ? 'fields' : 'inputFields'] || []) as GraphQLParams[];
        result.children = [{
          type: 'object',
          children: children.map(item => {
            return parseGraphQL(item, typeList);
          }),
        }];
      }
    }
  } else if (type.kind === 'ENUM') {
    result.type = 'enum';
    const target = current.enumValues ?? (typeList.find(({ name }) => name === current.name)!.enumValues || []);
    result.options = target.filter(({ isDeprecated }) => !isDeprecated);
  } else {
    // 'INTERFACE', 'UNION' as string
    result.type = 'string';
  }
  return result;
};

export const getFieldsfromResult = (params: ParseGraphQLResult) => {
  const name = params.name || '';
  let result: {label: string, value: string, type: ParseGraphQLResult['type'] }[] = [];
  if (params.children?.length) {
    params.children.forEach(item => {
      const currentName = `${name}${item.name ? `${name ? '.' : ''}${item.name}` : ''}`;
      if (item.children?.length) {
        result = result.concat(getFieldsfromResult({ ...item, name: currentName }));
      } else {
        result.push({ label: currentName, value: currentName, type: item.type });
      }
    });
  } else {
    result.push({ label: name, value: name, type: params.type });
  }
  return result;
};

const generateStrByType = (type: string, value: any) => {
  if (type === 'Number' || type === 'Boolean' || type === 'Int' || type === 'Object') {
    return value;
  }
  return `\"${value}\"`;
};

export const generateQuery = (query: any) => `query { 
  ${query.namespace} { 
      ${query.name} ${generateFiltersQueryText(query.filters)}
      ${generateFieldsQueryText(query.fields)} 
  } 
}`;

const generateFiltersQueryText = (filters: any) => {
  if (!filters) return '';
  const filterNames = Object.keys(filters);
  const fieldQueryObj: any = {};
  filterNames.forEach(name => {
    const value = filters[name];
    const arr = name.split('.');
    if (arr.length > 1) {
      fieldQueryObj[arr[0]] = fieldQueryObj[arr[0]] || {};
      fieldQueryObj[arr[0]] = {
        ...fieldQueryObj[arr[0]],
        [arr[1]]: generateStrByType(value?.type, value?.value),
      };
    } else {
      fieldQueryObj[arr[0]] = generateStrByType(value?.type, value?.value);
    }
    
  });
  // @ts-ignore
  let filterClauses = JSON.stringify(fieldQueryObj).replaceAll('"', '');
  // @ts-ignore
  filterClauses = filterClauses.slice(1, filterClauses.length - 1).replaceAll('\\', '"');
  return `(${filterClauses})`;
};

const generateFieldsQueryText = (fields: any[] = []) => {
  const queryObj = {};
  fields.forEach(field => {
    const fieldNames = field.split('.');
    const fieldQueryObj = {};
    let currentField: any = fieldQueryObj;
    fieldNames.forEach((fieldName: string) => {
      if (!currentField[fieldName]) {
        currentField[fieldName] = {};
      }
      currentField = currentField[fieldName];
    });
    mergeDeep(queryObj, fieldQueryObj);
  });
  const queryText = JSON.stringify(queryObj)
  // @ts-ignore
    .replaceAll(':{}', ' ')
    .replaceAll('"', '')
    .replaceAll(':', ' ')
    .replaceAll(',', '');
  return formatGraphQLFieldsQuery(queryText);
};

const formatGraphQLFieldsQuery = (queryText: string) => {
  let openCount = 2; // Offset for namespace and name
  const formattedQuery = queryText.replace(/[{}]/g, match => {
    let open = true;
    if (match === '{') {
      open = true;
      openCount += 1;
    } else if (match === '}') {
      open = false;
      openCount -= 1;
    }
    const nextTabCount = openCount;
    const currentTabCount = openCount + (open ? -1 : 0);
    return `\n${'\t'.repeat(currentTabCount)}${match}\n${'\t'.repeat(
      nextTabCount < 0 ? 0 : nextTabCount
    )}`;
  });
  return formattedQuery;
};

const isObject = (item: any) =>
  item && typeof item === 'object' && !Array.isArray(item);

// @ts-ignore
const mergeDeep = (target: any, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();
  if (isObject(target) && isObject(source)) {
    Object.entries(source).forEach(([key, value]) => {
      if (isObject(value)) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], value);
      } else {
        Object.assign(target, { [key]: value });
      }
    });
  }
  return mergeDeep(target, ...sources);
};