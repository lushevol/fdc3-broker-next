import { render, screen, act } from "@testing-library/react";
import { getHooksBase } from "./HooksBase";
import { initialData } from "./model/root";
import { ActionType } from "./reducer/util/ActionType";
import { emptyFunction } from "./provider";


describe("Tile1 Reducer", () => {
  it("should be equal to {}", async () => {
    emptyFunction();
    const hooks = getHooksBase()
    hooks.baseDispatch({
      type: ActionType.CLEAR, data: {}
    });
    expect(hooks.store).toStrictEqual(initialData)
  });
});
