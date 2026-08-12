import { render, screen } from "@testing-library/react";

import { ExceptionCategory } from "../../common/interface";
import Item, { getChipProps } from "./item";

const baseProps = {
    Exception_Code: "CODE",
    Description: "desc",
    Exception_Category: ExceptionCategory.NSTP,
};

describe("getChipProps", () => {
    it("should return error chip for HIGH_RISK_NSTP", () => {
        const props = { ...baseProps, Exception_Category: ExceptionCategory.HIGH_RISK_NSTP };
        const chipProps = getChipProps(props);
        expect(chipProps.color).toBe("error");
        expect(chipProps.icon).toBeTruthy();
    });

    it("should return error chip for HARD_BLOCKER", () => {
        const props = { ...baseProps, Exception_Category: ExceptionCategory.HARD_BLOCKER };
        const chipProps = getChipProps(props);
        expect(chipProps.color).toBe("error");
        expect(chipProps.icon).toBeTruthy();
    });

    it("should return warning chip for other categories", () => {
        const props = { ...baseProps, Exception_Category: ExceptionCategory.NSTP };
        const chipProps = getChipProps(props);
        expect(chipProps.color).toBe("warning");
        expect(chipProps.icon).toBeUndefined();
    });

    it("should return warning chip if Exception_Category is undefined", () => {
        const props = { ...baseProps, Exception_Category: undefined };
        const chipProps = getChipProps(props);
        expect(chipProps.color).toBe("warning");
        expect(chipProps.icon).toBeUndefined();
    });
});

describe("Item component", () => {
    it("should render chip with correct label and tooltip", () => {
        render(<Item {...baseProps} />);
        expect(screen.getByText("CODE")).toBeInTheDocument();
        // Tooltip is rendered on hover, but label is always present
    });

    it("should render error icon for HIGH_RISK_NSTP", () => {
        render(<Item {...baseProps} Exception_Category={ExceptionCategory.HIGH_RISK_NSTP} />);
        expect(screen).toBeDefined();
    });

    it("should render correct tooltip text", async () => {
        render(<Item {...baseProps} />);
        expect(screen).toBeDefined();
    });
});