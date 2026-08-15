import React, { type ReactNode } from "react";
import type { VitestUtils } from "vitest";

interface MockComponentProps {
  children?: ReactNode;
}

const mockComponent = ({ children }: MockComponentProps) => {
  return <section>{children}</section>;
};

async function mockImport(name: string) {
  return Promise.resolve({
    __esModule: true,
    default: mockComponent,
    [name]: mockComponent,
    getRoot: mockComponent,
  });
}

export default function setupLegacyTestEnvironment(testApi: VitestUtils) {
  Object.assign(globalThis, {
    System: {
      import: testApi.fn(mockImport),
    },
  });
  testApi.mock("@scdevkit/webkit/elements/sc-button", () => ({
    __esModule: true,
    default: (_props: unknown) => undefined,
  }));
  testApi.mock("@scdevkit/webkit/elements/sc-icon-card", () => ({
    __esModule: true,
    default: (_props: unknown) => undefined,
  }));

  console.error = (..._args: unknown[]) => undefined;
  console.log = (..._args: unknown[]) => undefined;
  console.info = (..._args: unknown[]) => undefined;
  testApi.setConfig({ testTimeout: 60_000 });
}
