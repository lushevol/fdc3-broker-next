import { fn, renderHook } from "@Test/test-utils";
import { App } from "antd";

import { submitAsyncTask, useNotificationCenter } from "./index";

describe('NotificationCenter', () => {
  it("useNotificationCenter - with submitAsyncTask success", () => {
    const wrapper = ({ children }) => <App>{ children }</App>;
    renderHook(() => useNotificationCenter(), {
      wrapper,
    });
    const mockProcessResult = ["test"];
    submitAsyncTask({
        processor: Promise.resolve(mockProcessResult),
        notify: fn(() => ({
            title: "title",
            description: "description",
            type: "success",
        })),
    })
  });
});