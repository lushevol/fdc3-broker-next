import { act, render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ButtonItem } from "./ButtonItem";

describe("ButtonItem component", () => {
  it("should render ButtonItem correctly", async () => {
    const updateFn = jest.fn();
    const configs = ["config"];
    const newConfigs = ["newconfig"];
    const clickCallback = Promise.resolve(newConfigs);
    const onClick = jest.fn(() => clickCallback);
    const { debug, getByTestId } = render(
      <ButtonItem
        update={updateFn}
        configs={configs}
        onClick={onClick}
        field="buttonItem"
        form={"form"}
      />
    );
    const btn = getByTestId("buttonItem");
    expect(btn).toBeDefined();
    userEvent.click(btn);
    expect(onClick).toBeCalledWith(configs, "form");
    await clickCallback;
    expect(updateFn).toBeCalledWith(newConfigs);
  });
});
