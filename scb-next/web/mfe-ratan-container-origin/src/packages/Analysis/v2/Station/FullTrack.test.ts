import { MouseEventCapture } from "./FullTrack";

vi.mock("./index", () => {
    return {
        Station: vi.fn(),
        MonitorEventEmitter: {
            emit: vi.fn(),
            on: vi.fn(),
            off: vi.fn(),
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
            contains: vi.fn(() => true),
          },
          parentElement: {
            classList: {
              contains: vi.fn(() => true),
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
            contains: vi.fn(() => true),
          },
          parentElement: {
            classList: {
              contains: vi.fn(() => true),
            },
          }
      }
  } as unknown as MouseEvent;
  MouseEventCapture(mockEvent);
});
