declare module '@migrated-cashflow-cn' {
  import type { ComponentType } from 'react';

  const CashflowCn: ComponentType<{
    readonly tile: string;
    readonly parameters?: {
      readonly cashflowId: string;
    };
  }>;

  export default CashflowCn;
}
