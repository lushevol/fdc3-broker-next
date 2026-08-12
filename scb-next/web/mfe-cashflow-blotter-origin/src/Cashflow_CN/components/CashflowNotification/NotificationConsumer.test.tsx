import { consumeNotification } from "./NotificationConsumer";

describe("consumeNotification", () => {
  const getCurrentTableDatas = vi.fn();
  const dataToUpdates: { id: number; name: string; }[] = [];
  const dataToDelete: { id: number; name: string; }[] = [];
  const rowKey = "id";
  const isDataUpdated = vi.fn();

  beforeEach(() => {
    getCurrentTableDatas.mockClear();
    isDataUpdated.mockClear();
  });

  test("should return isUpdate: false when there is no data to change", async () => {
    const result = await consumeNotification({
      getCurrentTableDatas,
      dataToUpdates,
      dataToDelete,
      rowKey,
      isDataUpdated,
    });

    expect(result.isUpdate).toBe(false);
  });

  test("should return the correct result when there are data updates and deletions", async () => {
    const originData1 = { id: 1, name: "John" };
    const originData2 = { id: 2, name: "Jane" };
    const targetData1 = { id: 3, name: "John Doe" };
    const targetData2 = { id: 4, name: "Alice" };

    getCurrentTableDatas.mockResolvedValue([originData1, originData2]);
    dataToUpdates.push(targetData1, targetData2);
    isDataUpdated.mockReturnValue(true);

    const result = await consumeNotification({
      getCurrentTableDatas,
      dataToUpdates,
      dataToDelete,
      rowKey,
      isDataUpdated,
    });
    expect(result.isUpdate).toBe(true);
    expect(result.addedDatas).toEqual([targetData1, targetData2]);
    expect(result.updatedDatas).toEqual([]);
    expect(result.deletedDatas).toEqual([]);
  });

  test("should return the correct result when there are data deletions", async () => {
    const originData1 = { id: 1, name: "John" };
    const originData2 = { id: 2, name: "Jane" };
    const targetData1 = { id: 3, name: "Alice" };

    getCurrentTableDatas.mockResolvedValue([originData1, originData2]);
    dataToDelete.push(targetData1);

    const result = await consumeNotification({
      getCurrentTableDatas,
      dataToUpdates,
      dataToDelete,
      rowKey,
      isDataUpdated,
    });

    expect(result.isUpdate).toBe(true);
    expect(result.addedDatas).toEqual([{ id: 3, name: 'John Doe' }, { id: 4, name: 'Alice' }]);
    expect(result.updatedDatas).toEqual([]);
  });
});