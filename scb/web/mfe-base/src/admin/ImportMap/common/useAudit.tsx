import React from "react";
import { useContext } from "../../../hooks/provider";
import { GridColDef } from "ratan-design-origin/data-grid";
import useServices from "../services/useServices";
import { DateTimeFormat } from "../../../utils/locale";
import Status from "../../common/Status";
import { AdminRecord } from "../../common/interface";

const useAudit = () => {
  const [store] = useContext();
  const { getImportMapAudit } = useServices();
  const [importMap, setImportMap] = React.useState<AdminRecord>();
  const [data, setData] = React.useState<AdminRecord[]>([]);
  const [openAudit, setOpenAudit] = React.useState<boolean>(true);
  const onOpenAudit = React.useCallback(
    (row: AdminRecord) => () => {
      const temp = JSON.parse(JSON.stringify(row)) as AdminRecord;
      setImportMap(temp);
    },
    []
  );
  const getAuditData = React.useCallback(
    (_importMap: AdminRecord | undefined) => {
      if (_importMap && store.entitlementsToken) {
        getImportMapAudit(store.entitlementsToken, _importMap).then((_data) => {
          _data = _data.map((item) => {
            item.id = item.importMapAuditId;
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
    getAuditData(importMap);
  }, [importMap]);
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
        },
        {
          field: "transactionMode",
          headerName: "Transaction Mode",
          width: 200,
          readOnly: true,
        },
        {
          field: "importMapId",
          headerName: "Import Map ID",
          width: 100,
          hideable: false,
        },
        {
          field: "keyName",
          headerName: "Module Name",
          width: 300,
          hideable: false,
        },
        {
          field: "path",
          headerName: "Path",
          width: 500,
          hideable: false,
        },
        {
          field: "active",
          headerName: "Verified?",
          width: 100,
          readOnly: true,
          hideable: false,
          align: "center",
          renderCell: (props) => <Status {...props} />,
        },
        {
          field: "createdAt",
          headerName: "Created At",
          width: 200,
          readOnly: true,
          valueGetter: (value) => {
            let date = new Date();
            if (value.row?.updatedAt?.length) {
              date = new Date(value.row.createdAt);
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
          valueGetter: (value) => {
            let date = new Date();
            if (value.row?.updatedAt?.length) {
              date = new Date(value.row.updatedAt);
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
      ] as GridColDef[],
    [store?.timeType]
  );
  const onCloseAudit = React.useCallback(() => {
    setData([]);
    setImportMap(undefined);
    setOpenAudit(false);
  }, []);
  return {
    store,
    auditColumns,
    auditRows,
    openAudit,
    onCloseAudit,
    importMap,
    setImportMap,
    onOpenAudit,
    getAuditData,
  };
};

export default useAudit;
