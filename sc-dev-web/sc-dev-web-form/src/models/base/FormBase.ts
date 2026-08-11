import { v4 } from 'uuid';

export class FormBase {
  id: string;
  metadata: object;
  components: any[];
  layout = {
    row: v4(),
  };
}
