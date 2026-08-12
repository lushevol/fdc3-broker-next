import { render, screen } from "@testing-library/react";
import FilterList from "./FilterList";
afterAll(() => {
  jest.clearAllMocks();
});

describe("FilterList component", () => {
  it("should be in the document", async () => {
    const props = {
      classifiedFilterList: [
        {
          key: "private",
          title: "Private",
          options: [
            {
              rowKey: "9409b324-0c98-4cf6-8c2b-cd158a2a283a",
              name: "Lu Shuai's Filter 2",
              body: '',
              owner: "1639796",
              type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
              isPublic: false,
              creator: "1639796",
              assignee: "",
              assigneeList: "",
              moduleOwner: "",
              updateFlag: "",
            },
            {
              rowKey: "07dfebfc-ca31-4fd9-9b32-ec63c8ff7a02",
              name: "Lu Shuai's Filter 1",
              body: '',
              owner: "1639796",
              type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
              isPublic: false,
              creator: "1639796",
              assignee: "",
              assigneeList: "",
              moduleOwner: "",
              updateFlag: "",
            },
            {
              rowKey: "a52e2dc3-d280-469d-8a75-910bcfecbb42",
              name: "test",
              body: '',
              owner: "1639796",
              type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
              isPublic: false,
              creator: "1639796",
              assignee: "",
              assigneeList: "",
              moduleOwner: "",
              updateFlag: "",
            },
          ],
        },
        {
          key: "public",
          title: "Public",
          options: [
            {
              rowKey: "40776f3f-970c-46e2-b82d-05c01c3bf17c",
              name: "Public Filter 1",
              body: '',
              owner: "1639796",
              type: "STRATEGIC_CASHFLOW_FILTER_BUILDER",
              isPublic: true,
              creator: "1639796",
              assignee: "",
              assigneeList: "",
              moduleOwner: "",
              updateFlag: "",
            },
          ],
        },
      ],
      displayFilter: {
        rowKey: "DEFAULT_CREATING_FILTER",
        name: "",
        body: "",
        owner: "1639796",
        creator: "1639796",
        type: "",
        isPublic: false,
        moduleOwner: "",
        assignee: "",
        assigneeList: "",
        updateFlag: "",
      },
      appliedFilter: null,
      onClickFilter: jest.fn(),
      onClickCreateNewFilter: jest.fn(),
    };

    render(<FilterList {...props} />);
    expect(screen).toBeDefined();
    const dom = await screen.findByText('Private');
    expect(dom).toBeInTheDocument();
  });
});
