import { Service } from "src/Root/import";

import { LimitationRecord } from "../Main/common/interface";
import getServices from "./index";

it('getServices', async () => {
    const {
        getLimitationList,
        createLimitation,
        updateLimitation,
        approveActionLimitation,
        rejectActionLimitation,
        deleteLimitation,
    } = getServices();

    const res = await getLimitationList({
        profiles: [],
        currencies: []
    });
    expect(res).toStrictEqual({});

    const res2 = await createLimitation({
        limitationId: "",
        status: "ADD_PENDING",
        version: 0,
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
        deleted: false,
        profile: "",
        currency: "USD",
        limitation: 0
    });
    expect(res2).toStrictEqual({});

    const res3 = await updateLimitation({
        limitationId: "",
        status: "ADD_PENDING",
        version: 0,
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
        deleted: false,
        profile: "",
        currency: "USD",
        limitation: 0
    });
    expect(res3).toStrictEqual({});
    
    const res4 = await approveActionLimitation({
        limitationId: "",
        status: "ADD_PENDING",
        version: 0,
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
        deleted: false,
        profile: "",
        currency: "USD",
        limitation: 0
    });
    expect(res4).toStrictEqual({});

    const res5 = await rejectActionLimitation({
        limitationId: "",
        status: "ADD_PENDING",
        version: 0,
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
        deleted: false,
        profile: "",
        currency: "USD",
        limitation: 0
    });
    expect(res5).toStrictEqual({});

    const res6 = await deleteLimitation({
        limitationId: "",
        status: "ADD_PENDING",
        version: 0,
        createdAt: "",
        createdBy: "",
        updatedAt: "",
        updatedBy: "",
        deleted: false,
        profile: "",
        currency: "USD",
        limitation: 0
    });
    expect(res6).toStrictEqual({});
});

it('getLimitationList - success', async () => {
  const mockResponse = [{ profile: "test", currency: "USD", limitation: 100 }];
  jest.spyOn(Service.service, 'get').mockResolvedValueOnce(mockResponse);

  const { getLimitationList } = getServices();
  const res = await getLimitationList({ profiles: ["test"], currencies: ["USD"] });

  expect(res).toStrictEqual(mockResponse);
  expect(Service.service.get).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/profiles/test/currencies/USD"
  );
});

it('getLimitationList - failure', async () => {
  jest.spyOn(Service.service, 'get').mockRejectedValueOnce(new Error("Network Error"));

  const { getLimitationList } = getServices();
  const res = await getLimitationList({ profiles: ["test"], currencies: ["USD"] });

  expect(res).toStrictEqual([]);
  expect(Service.service.get).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/profiles/test/currencies/USD"
  );
});

it('createLimitation - success', async () => {
  const mockPayload = { profile: "test", currency: "USD", limitation: 100 } as LimitationRecord;
  const mockResponse = { ...mockPayload, status: "CREATED" };
  jest.spyOn(Service.service, 'post').mockResolvedValueOnce(mockResponse);

  const { createLimitation } = getServices();
  const res = await createLimitation(mockPayload);

  expect(res).toStrictEqual(mockResponse);
  expect(Service.service.post).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/create",
    mockPayload
  );
});

it('createLimitation - failure', async () => {
  const mockPayload = { profile: "test", currency: "USD", limitation: 100 } as LimitationRecord;
  jest.spyOn(Service.service, 'post').mockRejectedValueOnce(new Error("Network Error"));

  const { createLimitation } = getServices();
  const res = await createLimitation(mockPayload);

  expect(res).toBeUndefined();
  expect(Service.service.post).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/create",
    mockPayload
  );
});

