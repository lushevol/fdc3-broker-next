import type { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import useDispatcher from '../../../hooks/dispathcer';
import type { Entity } from '../../../hooks/model/root';
import { useContext } from '../../../hooks/provider';
import Actions from '../../common/Actions';
import DateTime from '../../common/DateTime';
import Status from '../../common/Status';
import { getAdminModuleEms2Role } from '../../common/utils';
import useServices from '../services/useServices';
import type { ImportMapProps } from './interface';
import useAudit from './useAudit';
import useTableDetail from './useTableDetail';

const useController = (props: ImportMapProps) => {
  const [store] = useContext();
  const { registerRefreshTab } = useDispatcher();
  const { getImportMap } = useServices();

  const {
    onClose,
    onOpen,
    onChange,
    onReset,
    openDetail,
    data,
    setData,
    record,
    onSave,
    onSaveData,
    resetId,
    onVerify,
    onUpdate,
    onUpdateData,
    isLoading,
    onDeactivate,
  } = useTableDetail();
  const {
    auditColumns,
    auditRows,
    openAudit,
    onCloseAudit,
    importMap,
    setImportMap,
    onOpenAudit,
    getAuditData,
  } = useAudit();
  const ems2Role = React.useMemo(
    () => getAdminModuleEms2Role(store.entities as Entity[]),
    [store.entities],
  );
  const refreshTab = React.useCallback(() => {
    getImportMap(store.entitlementsToken).then((_data) => {
      _data = _data.map((item) => {
        item.id = item.importMapId;
        return item;
      });
      setData(_data);
    });
  }, [store.entitlementsToken]);
  React.useEffect(() => {
    registerRefreshTab(props.tabId, refreshTab);
  }, [store.entitlementsToken]);
  React.useEffect(() => {
    if (store.entitlementsToken) {
      refreshTab();
    }
  }, [store.entitlementsToken]);
  const rows = React.useMemo(() => {
    const copied = JSON.parse(JSON.stringify(data));
    return copied;
  }, [data]);

  const columns: GridColDef[] = React.useMemo(
    () =>
      [
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 150,
          hideable: false,
          getActions: (value) => Actions({ value, onOpen, onOpenAudit }),
        },
        {
          field: 'keyName',
          headerName: 'Module Name',
          width: 300,
          hideable: false,
        },
        {
          field: 'path',
          headerName: 'Path',
          width: 500,
          hideable: false,
        },
        {
          field: 'ems2Role',
          headerName: 'Owner',
          width: 200,
          readOnly: ems2Role != 'SUPER_USER',
        },
        {
          field: 'active',
          headerName: 'Verified?',
          width: 100,
          readOnly: true,
          hideable: false,
          align: 'center',
          renderCell: (props) => <Status {...props} />,
        },
        {
          field: 'createdAt',
          headerName: 'Created At',
          width: 200,
          readOnly: true,
          renderCell: (props) => <DateTime {...props} />,
        },
        {
          field: 'createdBy',
          headerName: 'Created By',
          width: 150,
          readOnly: true,
        },
        {
          field: 'updatedAt',
          headerName: 'Updated At',
          width: 200,
          readOnly: true,
          renderCell: (props) => <DateTime {...props} />,
        },
        {
          field: 'updatedBy',
          headerName: 'Updated By',
          width: 150,
          readOnly: true,
        },
        {
          field: 'importMapId',
          headerName: 'Record Id',
          width: 100,
          readOnly: true,
          placeholder: '<<will be auto generated>>',
        },
      ] as GridColDef[],
    [store?.timeType],
  );
  const onCreateNew = React.useCallback(() => {
    const temp: any = columns.reduce((aggr, item) => {
      if (item.type !== 'actions') {
        aggr[item.field] = '';
      }
      if (item.field === 'active') {
        aggr[item.field] = false;
      }
      if (item.field === 'createdBy' || item.field === 'updatedBy') {
        aggr[item.field] = store.user?.id;
      }
      return aggr;
    }, {});
    temp.id = new Date().getTime();
    temp.createdAt = new Date();
    temp.updatedAt = new Date();
    temp.ems2Role = ems2Role;
    onOpen(temp, 'new')();
  }, [columns, data, onOpen, ems2Role]);

  return {
    store,
    onCreateNew,
    columns,
    rows,
    onClose,
    onOpen,
    onChange,
    openDetail,
    record,
    onReset,
    onSave,
    onSaveData,
    resetId,
    onVerify,
    onUpdate,
    onUpdateData,
    isLoading,
    onDeactivate,
    auditColumns,
    auditRows,
    openAudit,
    onCloseAudit,
    importMap,
    setImportMap,
    getAuditData,
    refreshTab,
    onOpenAudit,
  };
};

export default useController;
