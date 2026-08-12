import { getWrappedAxiosService } from "./AxiosWrap";

jest.mock("../import", () => {
    return {
        Service: {
            service: {
                get: () => Promise.resolve({ data: {}, status: 200 }),
            }
        }
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

it("getWrappedAxiosService", async () => {
    const wrappedAxiosService = getWrappedAxiosService("/test_container/test_tile");
    const res = await wrappedAxiosService.get("test_url");
    expect(res.status).toBe(200);
});
