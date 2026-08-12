import { act, render, waitFor } from "@testing-library/react";
import { message, Upload } from "antd";
import { CASHFLOW_BLOTTER_UPLOAD_BTN } from "src/Root/analysis/const";

import { uploadConfirmationFile } from "../../services";
import UploadFile from "./UploadFile";

let latestUploadProps: any;

vi.mock("@ant-design/icons", () => ({
  UploadOutlined: () => <span data-testid="upload-outlined" />,
}));

vi.mock("Import/index", () => ({
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
}));

vi.mock("antd", () => {
  const UploadComponent = ({ children, ...props }) => {
    latestUploadProps = props;
    return <div data-testid="mock-upload">{children}</div>;
  };

  UploadComponent.LIST_IGNORE = "LIST_IGNORE";

  return {
    Upload: UploadComponent,
    message: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

vi.mock("../../services", () => ({
  uploadConfirmationFile: vi.fn(),
}));

describe("UploadFile", () => {
  beforeEach(() => {
    latestUploadProps = undefined;
    vi.clearAllMocks();
  });

  it("should render upload button", () => {
    const { getByTestId } = render(<UploadFile />);
    const uploadButton = getByTestId(CASHFLOW_BLOTTER_UPLOAD_BTN);

    expect(uploadButton.textContent).toBe("KR COMP");
    expect(latestUploadProps.accept).toBe(".csv");
    expect(latestUploadProps.multiple).toBe(false);
    expect(latestUploadProps.maxCount).toBe(1);
  });

  it("should reject non csv files before upload", () => {
    render(<UploadFile />);

    const result = latestUploadProps.beforeUpload({
      name: "cashflow.txt",
      type: "text/plain",
    });

    expect(result).toBe(Upload.LIST_IGNORE);
    expect(message.error).toHaveBeenCalledWith("Only Support upload CSV file");
  });

  it("should reject csv file when size exceeds limit", () => {
    render(<UploadFile />);

    const result = latestUploadProps.beforeUpload({
      name: "cashflow.csv",
      type: "text/csv",
      size: 20 * 1024 * 1024 + 1,
    });

    expect(result).toBe(Upload.LIST_IGNORE);
    expect(message.error).toHaveBeenCalledWith("File size cannot exceed 20M");
  });

  it("should accept csv by extension or supported mime type", () => {
    render(<UploadFile />);

    const byExtension = latestUploadProps.beforeUpload({
      name: "cashflow.CSV",
      type: "",
      size: 10,
    });
    const byMimeType = latestUploadProps.beforeUpload({
      name: "cashflow.txt",
      type: "application/vnd.ms-excel",
      size: 10,
    });

    expect(byExtension).toBe(true);
    expect(byMimeType).toBe(true);
    expect(message.error).not.toHaveBeenCalled();
  });

  it("should upload csv file successfully", async () => {
    const response = { status: 200 } as any;
    let resolveUpload: (value: any) => void = () => {};
    vi.mocked(uploadConfirmationFile).mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveUpload = resolve;
        }) as any
    );
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const file = new File(["cashflow"], "cashflow.csv", {
      type: "text/csv",
    });
    const { getByTestId } = render(<UploadFile />);
    let request: Promise<void>;

    await act(async () => {
      request = latestUploadProps.customRequest({
        file,
        onSuccess,
        onError,
      });
    });

    await waitFor(() => {
      const uploadButton = getByTestId(
        CASHFLOW_BLOTTER_UPLOAD_BTN
      ) as HTMLButtonElement;
      expect(uploadButton.disabled).toBe(true);
      expect(uploadButton.textContent).toBe("Uploading...");
    });

    await act(async () => {
      resolveUpload(response);
      await request;
    });

    expect(uploadConfirmationFile).toHaveBeenCalledWith(file);
    expect(message.success).toHaveBeenCalledWith(
      "cashflow.csv uploaded successfully"
    );
    expect(onSuccess).toHaveBeenCalledWith(response, expect.any(XMLHttpRequest));
    expect(onError).not.toHaveBeenCalled();

    await waitFor(() => {
      const uploadButton = getByTestId(
        CASHFLOW_BLOTTER_UPLOAD_BTN
      ) as HTMLButtonElement;
      expect(uploadButton.disabled).toBe(false);
      expect(uploadButton.textContent).toBe("KR COMP");
    });
  });

  it("should show backend upload error message when upload fails", async () => {
    const error = {
      response: {
        data: {
          status: 400,
          errorCode: "CF001",
          errorMessage: "Upload failed",
        },
      },
    };
    vi.mocked(uploadConfirmationFile).mockRejectedValue(error);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const file = new File(["cashflow"], "cashflow.csv", {
      type: "text/csv",
    });
    const { getByTestId } = render(<UploadFile />);

    await act(async () => {
      await latestUploadProps.customRequest({
        file,
        onSuccess,
        onError,
      });
    });

    expect(uploadConfirmationFile).toHaveBeenCalledWith(file);
    expect(message.error).toHaveBeenCalledWith("CF001: Upload failed");
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0]).toMatchObject({
      message: "CF001: Upload failed",
    });
    expect(onSuccess).not.toHaveBeenCalled();

    await waitFor(() => {
      const uploadButton = getByTestId(
        CASHFLOW_BLOTTER_UPLOAD_BTN
      ) as HTMLButtonElement;
      expect(uploadButton.disabled).toBe(false);
      expect(uploadButton.textContent).toBe("KR COMP");
    });
  });

  it("should show status message when backend returns status without errorCode", async () => {
    const error = {
      response: {
        data: {
          status: 500,
          errorMessage: "Server busy",
        },
      },
    };
    vi.mocked(uploadConfirmationFile).mockRejectedValue(error);
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const file = new File(["cashflow"], "cashflow.csv", {
      type: "text/csv",
    });

    render(<UploadFile />);

    await act(async () => {
      await latestUploadProps.customRequest({
        file,
        onSuccess,
        onError,
      });
    });

    expect(message.error).toHaveBeenCalledWith("Server busy");
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0]).toMatchObject({
      message: "Server busy",
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("should handle invalid file object in customRequest", async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    render(<UploadFile />);

    await act(async () => {
      await latestUploadProps.customRequest({
        file: { name: "fake.csv" },
        onSuccess,
        onError,
      });
    });

    expect(uploadConfirmationFile).not.toHaveBeenCalled();
    expect(message.error).toHaveBeenCalledWith(
      "Selected upload is not a valid file"
    );
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0]).toMatchObject({
      message: "Selected upload is not a valid file",
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("should fallback to generic message for non-object error", async () => {
    vi.mocked(uploadConfirmationFile).mockRejectedValue("boom");
    const onSuccess = vi.fn();
    const onError = vi.fn();
    const file = new File(["cashflow"], "cashflow.csv", {
      type: "text/csv",
    });

    render(<UploadFile />);

    await act(async () => {
      await latestUploadProps.customRequest({
        file,
        onSuccess,
        onError,
      });
    });

    expect(message.error).toHaveBeenCalledWith("Failed to upload cashflow.csv");
    expect(onError).toHaveBeenCalledTimes(1);
    expect(onError.mock.calls[0][0]).toBeInstanceOf(Error);
    expect(onError.mock.calls[0][0]).toMatchObject({
      message: "Failed to upload cashflow.csv",
    });
    expect(onSuccess).not.toHaveBeenCalled();
  });
});