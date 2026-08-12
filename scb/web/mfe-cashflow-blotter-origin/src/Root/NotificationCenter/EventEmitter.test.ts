import { EventEmitter } from "./EventEmitter";

describe('EventEmitter', () => {
  it("on/emit", () => {
    expect.assertions(2);
    const topic = "test_topic";
    const ee = new EventEmitter<{ test_topic: string }>();
    ee.on(topic, (payload) => {
      expect(payload).toBe("test");
    });

    ee.emit(topic, "test");
    ee.emit(topic, "test");
  });
  it("disposableOn/emit", () => {
    expect.assertions(1);
    const topic = "test_topic";
    const ee = new EventEmitter<{ test_topic: string }>();
    const off = ee.disposableOn(topic, (payload) => {
      expect(payload).toBe("test");
    });

    ee.emit(topic, "test");
    off();
    ee.emit(topic, "test");
  });
});