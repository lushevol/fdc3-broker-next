import { describe, it, expect } from "@jest/globals";
import helloWorld from "../../src/actions/hello-world.mjs";

describe("hello-world", () => {
  it("send message", async () => {
    const resHeaders = {};
    let resBody = null;
    const req = {};
    const res = {
      set: (name, value) => {
        resHeaders[name] = value;
      },
      send: (obj) => {
        resBody = obj;
      },
    };
    await helloWorld(req, res);

    expect(resHeaders["Content-Type"]).toEqual("application/json");
    expect(resBody.message).toEqual("Hello World!");
  });
});
