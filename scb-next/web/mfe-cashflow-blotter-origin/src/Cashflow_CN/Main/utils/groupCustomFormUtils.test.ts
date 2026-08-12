import { findGroupConfigItemByField, findInGroups,findInRowsByField, updateFieldInGroupConfig } from "./groupCustomFormUtils";

describe("updateFieldInGroupConfig", () => {
	it("updates group titles by prefix and nested popDubai item", () => {
		const config: CustomFormGroupConfigProps[] = [
			{
				title: "50a: Ordering Customer",
				row: [
					{
						itemConfig: [
							{
								field: "orderCustomerBic",
								label: "BIC",
							},
						],
					},
				],
			},
			{
				title: "58a: Beneficiary Customer",
				row: [
					{
						itemConfig: [
							{
								field: "beneficiaryBic",
								label: "BIC",
							},
						],
					},
				],
			},
			{
				title: "Other Group",
				row: [
					{
						childGroup: [
							{
								title: "Hybrid Address",
								row: [
									{
										itemConfig: [
											{
												field: "popDubai",
												label: "77: Purpose of Payment",
												hidden: false,
											},
										],
									},
								],
							},
						],
					},
				],
			},
		];

		const groupTitleUpdaterMap = {
			"50a:": (group: CustomFormGroupConfigProps, value: string) => {
				group.title =
					value === "MT202"
						? "52a: Ordering Institution"
						: "50a: Ordering Customer";
			},
			"58a:": (group: CustomFormGroupConfigProps, value: string) => {
				group.title =
					value === "MT202"
						? "58a: Beneficiary Customer"
						: "59a: Beneficiary Customer";
			},
		};

		const itemUpdaterMap = {
			popDubai: (item: CustomFormConfigProps, value: string) => {
				item.hidden = value !== "SHOW";
			},
		};

		updateFieldInGroupConfig({
			config,
			value: "MT202",
			groupTitleUpdaterMap,
			itemUpdaterMap,
		});

		expect(config[0].title).toBe("52a: Ordering Institution");
		expect(config[1].title).toBe("58a: Beneficiary Customer");

		const popDubaiItem =
			config[2].row[0].childGroup?.[0].row[0].itemConfig?.[0];
		expect(popDubaiItem?.hidden).toBe(true);
	});
});

describe("findGroupConfigItemByField", () => {
  it("returns item from nested childGroup", () => {
    const config: CustomFormGroupConfigProps[] = [
      {
        row: [
          {
            itemConfig: [
              {
                field: "first",
                label: "First",
              },
            ],
          },
          {
            childGroup: [
              {
                title: "Nested",
                row: [
                  {
                    itemConfig: [
                      {
                        field: "target",
                        label: "Target",
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    const found = findGroupConfigItemByField(config, "target");
    expect(found?.label).toBe("Target");
  });

  it("returns undefined when field is missing", () => {
    const config: CustomFormGroupConfigProps[] = [
      {
        row: [
          {
            itemConfig: [
              {
                field: "first",
                label: "First",
              },
            ],
          },
        ],
      },
    ];

    const found = findGroupConfigItemByField(config, "missing");
    expect(found).toBeUndefined();
  });
});

describe("findInRowsByField", () => {
	it("returns item from current row before checking child groups", () => {
		const rows: RowConfigProps[] = [
			{
				itemConfig: [
					{
						field: "target",
						label: "Target In Row",
					},
				],
				childGroup: [
					{
						title: "Nested",
						row: [
							{
								itemConfig: [
									{
										field: "target",
										label: "Target In Child",
									},
								],
							},
						],
					},
				],
			},
		];

		const found = findInRowsByField(rows, "target");
		expect(found?.label).toBe("Target In Row");
	});

	it("returns item from nested child group when not found in row itemConfig", () => {
		const rows: RowConfigProps[] = [
			{
				childGroup: [
					{
						title: "Nested",
						row: [
							{
								itemConfig: [
									{
										field: "target",
										label: "Target In Child",
									},
								],
							},
						],
					},
				],
			},
		];

		const found = findInRowsByField(rows, "target");
		expect(found?.label).toBe("Target In Child");
	});

	it("returns undefined when field is missing", () => {
		const rows: RowConfigProps[] = [
			{
				itemConfig: [
					{
						field: "first",
						label: "First",
					},
				],
			},
		];

		const found = findInRowsByField(rows, "missing");
		expect(found).toBeUndefined();
	});
});

describe("findInGroups", () => {
	it("returns item from later group when earlier groups do not match", () => {
		const groups: CustomFormGroupConfigProps[] = [
			{
				title: "Group A",
				row: [
					{
						itemConfig: [
							{
								field: "first",
								label: "First",
							},
						],
					},
				],
			},
			{
				title: "Group B",
				row: [
					{
						itemConfig: [
							{
								field: "target",
								label: "Target In Group B",
							},
						],
					},
				],
			},
		];

		const found = findInGroups(groups, "target");
		expect(found?.label).toBe("Target In Group B");
	});

	it("returns item from nested child group inside group rows", () => {
		const groups: CustomFormGroupConfigProps[] = [
			{
				title: "Group A",
				row: [
					{
						childGroup: [
							{
								title: "Nested",
								row: [
									{
										itemConfig: [
											{
												field: "target",
												label: "Target Nested",
											},
										],
									},
								],
							},
						],
					},
				],
			},
		];

		const found = findInGroups(groups, "target");
		expect(found?.label).toBe("Target Nested");
	});

	it("returns undefined when field is missing in all groups", () => {
		const groups: CustomFormGroupConfigProps[] = [
			{
				title: "Group A",
				row: [
					{
						itemConfig: [
							{
								field: "first",
								label: "First",
							},
						],
					},
				],
			},
		];

		const found = findInGroups(groups, "missing");
		expect(found).toBeUndefined();
	});
});
