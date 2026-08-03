import { BrowserRouter } from 'react-router-dom';
import MigratedCashflowCn from '@migrated-cashflow-cn';

export interface MigratedCashflowCnEntryProps {
  readonly instanceId: string;
  readonly cashflowId?: string;
}

export function MigratedCashflowCnEntry({
  instanceId,
  cashflowId,
}: MigratedCashflowCnEntryProps) {
  return (
    <BrowserRouter>
      <MigratedCashflowCn
        tile={instanceId}
        parameters={cashflowId ? { cashflowId } : undefined}
      />
    </BrowserRouter>
  );
}
