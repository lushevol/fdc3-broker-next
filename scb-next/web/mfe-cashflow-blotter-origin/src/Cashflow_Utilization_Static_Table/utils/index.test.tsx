import { actionConfirmation } from "./index";

describe("actionConfirmation", () => {
  let mockModal: any;

  beforeEach(() => {
    mockModal = {
      confirm: vi.fn(),
    };
  });

  it("should call modal.confirm with correct parameters", async () => {
    const action = "delete";
    mockModal.confirm.mockResolvedValueOnce(true);

    const result = await actionConfirmation(mockModal, action);

    expect(mockModal.confirm).toHaveBeenCalledWith({
      title: "Warning",
      content: `Are you sure to ${action} this rule ?`,
      okText: "Confirm",
      cancelText: "Dismiss",
      getContainer: false,
      centered: true,
      width: 450,
    });
    expect(result).toBe(true);
  });

  it("should return false if modal.confirm is dismissed", async () => {
    const action = "update";
    mockModal.confirm.mockResolvedValueOnce(false);

    const result = await actionConfirmation(mockModal, action);

    expect(mockModal.confirm).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
