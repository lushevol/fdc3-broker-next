import { getName } from "./util";

describe("Profil Util", () => {
  it("should be true", () => {
    getName({ applicationName: "a", name: "b", roleName: "c" })
    getName({ name: "b", roleName: "c" })
  });
});