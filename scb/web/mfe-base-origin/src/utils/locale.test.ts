import { DateTimeFormat, DateFormat } from "./locale";

describe("entities Util", () => {
  it("should be true", () => {
    const date = new Date("2023-11-08T02:04:40.925Z");
    expect(DateTimeFormat("UTC", date)).toEqual("Nov 8, 2023, 2:04:40 AM Coordinated Universal Time");
    expect(DateTimeFormat("UTC", date, "en", "short")).toEqual("11/8/23, 2:04:40 AM Coordinated Universal Time");
    expect(DateTimeFormat("UTC", date, "en", "long")).toEqual("November 8, 2023 at 2:04:40 AM Coordinated Universal Time");
    expect(DateTimeFormat("UTC", date, "en", "full")).toEqual("Wednesday, November 8, 2023 at 2:04:40 AM Coordinated Universal Time");
    expect(DateTimeFormat("UTC", date, "en", "long", "long")).toEqual("November 8, 2023 at 2:04:40 AM UTC");
    expect(DateTimeFormat("UTC", date, "en", "full", "full")).toEqual("Wednesday, November 8, 2023 at 2:04:40 AM Coordinated Universal Time");
    expect(DateTimeFormat("LOCAL", date, "en", "short", "short").includes("11/8/23")).toBeTruthy();

    expect(DateFormat("UTC", date)).toEqual("Nov 8, 2023");
    expect(DateFormat("UTC", date, "en", "short")).toEqual("11/8/23");
    expect(DateFormat("UTC", date, "en", "long")).toEqual("November 8, 2023");
    expect(DateFormat("UTC", date, "en", "full")).toEqual("Wednesday, November 8, 2023");
    expect(DateFormat("UTC", date, "en", "long")).toEqual("November 8, 2023");
    expect(DateFormat("UTC", date, "en", "full")).toEqual("Wednesday, November 8, 2023");
    expect(DateFormat("LOCAL", date, "en", "short").includes("11/8/23")).toBeTruthy();
    
  });
});