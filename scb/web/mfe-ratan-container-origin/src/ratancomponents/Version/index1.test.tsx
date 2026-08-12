import { render, screen } from "@testing-library/react";
import { Version } from ".";

afterAll(() => {
  jest.clearAllMocks();
});
jest.mock('../../ratanutils/utils', () => {
  return {
    isProduction: () => false,
  };
});

describe("Version component", () => {
  it("should be in the document", () => {
    render(
      <Version version="1" env="2" />
    );
    expect(screen).toBeDefined();
  });
});
