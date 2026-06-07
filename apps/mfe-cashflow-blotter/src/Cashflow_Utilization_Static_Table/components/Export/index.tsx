import { FileExcelOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import dayjs from "dayjs";
import { Button } from "Import/index";
import { getUser } from "Import/ratanutils";
import { FC, memo, useEffect, useState } from "react";
import {
  UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_BTN,
  UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_CONFIRM_BTN,
} from "src/Root/analysis/const";

import { useAppSelector } from "../../store";
import StyledMuiDialog, { classes } from "./style";

const { Option } = Select;

export const ExportFileEntry: FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState("CSV");

  const { aggridEvent } = useAppSelector((state) => state.aggrid);
  const exportingDate = dayjs().format("DD-MM-YYYY");
  const formatFileName = (str: string) => {
    return str.replace(/[^a-zA-Z-_0-9]/g, "");
  };
  const formattedFileName = `Utilization_Static_Blotter_${
    getUser().id
  }_${exportingDate}`;
  const [fileName, setFileName] = useState(formattedFileName);

  useEffect(() => {
    setFileName(formattedFileName);
  }, [isOpen]);

  const exportCashflow = () => {
    if (format === "CSV") {
      aggridEvent?.api?.exportDataAsCsv({
        fileName: fileName,
      });
    } else {
      aggridEvent?.api?.exportDataAsExcel({
        fileName: fileName,
      });
    }
  };
  return (
    <>
      <Button
        className="button"
        disabled={!aggridEvent?.api}
        onClick={(e) => setIsOpen(true)}
        startIcon={<FileExcelOutlined style={{ fontSize: "14px" }} />}
        variant="outlined"
        size="medium"
        data-testid={UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_BTN}
      >
        Export File
      </Button>
      <StyledMuiDialog
        className="cashflow-export-file-dialog"
        title="Export File"
        height="220px"
        open={isOpen}
        destroyWhenHidden={false}
        // enableOtherClose={true}
        onClose={() => setIsOpen(false)}
        testId="closeExport"
        actions={
          <Button
            className={classes.btn}
            variant="contained"
            data-testid={UTILIZATION_STATIC_BLOTTER_EXPORT_FILE_CONFIRM_BTN}
            onClick={(e) => exportCashflow()}
          >
            Export
          </Button>
        }
      >
        <div className={classes.root}>
          <div className={classes.item}>
            <label className={classes.label} htmlFor="export-file-name">
              File Name
            </label>
            <Input
              id="export-file-name"
              size="small"
              value={formatFileName(fileName)}
              onChange={(e) => setFileName(e.target.value)}
              data-testid="exportFileName"
            />
          </div>
          <div className={classes.item}>
            <label className={classes.label} htmlFor="export-file-format">
              Format
            </label>
            <Select
              id="export-file-format"
              placeholder="Select..."
              size="small"
              defaultValue="CSV"
              onChange={(value: string) => setFormat(value)}
              data-testid="exportFileFormat"
            >
              <Option value="CSV" data-testid="csv">
                CSV
              </Option>
              <Option value="EXCEL" data-testid="excel">
                XLSX
              </Option>
            </Select>
          </div>
        </div>
      </StyledMuiDialog>
    </>
  );
});
