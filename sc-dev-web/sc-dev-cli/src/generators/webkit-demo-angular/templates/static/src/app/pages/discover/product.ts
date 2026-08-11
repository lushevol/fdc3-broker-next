export interface Product {
  id: string;
  title: string;
  icon?: string;
  solutions?: {
    title: string;
    icon: string;
  }[];
  feature?: {
    title: string;
    features: {
      title: string;
      copy: string;
    }[];
  };
}
