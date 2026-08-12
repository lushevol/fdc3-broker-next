import { fn } from "@Test/test-utils";
import { mockNotificationInstance } from "src/test/mockUtils/antd-notification";

import { notificationGenerator } from "./utils";

it("notificationGenerator", () => {
    const res = notificationGenerator(fn(() => ({
        title: "title",
        description: "description",
        type: "success",
    })), { data: "test", isSuccess: true, }, mockNotificationInstance());
    expect(res).toBeUndefined();
});