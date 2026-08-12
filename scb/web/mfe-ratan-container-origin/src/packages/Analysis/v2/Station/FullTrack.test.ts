import { MouseEventCapture } from "./FullTrack";

jest.mock("./index", () => {
    return {
        Station: jest.fn(),
        MonitorEventEmitter: {
            emit: jest.fn(),
            on: jest.fn(),
            off: jest.fn(),
        }
    }
});

it("MouseEventCapture - Track By TestId", () => {
  const mockEvent = {
      clientX: 0,
      clientY: 0,
      target: {
          nodeName: "button",
          innerText: "test_inner_text",
          dataset: {
            testid: "/test/test",
          },
          classList: {
            contains: jest.fn(() => true),
          },
          parentElement: {
            classList: {
              contains: jest.fn(() => true),
            },
          }
      }
  } as unknown as MouseEvent;
  MouseEventCapture(mockEvent);
});


it("MouseEventCapture - Track By KP", () => {
  const mockEvent = {
      clientX: 0,
      clientY: 0,
      target: {
          nodeName: "button",
          innerText: "test_inner_text",
          className: "kp--test_component",
          dataset: {},
          classList: {
            contains: jest.fn(() => true),
          },
          parentElement: {
            classList: {
              contains: jest.fn(() => true),
            },
          }
      }
  } as unknown as MouseEvent;
  MouseEventCapture(mockEvent);
});
