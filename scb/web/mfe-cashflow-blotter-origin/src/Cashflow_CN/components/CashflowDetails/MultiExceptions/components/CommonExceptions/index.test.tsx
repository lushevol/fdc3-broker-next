import { render, screen } from "@testing-library/react";

import { ExceptionCategory, ExceptionItem } from "../../common/interface";
import CommonExceptions, {
  commonRiskFirst,
  highPriorityCategories,
  isExceptionCategory,
  isHighPriority} from "./index";

const mockData: ExceptionItem[] = [
  {
    Id: "1",
    Exception_Category: ExceptionCategory.HIGH_RISK_NSTP,
    Exception_Code: "HRN",
    Description: "High risk NSTP",
  },
  {
    Id: "2",
    Exception_Category: ExceptionCategory.HARD_BLOCKER,
    Exception_Code: "HB",
    Description: "Hard Blocker",
  },
  {
    Id: "3",
    Exception_Category: ExceptionCategory.NSTP,
    Exception_Code: "NSTP",
    Description: "NSTP",
  },
];

describe("highPriorityCategories", () => {
  it("should contain HIGH_RISK_NSTP and HARD_BLOCKER", () => {
    expect(highPriorityCategories).toContain(ExceptionCategory.HIGH_RISK_NSTP);
    expect(highPriorityCategories).toContain(ExceptionCategory.HARD_BLOCKER);
  });
});

describe("isExceptionCategory", () => {
  it("should return true for valid ExceptionCategory", () => {
    expect(isExceptionCategory(ExceptionCategory.HIGH_RISK_NSTP)).toBe(true);
    expect(isExceptionCategory(ExceptionCategory.HARD_BLOCKER)).toBe(true);
  });

  it("should return false for invalid values", () => {
    expect(isExceptionCategory("INVALID")).toBe(false);
    expect(isExceptionCategory(null)).toBe(false);
    expect(isExceptionCategory(undefined)).toBe(false);
    expect(isExceptionCategory(123)).toBe(false);
  });
});

describe("isHighPriority", () => {
  it("should return true for high priority categories", () => {
    expect(isHighPriority(ExceptionCategory.HIGH_RISK_NSTP)).toBe(true);
    expect(isHighPriority(ExceptionCategory.HARD_BLOCKER)).toBe(true);
  });
  it("should return false for non-high priority categories", () => {
    expect(isHighPriority(ExceptionCategory.NSTP)).toBe(false);
    expect(isHighPriority(undefined)).toBe(false);
    expect(isHighPriority(null)).toBe(false);
    expect(isHighPriority("")).toBe(false);
  });
    it("should return false for non-high priority categories", () => {
    expect(isHighPriority("INVALID" as any)).toBe(false);
    expect(isHighPriority(null)).toBe(false);
    expect(isHighPriority(undefined)).toBe(false);
  });
});

describe("commonRiskFirst", () => {
  it("should sort high priority first", () => {
    const arr = [...mockData];
    arr.sort(commonRiskFirst);
    expect(arr[0].Exception_Category).toBe(ExceptionCategory.HIGH_RISK_NSTP);
    expect(arr[1].Exception_Category).toBe(ExceptionCategory.HARD_BLOCKER);
  });
  it("should return 0 if both are same priority", () => {
    const a = mockData[0];
    const b = { ...a };
    expect(commonRiskFirst(a, b)).toBe(0);
  });
});

describe("CommonExceptions", () => {
  it("should render all exception items", () => {
    render(<CommonExceptions data={mockData} />);
    expect(screen.getByText("HRN")).toBeInTheDocument();
    expect(screen.getByText("HB")).toBeInTheDocument();
    expect(screen.getByText("NSTP")).toBeInTheDocument();
  });
});