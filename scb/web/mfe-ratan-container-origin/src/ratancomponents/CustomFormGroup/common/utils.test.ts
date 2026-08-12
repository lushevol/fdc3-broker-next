import {
  collectFieldsFromGroupConfig,
  findGroupConfigItemByField,
} from "./utils";
import { CustomFormGroupConfigProps } from "../interface";

const buildConfig = (): CustomFormGroupConfigProps[] => [
  {
    title: "Group A",
    row: [
      {
        itemConfig: [{ field: "fieldA" } as any, { field: "fieldB" } as any],
      },
      {
        childGroup: [
          {
            title: "Child A",
            row: [
              {
                itemConfig: [{ field: "fieldC" } as any],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    title: "Group B",
    row: [
      {
        itemConfig: [{ field: "fieldD" } as any, {} as any],
      },
    ],
  },
];

describe("collectFieldsFromGroupConfig", () => {
  it("collects fields across rows and child groups", () => {
    const config = buildConfig();

    const result = collectFieldsFromGroupConfig(config);

    expect(result).toEqual(["fieldA", "fieldB", "fieldC", "fieldD"]);
  });

  it("returns empty array when no itemConfig", () => {
    const config: CustomFormGroupConfigProps[] = [
      {
        title: "Empty Group",
        row: [{}, { childGroup: [{ row: [{}] }] }],
      } as any,
    ];

    const result = collectFieldsFromGroupConfig(config);

    expect(result).toEqual([]);
  });
});

describe("findGroupConfigItemByField", () => {
  it("finds item in top-level rows", () => {
    const config = buildConfig();

    const result = findGroupConfigItemByField(config, "fieldB");

    expect(result?.field).toBe("fieldB");
  });

  it("finds item in child group rows", () => {
    const config = buildConfig();

    const result = findGroupConfigItemByField(config, "fieldC");

    expect(result?.field).toBe("fieldC");
  });

  it("returns undefined when field not found", () => {
    const config = buildConfig();

    const result = findGroupConfigItemByField(config, "missingField");

    expect(result).toBeUndefined();
  });
});
