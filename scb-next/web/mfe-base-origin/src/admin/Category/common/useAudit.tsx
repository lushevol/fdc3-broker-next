import React from "react";
import { useContext } from "../../../hooks/provider";
import { GridColDef } from "@mui/x-data-grid";
import useServices from "../services/useServices";
import { DateTimeFormat } from "../../../utils/locale";
import Status from "../../common/Status";
import { AdminRecord } from "../../common/interface";

const useAudit = () => {
  const [store] = useContext();
  const { getCategoryAudit } = useServices();
  const [category, setCategory] = React.useState<AdminRecord>();
  const [data, setData] = React.useState<AdminRecord[]>([]);
  const [openAudit, setOpenAudit] = React.useState<boolean>(true);
  const onOpenAudit = React.useCallback(
    (row: AdminRecord) => () => {
      const temp = JSON.parse(JSON.stringify(row)) as AdminRecord;
      setCategory(temp);
    },
    []
  );
  const getAuditData = React.useCallback(
    (_category: AdminRecord | undefined) => {
      if (_category && store.entitlementsToken) {
        getCategoryAudit(store.entitlementsToken, _category).then((_data) => {
          _data = _data.map((item) => {
            item.id = item.applicationCategoryAuditId;
            return item;
          });
          setData(_data);
          setOpenAudit(true);
        });
      }
    },
    [store.entitlementsToken]
  );
  React.useEffect(() => {
    getAuditData(category);
  }, [category]);
  const auditRows = React.useMemo(() => {
    const copied = JSON.parse(JSON.stringify(data)) as AdminRecord[];
    return copied;
  }, [data]);
  const auditColumns: GridColDef[] = React.useMemo(
    () =>
      [
        {
          field: "id",
          headerName: "Audit ID",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "transactionMode",
          headerName: "Transaction Mode",
          width: 200,
          readOnly: true,
        },
        {
          field: "applicationCategoryId",
          headerName: "Category ID",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "label",
          headerName: "Category Label",
          width: 300,
        },
        {
          field: "active",
          headerName: "Verified?",
          width: 100,
          hideable: false,
          readOnly: true,
          align: "center",
          renderCell: (props) => <Status {...props} />,
        },
        {
          field: "createdAt",
          headerName: "Created At",
          width: 200,
          readOnly: true,
          valueGetter: (_value, row) => {
            let date = new Date();
            if (row?.updatedAt?.length) {
              date = new Date(row.createdAt);
            }
            return DateTimeFormat(
              store?.timeType?.toUpperCase(),
              date,
              "en",
              "medium",
              "medium"
            );
          },
        },
        {
          field: "createdBy",
          headerName: "Created By",
          width: 150,
          readOnly: true,
        },
        {
          field: "updatedAt",
          headerName: "Updated At",
          width: 200,
          readOnly: true,
          valueGetter: (_value, row) => {
            let date = new Date();
            if (row?.updatedAt?.length) {
              date = new Date(row.updatedAt);
            }
            return DateTimeFormat(
              store?.timeType?.toUpperCase(),
              date,
              "en",
              "medium",
              "medium"
            );
          },
        },
        {
          field: "updatedBy",
          headerName: "Updated By",
          width: 150,
          readOnly: true,
        },
        {
          field: "ems2Role",
          headerName: "Owner",
          width: 200,
          readOnly: true,
        },
        {
          field: "orderNo",
          headerName: "Order No",
          width: 100,
          hideable: false,
          readOnly: true,
        },
      ] as GridColDef[],
    [store?.timeType]
  );
  const onCloseAudit = React.useCallback(() => {
    setData([]);
    setCategory(undefined);
    setOpenAudit(false);
  }, []);
  return {
    store,
    auditColumns,
    auditRows,
    openAudit,
    onCloseAudit,
    onOpenAudit,
    getAuditData,
  };
};

export default useAudit;
