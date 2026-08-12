import { historyFields_CN } from "./historyGridConfig";

afterAll(() => {
  jest.clearAllMocks();
});

beforeAll(() => {
  Object.defineProperty(window, "ratanConfig", {
    value: {
      exception: {
        exceptionType: ["Missing Vostro", "Multi Vostro"],
      },
    },
    writable: true,
  });
});

test("Comments", async () => {
  let comments;
  historyFields_CN.forEach((item) => {
    if (item.headerName == "Comments") {
      //@ts-ignore
      comments = item.valueGetter({
        data: {
          FMO_Comments: [["FMO_Comment", "test"]],
        },
      });
    }
  });
  expect(comments).toBeDefined();
});

test("Exception Type", async () => {
  let exceptionType;
  historyFields_CN.forEach((item) => {
    if (item.headerName == "Exception Type") {
      //@ts-ignore
      exceptionType = item.valueGetter({
        data: {
          Exception_Type: "Missing Vostro",
        },
      });
    }
  });
  expect(exceptionType).toBeDefined();
});
