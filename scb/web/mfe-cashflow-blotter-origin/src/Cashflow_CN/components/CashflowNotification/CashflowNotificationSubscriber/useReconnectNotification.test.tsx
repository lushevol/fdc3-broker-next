import { renderHook } from "@testing-library/react";
import { NotificationInstance } from "antd/es/notification/interface";
import { act } from "react-dom/test-utils";

import { useReconnectNotification } from "./useReconnectNotification";

jest.mock("antd/es/notification/interface", () => ({
  NotificationInstance: jest.fn(),
}));

jest.mock("Import/ratancomponents", () => ({
  rtCreatePortal: jest.fn(),
}));

jest.mock("Import/ratanutils", () => ({
  randomString: jest.fn(() => "mockKey"),
}));

describe("useReconnectNotification", () => {
  let mockNotificationApi: NotificationInstance;
  let mockReconnect: jest.Mock;
  const mockId = "1";

  beforeEach(() => {
    mockNotificationApi = {
      error: jest.fn(),
      destroy: jest.fn(),
    } as unknown as NotificationInstance;

    mockReconnect = jest.fn();
  });

  it("should call notificationApi.error with correct parameters", () => {
    const { result } = renderHook(() =>
      useReconnectNotification(mockNotificationApi)
    );

    act(() => {
      result.current.popReconnectNotification(mockReconnect, mockId);
    });

    expect(mockNotificationApi.error).toHaveBeenCalledWith({
      key: mockId,
      message: "Notification Error",
      description: "The cashflow notification has been interrupted. Please retry when network is stable.",
      duration: 0,
      placement: "bottomRight",
      btn: expect.any(Object),
    });
  });

  it("should call reconnect and destroy notification on button click", () => {
    const { result } = renderHook(() =>
      useReconnectNotification(mockNotificationApi)
    );

    act(() => {
      result.current.popReconnectNotification(mockReconnect, mockId);
    });

    const btn = (mockNotificationApi.error as jest.Mock).mock.calls[0][0].btn;
    btn.props.onClick();

    expect(mockReconnect).toHaveBeenCalled();
    expect(mockNotificationApi.destroy).toHaveBeenCalledWith(mockId);
    expect(mockNotificationApi.error).toHaveBeenCalledWith(expect.objectContaining({
      placement: "bottomRight",
    }));
  });

  it("should handle edge case when notificationApi is undefined", () => {
    const { result } = renderHook(() => useReconnectNotification(undefined as unknown as NotificationInstance));

    expect(() => {
      act(() => {
        result.current.popReconnectNotification(mockReconnect, mockId);
      });
    }).not.toThrow();
  });

  it("should handle edge case when reconnect is not provided", () => {
    const { result } = renderHook(() =>
      useReconnectNotification(mockNotificationApi)
    );

    expect(() => {
      act(() => {
        result.current.popReconnectNotification(undefined as unknown as () => void, mockId);
      });
    }).not.toThrow();
  });
});