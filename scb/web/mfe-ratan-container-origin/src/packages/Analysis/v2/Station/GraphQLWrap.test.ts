import { getWrappedGraphQLQuery } from "./GraphQLWrap";

jest.mock("../../../../ratanutils/http/graphql", () => {
    return {
        queryGraphql: () => Promise.resolve({ data: {} }),
    }
});

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

it("wrappedGraphQLQuery", async () => {
    const wrappedGraphQLQuery = getWrappedGraphQLQuery("/test_container/test_tile");
    const res = await wrappedGraphQLQuery("test_url", "test_query");
    expect(res.data).toStrictEqual({});
});
