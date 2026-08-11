import { describe, it, expect } from "@jest/globals";
import { helloWorldResolver } from "../../src/resolvers/hello-world.mjs";

describe("helloWorld resolver", () => {
  it("returns message", async () => {
    const result = await helloWorldResolver();

    expect(result.message).toEqual("Hello World!");
  });
});
