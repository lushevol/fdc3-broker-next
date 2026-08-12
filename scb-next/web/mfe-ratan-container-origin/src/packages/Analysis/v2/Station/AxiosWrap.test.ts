import { getWrappedAxiosService } from "./AxiosWrap";

vi.mock("../import", () => {
    return {
        Service: {
            service: {
                get: () => Promise.resolve({ data: {}, status: 200 }),
            }
        }
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

it("getWrappedAxiosService", async () => {
    const wrappedAxiosService = getWrappedAxiosService("/test_container/test_tile");
    const res = await wrappedAxiosService.get("test_url");
    expect(res.status).toBe(200);
});
