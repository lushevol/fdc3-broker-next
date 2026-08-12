import { fn } from "src/test/test-utils";

import { getSocketClientConnectStatus, getUid, socketClientFactory, socketClientStore, subscribeSocketNotification, updateSocketClientReconnetctTime } from "./stomp";

afterAll(() => {
  jest.clearAllMocks();
});

describe("stomp", () => {
  it("updateSocketClientReconnetctTime & getSocketClientConnectStatus", () => {
    const url = "test_url";
    const id = "test_id";
    const uid = getUid(url, id);
    const mockClient = socketClientFactory(url, id);
    socketClientStore.set(uid, mockClient);
    updateSocketClientReconnetctTime(uid, 1000);
    const status = getSocketClientConnectStatus(uid);
    expect(status.reConnetctTime).toBe(1000);
  });
  it("subscribeSocketNotification", () => {
    const url = "test_url";
    const id = "test_id";
    const uid = getUid(url, id);
    const mockTopicCallback = jest.fn();
    const mockConnectedCallback = jest.fn();
    const mockErrorCallback = jest.fn();

    const mockStompInstance = {
      connect: fn((header, onConnected, onError) => {
        onConnected();
        onError();
      }),
      disconnect: fn(),
      subscribe: fn((dest, callback) => {
        const mockMessage = { body: "{}", ack: fn() };
        callback(mockMessage);
      }),
    }
    const mockClient = {
      client: mockStompInstance,
      status: {
        reConnetctTime: 0,
        updateTime: Date.now(),
      },
      subscriptions: new Map(),
      destoryClient: () => {
        try {
          mockStompInstance.disconnect(() => {
            socketClientStore.delete(uid);
          });
        } catch (error) {
          socketClientStore.delete(uid);
        }
      },
    };
    socketClientStore.set(uid, mockClient);

    subscribeSocketNotification({
      url,
      id,
      topic: {
        destination: "test_dest",
        callback: mockTopicCallback,
      },
      onConnected: mockConnectedCallback,
      onError: mockErrorCallback,
    });
    expect(mockConnectedCallback).toHaveBeenCalled();
    expect(mockTopicCallback).toHaveBeenCalled();
    // reconnectTime is 0
    expect(mockErrorCallback).not.toHaveBeenCalled();

    jest.useFakeTimers();
    jest.advanceTimersByTime(5000);
    jest.useRealTimers();
  });
  it("should not update the reconnect time if the socket client does not exist", () => {
    const url = "non_existent_url";
    const reConnetctTime = 1000;
    updateSocketClientReconnetctTime(url, reConnetctTime);
    expect(socketClientStore.get(url)).toBeUndefined();
  });
  it("should handle connection no topic", () => {
    const url = "test_url";
    const id = "test_id";
    const uid = getUid(url, id);
    const mockTopicCallback = jest.fn();
    const mockConnectedCallback = jest.fn();
    const mockErrorCallback = jest.fn();

    const mockStompInstance = {
      connect: fn((header, onConnected, onError) => {
        onConnected();
        onError();
      }),
      disconnect: fn(),
      subscribe: fn((dest, callback) => {
        const mockMessage = { body: "{}", ack: fn() };
        callback(mockMessage);
      }),
    }
    const mockClient = {
      client: mockStompInstance,
      status: {
        reConnetctTime: 10,
        updateTime: Date.now(),
      },
      subscriptions: new Map(),
      destoryClient: () => {
        try {
          mockStompInstance.disconnect(() => {
            socketClientStore.delete(uid);
          });
        } catch (error) {
          socketClientStore.delete(uid);
        }
      },
    };
    socketClientStore.set(uid, mockClient);

    subscribeSocketNotification({
      url,
      id,
      onConnected: mockConnectedCallback,
      onError: mockErrorCallback,
    });
    expect(mockConnectedCallback).toHaveBeenCalled();
    expect(mockTopicCallback).not.toHaveBeenCalled();
    expect(mockErrorCallback).toHaveBeenCalled();

    jest.useFakeTimers();
    jest.advanceTimersByTime(5000);
    jest.useRealTimers();
  });
});
