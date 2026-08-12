import { renderHook } from "@testing-library/react";
import React, { PropsWithChildren } from "react";
import Provider from "../hooks/provider";
import useServices from ".";

const mockPostService = vi.fn();

vi.mock("../hooks/service", () => ({
  getService: vi.fn(),
  postService: (...args: unknown[]) => mockPostService(...args),
}));

const wrapper = ({ children }: PropsWithChildren) => (
  <Provider>{children}</Provider>
);

describe("authentication services", () => {
  beforeEach(() => {
    mockPostService.mockReset();
  });

  it.each(["login", "loginEntra"] as const)(
    "%s propagates request failures",
    async (operation) => {
      const requestError = new Error("authentication unavailable");
      mockPostService.mockRejectedValueOnce(requestError);
      const { result } = renderHook(() => useServices(), { wrapper });

      await expect(result.current[operation]({})).rejects.toBe(requestError);
    }
  );
});
