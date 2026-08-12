export type FilterItemConfig = {
  label: string;
  name: string;
  key: string;
  type: string;
  hide?: boolean;
  options: {
    label: string;
    value: string;
    tag?: string;
  }[];
};
