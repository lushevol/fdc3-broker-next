import { cloneProperties } from '../shared/utils.js';
import { DataSource } from './DataSource.js';

class ParameterType {
  name: string;
  source: string;
  value: string;
}

export class OptionConfig {
  dataSource: DataSource;
  parameters: ParameterType[];
  type = 'static';
  labelField: string;
  valueField: string;
  extraFields?: string[];
  id: string;
  conf: {property: string; header: any;}[];
  keys: object;

  constructor(dataSource?: DataSource, parameters?: ParameterType[]) {
    this.dataSource = dataSource ? DataSource.from(dataSource) : new DataSource();
    if (!parameters || !Array.isArray(parameters)) {
      this.parameters = [new ParameterType()];
      return this;
    }
    this.parameters = parameters.map(parameter => ({ ...parameter }));
  }

  static from(target: any) {
    const obj = { ...target };
    if (!obj) return new OptionConfig();

    const parameters = (obj.parameters || []).slice();
    Reflect.deleteProperty(obj, 'parameters');
    const { dataSource } = obj;
    Reflect.deleteProperty(obj, 'dataSource');
    const newInstance = new OptionConfig(dataSource, parameters);
    cloneProperties(newInstance, obj);
    return newInstance;
  }

}
