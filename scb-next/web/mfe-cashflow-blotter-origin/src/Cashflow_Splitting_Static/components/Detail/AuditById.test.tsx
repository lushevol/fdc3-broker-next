import React from "react";
import createStore from "src/Cashflow_Splitting_Static/store";
import { ReduxProviderWrapper, render } from "src/test/test-utils";

import { AuditById } from "./AuditById";

describe("AuditById", () => {
it('AuditById', () => {
    const store = createStore();
    const wrapper = ReduxProviderWrapper(store);
    const { queryByTestId } = render(<AuditById />, { wrapper });
    expect(queryByTestId("split-audit-by-id-blotter")).toBeInTheDocument();
});
});