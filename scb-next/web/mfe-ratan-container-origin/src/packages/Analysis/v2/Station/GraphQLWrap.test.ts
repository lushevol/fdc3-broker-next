import { getWrappedGraphQLQuery } from "./GraphQLWrap";

vi.mock("../../../../ratanutils/http/graphql", () => {
    return {
        queryGraphql: () => Promise.resolve({ data: {} }),
    }
});

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

it("wrappedGraphQLQuery", async () => {
    const wrappedGraphQLQuery = getWrappedGraphQLQuery("/test_container/test_tile");
    const res = await wrappedGraphQLQuery("test_url", "test_query");
    expect(res.data).toStrictEqual({});
});
