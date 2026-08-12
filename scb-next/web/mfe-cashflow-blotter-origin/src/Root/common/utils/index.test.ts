import { generateUUID, getEnv, getHostName, round } from "./index";

describe('utils', () => {
    it("generateUUID", () => {
        const res = generateUUID();
        expect(res).toBe("test");
    });
    it("round", () => {
        const res = round(123.125, 2);
        expect(res).toBe(123.13);
    });
});

describe('location related functions', () => {
    const { location } = window;

    afterEach(() => {
        window.location = location;
    });

    it("getHostName", () => {
        delete (window as any).location;
        window.location = { hostname: "test" } as unknown as Location;
        const hostname = getHostName();
        expect(hostname).toBe("test");
    });
    it("getEnv", () => {
        delete (window as any).location;
        window.location = { hostname: "localhost" } as unknown as Location;
        expect(getEnv()).toBe("LOCAL");
        window.location = { hostname: "fmo-mfe-dev.uk.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("DEV");
        window.location = { hostname: "fmo-mfe.uk.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("UAT");
        window.location = { hostname: "uklvadapp1344.uk.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("UAT");
        window.location = { hostname: "uklvadapp1346.uk.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("UAT");
        window.location = { hostname: "fmo-mfe-fmrp1.pi.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("UAT");
        window.location = { hostname: "fmo-mfe-fmrp2.pi.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("UAT");
        window.location = { hostname: "uklvadapp1342.uk.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("UAT2");
        window.location = { hostname: "fmo-mfe-preprod.pi.dev.net" } as unknown as Location;
        expect(getEnv()).toBe("PRE-PROD");
        window.location = { hostname: "ratan-aws-app-fmo-mfe.ir.standardchartered.com" } as unknown as Location;
        expect(getEnv()).toBe("EKS");
        window.location = { hostname: "ratan-aws-sit-ns4-fmo-mfe.ir.standardchartered.com" } as unknown as Location;
        expect(getEnv()).toBe("SIT");
        window.location = { hostname: "fmo-mfe.gdc.standardchartered.com" } as unknown as Location;
        expect(getEnv()).toBe("PROD");
    });
})