import { store } from "src/Cashflow_BIC_Netting_Static_Table/store";
import { ReduxProviderWrapper, render } from "src/test/test-utils";

import { AuditById } from "./AuditById";

it('AuditById', () => {
    const wrapper = ReduxProviderWrapper(store);
    const { queryByTestId } = render(<AuditById />, { wrapper });
    expect(queryByTestId("bic-netting-static-audit-datagrid")).toBeInTheDocument();
});