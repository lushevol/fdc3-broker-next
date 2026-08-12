import { UploadOutlined } from "@ant-design/icons";
import { message, Upload } from "antd";
import type { UploadProps } from "antd/es/upload/interface";
import { Button } from "Import/index";
import type { UploadRequestOption } from "rc-upload/lib/interface";
import { FC, memo, useState } from "react";
import { CASHFLOW_BLOTTER_UPLOAD_BTN } from "src/Root/analysis/const";

import { uploadConfirmationFile } from "../../services";
import type { UploadConfirmationResponse } from "../../services/type";

type UploadRequestError = {
  message?: string;
  response?: {
    status?: number;
    data?: UploadConfirmationResponse;
  };
};
const CSV_MIME_TYPES = new Set(["text/csv", "application/vnd.ms-excel"]);
const MAX_UPLOAD_SIZE_MB = 20;
const MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024;
const isFile = (value: unknown): value is File => value instanceof File;

const isUploadRequestError = (error: unknown): error is UploadRequestError => {
  if (!error || typeof error !== "object") {
    return false;
  }

  return "message" in error || "response" in error;
};

const getUploadErrorMessage = (error: unknown, fileName: string) => {
  if (isUploadRequestError(error)) {
    const responseData = error.response?.data;
    const status = responseData?.status || error.response?.status;
    const errorCode = responseData?.errorCode;
    const baseMessage =
      responseData?.errorMessage ||
      responseData?.message ||
      error.message ||
      `Failed to upload ${fileName}`;

    if (status && errorCode) {
      return `${errorCode}: ${baseMessage}`;
    }
    if (status) {
      return `${baseMessage}`;
    }
    return baseMessage;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return `Failed to upload ${fileName}`;
};

export const UploadFile: FC = memo(() => {
  const [uploading, setUploading] = useState(false);

  const beforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isCsvFile =
      file.name.toLowerCase().endsWith(".csv") || CSV_MIME_TYPES.has(file.type);
    if (!isCsvFile) {
      message.error("Only Support upload CSV file");
      return Upload.LIST_IGNORE;
    }
    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      message.error(`File size cannot exceed ${MAX_UPLOAD_SIZE_MB}M`);
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const customRequest = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    setUploading(true);

    try {
      if (!isFile(file)) {
        throw new Error("Selected upload is not a valid file");
      }
      const response = await uploadConfirmationFile(file);
      message.success(`${file.name} uploaded successfully`);
      onSuccess?.(response, new XMLHttpRequest());
    } catch (error: unknown) {
      const errorMessage = getUploadErrorMessage(
        error,
        isFile(file) ? file.name : "selected file"
      );
      message.error(errorMessage);
      onError?.(error instanceof Error ? error : new Error(errorMessage));
    } finally {
      setUploading(false);
    }
  };

  return (
    <Upload
      accept=".csv"
      beforeUpload={beforeUpload}
      customRequest={customRequest}
      maxCount={1}
      multiple={false}
      showUploadList={false}
      disabled={uploading}
      name="file"
    >
      <Button
        startIcon={<UploadOutlined style={{ fontSize: "14px" }} />}
        data-testid={CASHFLOW_BLOTTER_UPLOAD_BTN}
        variant="outlined"
        size="medium"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "KR COMP"}
      </Button>
    </Upload>
  );
});

export default UploadFile;
