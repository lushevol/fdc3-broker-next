import EditIcon from '@mui/icons-material/Edit';
import Tooltip from '@mui/material/Tooltip';
import type { GridColDef } from '@mui/x-data-grid';
import { GridActionsCellItem as GridAction } from '@mui/x-data-grid';
import React from 'react';
import { useContext } from '../../../hooks/provider';
import useServices from '../services/useServices';
import type { FDC3DeclarationProps } from './interface';
import {
  filterDeclarations,
  findTileLabel,
  getDeclarationSummary,
  getReferencedContextTypes,
  getReferencedIntentNames,
  normalizeInterop,
} from './model';
import useTableDetail from './useTableDetail';

const useController = (_props: FDC3DeclarationProps) => {
  const [store] = useContext();

  const [intents, setIntents] = React.useState<any[]>([]);
  const [contexts, setContexts] = React.useState<any[]>([]);
  const [tiles, setTiles] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');

  // We don't need categories anymore, just passing empty struct to table detail hook if needed?
  // Actually useTableDetail might need category logic? let's see.
  // Viewing useTableDetail, it takes 'categories' and uses 'getCategory' util.
  // We should probably simplify useTableDetail call or just pass empty array.

  const {
    onClose,
    onOpen,
    data,
    setData,
    record,
    isLoading,
    setIsLoading, // Exposed to manual control
    openDetail,
  } = useTableDetail([]); // No categories needed

  const {
    getDeclaration,
    deleteDeclaration,
    createDeclaration,
    updateDeclaration,
    getIntentList,
    getContextList,
    createIntent,
    updateIntent,
    deleteIntent,
    createContext,
    updateContext,
    deleteContext,
    getTile,
  } = useServices();

  const initData = React.useCallback(() => {
    // Fetch all declarations (no category filter)
    getDeclaration(store.entitlementsToken, {}).then((_data) => {
      if (_data) {
        const mapped = _data.map((item) => ({
          ...item,
          id: item.appId,
          interop: normalizeInterop(item.interop),
        }));
        setData(mapped);
      }
    });
    getIntentList(store.entitlementsToken).then(setIntents);
    getContextList(store.entitlementsToken).then(setContexts);
    getTile(store.entitlementsToken).then(setTiles);
  }, [store.entitlementsToken]);

  const filteredRows = React.useMemo(
    () => filterDeclarations(data, tiles, search),
    [data, tiles, search],
  );

  const summary = React.useMemo(
    () => getDeclarationSummary(data, intents, contexts),
    [data, intents, contexts],
  );

  React.useEffect(() => {
    if (store.entitlementsToken) {
      initData();
    }
  }, [store.entitlementsToken]);

  // Custom Save logic called by our Dialog
  const handleSaveDeclaration = async (formData: any) => {
    setIsLoading(true);
    let result;
    // Check if it's an update or create based on existence in data?
    // Or we can rely on what the dialog sends us.
    // Usually "Edit" mode in Dialog knows if it's existing.
    // But typically we look at if appId exists in current list?
    // Wait, appId is the ID. If we are editing, we are updating.
    // If creating, we are creating.
    // The API distinguishes by endpoint.

    // NOTE: Logic here: if we allow editing appId, it's a new record.
    // But usually appId is providing identity.
    // If we are in "Edit" mode (record is set), we update.
    // If we are in "New", we create.

    // However, our Dialog handles "Edit" vs "Create" label, but we need to call right API.
    // Let's assume if record is present, it's an update.
    if (record) {
      result = await updateDeclaration(store.entitlementsToken, formData);
      // Update local data
      if (result?.appId) {
        setData((prev) =>
          prev.map((p) =>
            p.appId === result.appId
              ? { ...result, id: result.appId, interop: normalizeInterop(result.interop) }
              : p,
          ),
        );
      }
    } else {
      result = await createDeclaration(store.entitlementsToken, formData);
      // Add to local data
      if (result?.appId) {
        setData((prev) => [
          { ...result, id: result.appId, interop: normalizeInterop(result.interop) },
          ...prev,
        ]);
      }
    }
    setIsLoading(false);
    onClose(); // Close the record detail/dialog state
  };

  const handleDelete = React.useCallback(
    async (row) => {
      // Use custom confirm dialog here? Or keep window.confirm for now if not requested to change DELETE flow specifically for grid?
      // User said "optimize layout... make it professional". Custom confirm is better.
      // But for now let's stick to valid logic.
      if (window.confirm(`Are you sure you want to delete ${row.appId}?`)) {
        setIsLoading(true);
        await deleteDeclaration(store.entitlementsToken, row);
        setData((prev) => prev.filter((d) => d.appId !== row.appId));
        setIsLoading(false);
      }
    },
    [store.entitlementsToken, deleteDeclaration],
  );

  const handleDeleteDeclaration = React.useCallback(
    async (row) => {
      setIsLoading(true);
      await deleteDeclaration(store.entitlementsToken, row);
      setData((prev) => prev.filter((d) => d.appId !== row.appId));
      setIsLoading(false);
      onClose();
    },
    [store.entitlementsToken, deleteDeclaration, onClose],
  );

  const columns: GridColDef[] = React.useMemo(
    () =>
      [
        {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 150,
          getActions: (value) => [
            <GridAction
              icon={
                <Tooltip title="View Details">
                  <EditIcon />
                </Tooltip>
              }
              label="View Details"
              className="textPrimary"
              onClick={onOpen(value.row, 'edit')}
              color="primary"
              key={`edit-${value.row.id}`}
            />,
          ],
        },
        {
          field: 'appId',
          headerName: 'App ID (Tile)',
          width: 250,
        },
        {
          field: 'tileTitle',
          headerName: 'Tile',
          width: 260,
          valueGetter: (params) => findTileLabel(tiles, params.row.appId) || params.row.appId,
        },
        {
          field: 'listensForCount',
          headerName: 'Listens',
          width: 100,
          valueGetter: (params) => normalizeInterop(params.row.interop).intents.listensFor.length,
        },
        {
          field: 'raisesCount',
          headerName: 'Raises',
          width: 100,
          valueGetter: (params) => normalizeInterop(params.row.interop).intents.raises?.length ?? 0,
        },
        {
          field: 'interop',
          headerName: 'Interop Details',
          width: 600,
          valueFormatter: (params) => {
            const listens = Object.keys(params.value?.intents?.listensFor || {}).length;
            const raises = Object.keys(params.value?.intents?.raises || {}).length;
            return `Listens: ${listens}, Raises: ${raises}`;
          },
        },
      ] as GridColDef[],
    [onOpen, handleDelete, tiles],
  );

  const onCreateNew = React.useCallback(() => {
    // Clear record to indicate new mode
    onOpen(null, 'new')();
  }, [onOpen]);

  // We no longer disable create based on category
  // We no longer disable create based on category
  const disableCreateNew = false;

  return {
    store,
    refresh: initData,
    columns,
    rows: filteredRows,
    onCreateNew,
    disableCreateNew,
    onClose,
    onOpen, // Used to open dialog
    record, // Holds current editing record or null
    isLoading,
    intents,
    contexts,
    tiles,
    search,
    setSearch,
    summary,
    deleteDeclaration: handleDeleteDeclaration,
    intentReferences: (intentName: string) => getReferencedIntentNames(data, intentName),
    contextReferences: (contextType: string) => getReferencedContextTypes(data, contextType),
    createIntent: async (data) => {
      await createIntent(store.entitlementsToken, data);
      getIntentList(store.entitlementsToken).then(setIntents);
    },
    updateIntent: async (data) => {
      await updateIntent(store.entitlementsToken, data);
      getIntentList(store.entitlementsToken).then(setIntents);
    },
    deleteIntent: async (data) => {
      await deleteIntent(store.entitlementsToken, data);
      getIntentList(store.entitlementsToken).then(setIntents);
    },
    createContext: async (data) => {
      await createContext(store.entitlementsToken, data);
      getContextList(store.entitlementsToken).then(setContexts);
    },
    updateContext: async (data) => {
      await updateContext(store.entitlementsToken, data);
      getContextList(store.entitlementsToken).then(setContexts);
    },
    deleteContext: async (data) => {
      await deleteContext(store.entitlementsToken, data);
      getContextList(store.entitlementsToken).then(setContexts);
    },
    handleSaveDeclaration, // New save handler
    openDetail,
  };
};

export default useController;
