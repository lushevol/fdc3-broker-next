import { render, screen, act } from "@testing-library/react";
import { reducers } from ".";
import { initialData } from "../model/root";
import { ActionType } from "./util/ActionType";
jest.mock("../../utils/common", () => {
  return {
    getLocalStorage: () => ({
      setItem: (v) => { },
      getItem: () => undefined,
      clear: () => { }
    }),
    getSessionStorage: () => ({
      setItem: (v) => { },
      getItem: () => undefined,
      clear: () => { }
    }),
    uuidv4: () => "id",
    getEnv: () => "LOCAL",
  }
});
describe("SET_DATA Reducer", () => {
  it("CLEAR should be equal to", async () => {
    const result = reducers(initialData, { type: ActionType.CLEAR, data: {} })
    result.expiredIn = 0
    result.iat = 0
    expect(result).toStrictEqual(initialData)
  });
  it("initialData should be equal to", async () => {
    //@ts-ignore
    const result = reducers(initialData, { type: "", data: {} })
    expect(result).toStrictEqual(initialData)
  });
  it("SET_EXPIRED_TOKEN should be equal to", async () => {
    const result = reducers({ ...initialData, userLoginTime: new Date() }, { type: ActionType.SET_EXPIRED_TOKEN, data: { expiredIn: 0, iat: 0 } })
    expect(result.expiredIn).toStrictEqual(0)
    expect(result.iat).toStrictEqual(0)
  });
  it("SET_EXPIRED_TOKEN should be equal to", async () => {
    const date = new Date()
    const result = reducers(initialData, { type: ActionType.SET_EXPIRED_TOKEN, data: { expiredIn: 0, iat: 0, userLoginTime: date } })
    expect(result.expiredIn).toStrictEqual(0)
    expect(result.iat).toStrictEqual(0)
  });
});