it('updateLimitation - success', async () => {
  const mockPayload = { profile: "test", currency: "USD", limitation: 200 } as LimitationRecord;
  const mockResponse = { ...mockPayload, status: "UPDATED" };
  jest.spyOn(Service.service, 'put').mockResolvedValueOnce(mockResponse);

  const { updateLimitation } = getServices();
  const res = await updateLimitation(mockPayload);

  expect(res).toStrictEqual(mockResponse);
  expect(Service.service.put).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/edit",
    mockPayload
  );
});

it('updateLimitation - failure', async () => {
  const mockPayload = { profile: "test", currency: "USD", limitation: 200 } as LimitationRecord;
  jest.spyOn(Service.service, 'put').mockRejectedValueOnce(new Error("Network Error"));

  const { updateLimitation } = getServices();
  const res = await updateLimitation(mockPayload);

  expect(res).toBeUndefined();
  expect(Service.service.put).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/edit",
    mockPayload
  );
});

it('approveActionLimitation - success', async () => {
  const mockPayload = { profile: "test", currency: "USD", status: "APPROVED" } as unknown as LimitationRecord;
  const mockResponse = { ...mockPayload, status: "CONFIRMED" };
  jest.spyOn(Service.service, 'put').mockResolvedValueOnce(mockResponse);

  const { approveActionLimitation } = getServices();
  const res = await approveActionLimitation(mockPayload);

  expect(res).toStrictEqual(mockResponse);
  expect(Service.service.put).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/confirm/test/USD/APPROVED",
    mockPayload
  );
});

it('approveActionLimitation - failure', async () => {
  const mockPayload = { profile: "test", currency: "USD", status: "APPROVED" } as unknown as LimitationRecord;
  jest.spyOn(Service.service, 'put').mockRejectedValueOnce(new Error("Network Error"));

  const { approveActionLimitation } = getServices();
  const res = await approveActionLimitation(mockPayload);

  expect(res).toBeUndefined();
  expect(Service.service.put).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/confirm/test/USD/APPROVED",
    mockPayload
  );
});

it('rejectActionLimitation - success', async () => {
  const mockPayload = { profile: "test", currency: "USD", status: "REJECTED" } as unknown as LimitationRecord;
  const mockResponse = { ...mockPayload, status: "DECLINED" };
  jest.spyOn(Service.service, 'put').mockResolvedValueOnce(mockResponse);

  const { rejectActionLimitation } = getServices();
  const res = await rejectActionLimitation(mockPayload);

  expect(res).toStrictEqual(mockResponse);
  expect(Service.service.put).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/reject/test/USD/REJECTED",
    mockPayload
  );
});

it('rejectActionLimitation - failure', async () => {
  const mockPayload = { profile: "test", currency: "USD", status: "REJECTED" } as unknown as LimitationRecord;
  jest.spyOn(Service.service, 'put').mockRejectedValueOnce(new Error("Network Error"));

  const { rejectActionLimitation } = getServices();
  const res = await rejectActionLimitation(mockPayload);

  expect(res).toBeUndefined();
  expect(Service.service.put).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/reject/test/USD/REJECTED",
    mockPayload
  );
});

it('deleteLimitation - success', async () => {
  const mockPayload = { profile: "test", currency: "USD" } as LimitationRecord;
  const mockResponse = { status: "DELETED" };
  jest.spyOn(Service.service, 'delete').mockResolvedValueOnce(mockResponse);

  const { deleteLimitation } = getServices();
  const res = await deleteLimitation(mockPayload);

  expect(res).toStrictEqual(mockResponse);
  expect(Service.service.delete).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/test/USD"
  );
});

it('deleteLimitation - failure', async () => {
  const mockPayload = { profile: "test", currency: "USD" } as LimitationRecord;
  jest.spyOn(Service.service, 'delete').mockRejectedValueOnce(new Error("Network Error"));

  const { deleteLimitation } = getServices();
  const res = await deleteLimitation(mockPayload);

  expect(res).toBeUndefined();
  expect(Service.service.delete).toHaveBeenCalledWith(
    "/api/ratan/v1/profileLimitation/test/USD"
  );
});