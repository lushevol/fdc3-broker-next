import { fireEvent,render } from "@testing-library/react";
import { AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN } from "src/Root/analysis/const";

import { AuditEntry } from "./Entry";

vi.mock("src/Cashflow_Splitting_Static/store", () => ({
    useAppDispatch: () => vi.fn(),
}));
vi.mock("src/Cashflow_Splitting_Static/store/audit.slice", () => ({
    openAuditDialog: vi.fn(() => ({ type: "OPEN_AUDIT_DIALOG" })),
}));

describe("AuditEntry", () => {
    it("should render the Audit button", () => {
        const { getByTestId } = render(<AuditEntry />);
        const btn = getByTestId(AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN);
        expect(btn).toBeInTheDocument();
        expect(btn).toHaveTextContent("Audit");
    });

    it("should dispatch openAuditDialog when clicked", () => {
        const mockDispatch = vi.fn();
        vi.spyOn(require("src/Cashflow_Splitting_Static/store"), "useAppDispatch").mockReturnValue(mockDispatch);

        const { getByTestId } = render(<AuditEntry />);
        const btn = getByTestId(AUTO_SPLIT_STATIC_BLOTTER_AUDIT_BTN);
        fireEvent.click(btn);
        expect(mockDispatch).toHaveBeenCalledWith(
            expect.objectContaining({ type: "OPEN_AUDIT_DIALOG" })
        );
    });
});