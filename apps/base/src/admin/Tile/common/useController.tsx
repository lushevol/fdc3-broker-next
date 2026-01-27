import type { GridColDef } from '@mui/x-data-grid';
import React from 'react';
import type { Entity } from '../../../hooks/model/root';
import { useContext } from '../../../hooks/provider';
import Actions from '../../common/Actions';
import DateTime from '../../common/DateTime';
import Status from '../../common/Status';
import { getAdminModuleEms2Role } from '../../common/utils';
import useServices from '../services/useServices';
import type { TileProps } from './interface';
import useAudit from './useAudit';
import useTableDetail from './useTableDetail';

const useController = (_props: TileProps) => {
  const [store] = useContext();
  const [importMap, setImportMap] = React.useState<any>([]);
  const [originalCategories, setOriginalCategories] = React.useState<any>([]);
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
  } = useTableDetail(originalCategories, importMap);
  const {
    auditColumns,
    auditRows,
    openAudit,
    onCloseAudit,
    tile,
    setTile,
    onOpenAudit,
    getAuditData,
  } = useAudit();
  const { getTile, getCategory, getImportMap } = useServices();
  const [category, setCategory] = React.useState<any>();
  const [categories, setCategories] = React.useState<any>([]);
  const [inputValue, setInputValue] = React.useState('');
  const setCategoryData = React.useCallback(
    (_data) => {
      _data = _data.map((item) => {
        item.id = item.applicationCategoryId;
        return item;
      });
      if (_data.length === 1) {
        setCategories(_data);
      } else {
        setCategories([{ id: -1, label: 'All' }, ..._data]);
      }
      setOriginalCategories(_data);
    },
    [store.entitlementsToken],
  );
  const initData = React.useCallback(() => {
    getCategory(store.entitlementsToken).then(setCategoryData);
    getImportMap(store.entitlementsToken).then((_data) => {
      _data = _data.map((item) => {
        item.id = item.applicationCategoryId;
        return item;
      });
      setImportMap(_data);
    });
  }, [store.entitlementsToken]);
  React.useEffect(() => {
    if (store.entitlementsToken) {
      initData();
    }
  }, [store.entitlementsToken]);
  const getCategoryData = React.useCallback(
    (_category) => {
      let filter = {};
      if (_category?.id !== -1) {
        filter = { applicationCategory: _category };
      }
      getTile(store.entitlementsToken, filter).then((_data) => {
        _data = _data.map((item) => {
          item.id = item.applicationTileId;
          return item;
        });
        setData(_data);
      });
    },
    [store.entitlementsToken],
  );
  React.useEffect(() => {
    getCategoryData(category);
  }, [category]);
  const ems2Role = React.useMemo(
    () => getAdminModuleEms2Role(store.entities as Entity[]),
    [store.entities],
  );
  const onCategoryChange = React.useCallback((_event: any, newValue: any) => {
    setCategory(newValue);
  }, []);
  const refresh = React.useCallback(() => {
    initData();
    getCategoryData(category);
  }, [category]);
  const onInputChange = React.useCallback((_event: any, newInputValue: any) => {
    if (newInputValue === '') {
      setCategory(undefined);
      setData([]);
    }
    setInputValue(newInputValue);
  }, []);
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
          getActions: (value) => Actions({ value, onOpen, onOpenAudit }),
        },
        {
          field: 'applicationCategory',
          headerName: 'Aplication Category',
          width: 250,
          type: 'autoComplete',
          hiddenImage: true,
          valueOptions: [...originalCategories.map((e) => e.label)],
          renderCell: (props: any) => props?.row?.applicationCategory?.label,
          valueGetter: (props: any) => props?.row?.applicationCategory?.label,
        },
        {
          field: 'title',
          headerName: 'Tile Name',
          width: 200,
        },
        {
          field: 'subtitle',
          headerName: 'Description',
          width: 200,
        },
        {
          field: 'imageDarkTheme',
          headerName: 'Image URL for Dark Theme',
          width: 300,
          type: 'autoComplete',
          valueOptions: [
            'darkIcons/cashflow.dark.svg',
            'darkIcons/cn.settlement.dark.svg',
            'darkIcons/exception.dark.svg',
            'darkIcons/mo.exception.dark.svg',
            'darkIcons/rules.dark.svg',
            'darkIcons/settlment.exception.dark.svg',
            'darkIcons/suppression.rules.svg',
            'darkIcons/trade.dark.svg',
            'darkIcons/icon01.svg',
            'darkIcons/icon02.svg',
            'darkIcons/icon03.svg',
            'darkIcons/icon04.svg',
            'darkIcons/icon05.svg',
            'darkIcons/icon06.svg',
            'darkIcons/icon07.svg',
            'darkIcons/icon08.svg',
            'darkIcons/icon09.svg',
            'darkIcons/icon10.svg',
            'darkIcons/icon11.svg',
            'darkIcons/icon12.svg',
            'darkIcons/icon13.svg',
            'darkIcons/icon14.svg',
          ],
        },
        {
          field: 'imageLightTheme',
          headerName: 'Image URL for Light Theme',
          width: 300,
          type: 'autoComplete',
          valueOptions: [
            'lightIcons/cashflow.light.svg',
            'lightIcons/cn.settlement.light.svg',
            'lightIcons/exception.light.svg',
            'lightIcons/mo.exception.light.svg',
            'lightIcons/rules.light.svg',
            'lightIcons/settlment.exception.light.svg',
            'lightIcons/suppression.rules.svg',
            'lightIcons/trade.light.svg',
            'lightIcons/icon01.svg',
            'lightIcons/icon02.svg',
            'lightIcons/icon03.svg',
            'lightIcons/icon04.svg',
            'lightIcons/icon05.svg',
            'lightIcons/icon06.svg',
            'lightIcons/icon07.svg',
            'lightIcons/icon08.svg',
            'lightIcons/icon09.svg',
            'lightIcons/icon10.svg',
            'lightIcons/icon11.svg',
            'lightIcons/icon12.svg',
            'lightIcons/icon13.svg',
            'lightIcons/icon14.svg',
          ],
        },
        {
          field: 'importMap',
          headerName: 'Container',
          width: 250,
          type: 'autoComplete',
          valueOptions: [...importMap.map((e) => e.keyName)],
          renderCell: (props: any) => props?.row?.importMap?.keyName,
          valueGetter: (props: any) => props?.row?.importMap?.keyName,
          hiddenImage: true,
        },
        {
          field: 'module',
          headerName: 'Module Path',
          width: 150,
        },
        {
          field: 'tile',
          headerName: 'Tile Path',
          width: 150,
        },
        {
          field: 'ems2Subject',
          headerName: 'Role Subject',
          width: 150,
        },
        {
          field: 'ems2Entities',
          headerName: 'Role Entities',
          width: 300,
          multiline: true,
        },
        {
          field: 'template',
          headerName: 'Is Template?',
          width: 100,
          type: 'singleSelect',
          valueOptions: ['true', 'false'],
        },
        {
          field: 'emailSupport',
          headerName: 'Email Support',
          width: 300,
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
          field: 'applicationTileId',
          headerName: 'Record Id',
          width: 100,
          readOnly: true,
          placeholder: '<<will be auto generated>>',
        },
        {
          field: 'applicationCategoryId',
          headerName: 'Aplication Category Record Id',
          width: 150,
          readOnly: true,
          renderCell: (props: any) => props?.row?.applicationCategory?.applicationCategoryId,
          valueGetter: (props: any) => props?.row?.applicationCategory?.applicationCategoryId,
          placeholder: '<<will be auto generated>>',
        },
        {
          field: 'importMapId',
          headerName: 'Container Record Id',
          width: 150,
          readOnly: true,
          renderCell: (props: any) => props?.row?.importMap?.importMapId,
          valueGetter: (props: any) => props?.row?.importMap?.importMapId,
          placeholder: '<<will be auto generated>>',
        },
        {
          field: 'orderNo',
          headerName: 'Order No',
          width: 100,
          type: 'number',
        },
      ] as GridColDef[],
    [store?.timeType, importMap, originalCategories],
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
    temp.applicationCategory = category;
    temp.ems2Role = ems2Role;
    onOpen(temp, 'new')();
  }, [columns, data, onOpen, category, ems2Role]);

  const disableCreateNew = React.useMemo(() => !category || category?.id === -1, [category]);

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
    tile,
    setTile,
    categories,
    category,
    onCategoryChange,
    onInputChange,
    inputValue,
    onOpenAudit,
    getAuditData,
    setCategories,
    setOriginalCategories,
    getCategoryData,
    refresh,
    initData,
    setCategoryData,
    disableCreateNew,
  };
};

export default useController;
