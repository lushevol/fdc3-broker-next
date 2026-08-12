import { MonitorEvent } from "../Event";
import { StationStorage } from "../Storage";

export const saveMonitorEvents = (events: MonitorEvent[]) => {
  return StationStorage.setMonitorData(events);
};

export const readMonitorEvents = () => {
  return StationStorage.getMonitorData() as MonitorEvent[];
};

export const checkIfIdle = (e: Event): boolean => {
  switch (e.type) {
    case "blur":
      return true;
    case "focus":
      return false;

    case "visibilitychange":
      return document.visibilityState === "hidden";
  }

  return false;
};

// "Abc Def" to "abc_def"
export const plattenStr = (str: string) => {
  try {
    return String.prototype.toLowerCase.call(str + "").replace(/\W/g, "_");
  } catch (error) {
    return str + "";
  }
};
