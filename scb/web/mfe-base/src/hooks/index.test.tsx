import { render, screen, act } from "@testing-library/react";
import { getHooks } from ".";
import { initialData } from "./model/root";
import { emptyFunction } from "./provider";


describe("Tile1 Reducer", () => {
  it("should be equal to {}", async () => {
    emptyFunction();
    const hooks = getHooks()
    expect(hooks.store).toStrictEqual(initialData)
  });
});
