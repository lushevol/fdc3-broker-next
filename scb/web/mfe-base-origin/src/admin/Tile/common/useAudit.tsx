import React from "react";
import { useContext } from "../../../hooks/provider";
import { GridColDef } from "@mui/x-data-grid";
import useServices from "../services/useServices";
import { DateTimeFormat } from "../../../utils/locale";
import Status from "../../common/Status";
import { AdminRecord } from "../../common/interface";

const useAudit = () => {
  const [store] = useContext();
  const { getTileAudit } = useServices();
  const [tile, setTile] = React.useState<AdminRecord>();
  const [data, setData] = React.useState<AdminRecord[]>([]);
  const [openAudit, setOpenAudit] = React.useState<boolean>(true);
  const onOpenAudit = React.useCallback(
    (row: AdminRecord) => () => {
      const temp = JSON.parse(JSON.stringify(row)) as AdminRecord;
      setTile(temp);
    },
    []
  );
  const getAuditData = React.useCallback(
    (_tile: AdminRecord | undefined) => {
      if (_tile && store.entitlementsToken) {
        getTileAudit(store.entitlementsToken, _tile).then((_data) => {
          _data = _data.map((item) => {
            item.id = item.applicationTileAuditId;
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
    getAuditData(tile);
  }, [tile]);
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
          field: "applicationTileId",
          headerName: "Tile ID",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "applicationCategory",
          headerName: "Aplication Category",
          width: 250,
          hideable: false,
          readOnly: true,
          renderCell: (props) => props.row.applicationCategory.label,
        },
        {
          field: "title",
          headerName: "Tile Name",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "subtitle",
          headerName: "Description",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "imageDarkTheme",
          headerName: "Image URL for Dark Theme",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "imageLightTheme",
          headerName: "Image URL for Light Theme",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "importMap",
          headerName: "Container",
          width: 250,
          hideable: false,
          readOnly: true,
          renderCell: (props) => props.row.importMap.keyName,
        },
        {
          field: "module",
          headerName: "Module Path",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "tile",
          headerName: "Tile Path",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "ems2Subject",
          headerName: "Role Subject",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "ems2Entities",
          headerName: "Role Entities",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "template",
          headerName: "Is Template?",
          width: 100,
          hideable: false,
          readOnly: true,
        },
        {
          field: "emailSupport",
          headerName: "Email Support",
          width: 100,
          hideable: false,
          readOnly: true,
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
    setTile(undefined);
    setOpenAudit(false);
  }, []);
  return {
    store,
    auditColumns,
    auditRows,
    openAudit,
    onCloseAudit,
    tile,
    setTile,
    onOpenAudit,
    getAuditData,
  };
};

export default useAudit;
