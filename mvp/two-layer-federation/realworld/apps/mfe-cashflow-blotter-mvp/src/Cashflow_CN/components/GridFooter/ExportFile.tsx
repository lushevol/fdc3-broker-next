import { FileExcelOutlined } from "@ant-design/icons";
import { Input, Select } from "antd";
import dayjs from "dayjs";
import { Button } from "Import/index";
import { useViewName } from "Import/ratancomponents";
import { getUser, hasPermission } from "Import/ratanutils";
import { FC, memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  CASHFLOW_BLOTTER_EXPORT_FILE_BTN,
  CASHFLOW_BLOTTER_EXPORT_FILE_CONFIRM_BTN,
} from "src/Root/analysis/const";

import { RootState } from "../../Main/store/interface";
import StyledMuiDialog, { classes } from "./common/exportFileStyle";

const { Option } = Select;

export const ExportFile: FC = memo(() => {
  const [isOpen, setIsOpen] = useState(false);
  const [format, setFormat] = useState("CSV");
  const selectedViewName = useViewName();

  const { api } = useSelector((state: RootState) => state.cashflowGridEvent);
  const exportingDate = dayjs().format("DD-MM-YYYY");
  const formatFileName = (str: string) => {
    return str.replace(/[^a-zA-Z-_0-9]/, "");
  };
  const formattedFileName = `Cashflow_${getUser().id}_${
    selectedViewName.viewName || "Unnamed"
  }_${exportingDate}`;
  const [fileName, setFileName] = useState(formattedFileName);

  useEffect(() => {
    setFileName(formattedFileName);
  }, [isOpen]);

  const exportCashflow = () => {
    if (format === "CSV") {
      api?.exportDataAsCsv({
        fileName: fileName,
      });
    } else {
      api?.exportDataAsExcel({
        fileName: fileName,
      });
    }
  };
  return (
    <>
      {hasPermission("RATAN_STRATEGIC_CASHFLOW_BLOTTER:F_Export_Data") && (
        <>
          <Button
            className="button"
            disabled={!api}
            onClick={(e) => setIsOpen(true)}
            data-testid={CASHFLOW_BLOTTER_EXPORT_FILE_BTN}
            startIcon={<FileExcelOutlined style={{ fontSize: "14px" }} />}
            variant="outlined"
            size="medium"
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
                data-testid={CASHFLOW_BLOTTER_EXPORT_FILE_CONFIRM_BTN}
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
      )}
    </>
  );
});
