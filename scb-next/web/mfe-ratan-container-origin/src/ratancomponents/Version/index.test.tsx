import { render, screen } from "@testing-library/react";
import { Version } from ".";

afterAll(() => {
  vi.clearAllMocks();
});
vi.mock('../../ratanutils/utils', () => {
  return {
    isProduction: () => true,
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
